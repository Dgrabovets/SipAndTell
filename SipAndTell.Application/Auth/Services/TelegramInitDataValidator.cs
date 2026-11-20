using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Web;
using SipAndTell.Application.Auth.Models;

namespace SipAndTell.Application.Auth.Services
{
    /// <summary>
    /// Проверка initData по правилам Telegram: подпись HMAC-SHA256 от токена бота и срок действия
    /// </summary>
    public class TelegramInitDataValidator : ITelegramAuth
    {
        #region Поля

        /// <summary>
        /// Секретный ключ, полученный из токена бота
        /// </summary>
        private readonly byte[] _secretKey;

        /// <summary>
        /// Сколько данные считаются свежими
        /// </summary>
        private readonly TimeSpan _maxAge;

        /// <summary>
        /// Источник времени
        /// </summary>
        private readonly TimeProvider _time;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать проверку
        /// </summary>
        /// <param name="botToken">Токен бота</param>
        /// <param name="maxAge">Сколько данные считаются свежими</param>
        /// <param name="time">Источник времени</param>
        public TelegramInitDataValidator(string botToken, TimeSpan maxAge, TimeProvider time)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(botToken);
            _secretKey = HMACSHA256.HashData(Encoding.UTF8.GetBytes("WebAppData"), Encoding.UTF8.GetBytes(botToken));
            _maxAge = maxAge;
            _time = time ?? throw new ArgumentNullException(nameof(time));
        }

        #endregion Конструктор

        #region Методы

        /// <inheritdoc />
        public TelegramUser? Validate(string initData)
        {
            if (string.IsNullOrWhiteSpace(initData))
            {
                return null;
            }

            var pairs = HttpUtility.ParseQueryString(initData);
            var hash = pairs["hash"];
            if (string.IsNullOrEmpty(hash))
            {
                return null;
            }

            var checkString = string.Join(
                "\n",
                pairs.AllKeys.Where(k => k is not null and not "hash").OrderBy(k => k, StringComparer.Ordinal).Select(k => $"{k}={pairs[k]}"));
            var expected = HMACSHA256.HashData(_secretKey, Encoding.UTF8.GetBytes(checkString));

            byte[] given;
            try
            {
                given = Convert.FromHexString(hash);
            }
            catch (FormatException)
            {
                return null;
            }

            if (!CryptographicOperations.FixedTimeEquals(expected, given))
            {
                return null;
            }

            if (!long.TryParse(pairs["auth_date"], out var seconds)
                || _time.GetUtcNow() - DateTimeOffset.FromUnixTimeSeconds(seconds) > _maxAge)
            {
                return null;
            }

            return ReadUser(pairs["user"]);
        }

        /// <summary>
        /// Достать пользователя из поля user
        /// </summary>
        private static TelegramUser? ReadUser(string? json)
        {
            if (string.IsNullOrEmpty(json))
            {
                return null;
            }

            try
            {
                using var document = JsonDocument.Parse(json);
                var root = document.RootElement;
                var firstName = root.TryGetProperty("first_name", out var name) ? name.GetString() ?? string.Empty : string.Empty;
                return new TelegramUser(root.GetProperty("id").GetInt64(), firstName);
            }
            catch (Exception ex) when (ex is JsonException or KeyNotFoundException or InvalidOperationException or FormatException)
            {
                return null;
            }
        }

        #endregion Методы
    }
}
