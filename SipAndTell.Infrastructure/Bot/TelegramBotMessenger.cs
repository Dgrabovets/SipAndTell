using System.Net.Http.Json;
using System.Text.Json;
using SipAndTell.Application.Bot.Services;

namespace SipAndTell.Infrastructure.Bot
{
    /// <summary>
    /// Действия бота через Bot API Telegram. Токен приходит из окружения и в журнал не пишется.
    /// </summary>
    public class TelegramBotMessenger : IBotMessenger
    {
        #region Поля

        /// <summary>
        /// Клиент HTTP
        /// </summary>
        private readonly HttpClient _http;

        /// <summary>
        /// Токен бота
        /// </summary>
        private readonly string _token;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать клиента
        /// </summary>
        /// <param name="http">Клиент HTTP</param>
        /// <param name="token">Токен бота</param>
        public TelegramBotMessenger(HttpClient http, string token)
        {
            _http = http ?? throw new ArgumentNullException(nameof(http));
            ArgumentException.ThrowIfNullOrWhiteSpace(token);
            _token = token;
        }

        #endregion Конструктор

        #region Методы

        /// <inheritdoc />
        public async Task<Stream> DownloadAsync(string fileId, CancellationToken cancellationToken = default)
        {
            using var response = await _http.PostAsJsonAsync($"https://api.telegram.org/bot{_token}/getFile", new { file_id = fileId }, cancellationToken);
            response.EnsureSuccessStatusCode();
            using var document = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
            var path = document.RootElement.GetProperty("result").GetProperty("file_path").GetString();
            return await _http.GetStreamAsync($"https://api.telegram.org/file/bot{_token}/{path}", cancellationToken);
        }

        /// <inheritdoc />
        public async Task SendTextAsync(long chatId, string text, CancellationToken cancellationToken = default)
        {
            using var response = await _http.PostAsJsonAsync($"https://api.telegram.org/bot{_token}/sendMessage", new { chat_id = chatId, text }, cancellationToken);
            response.EnsureSuccessStatusCode();
        }

        /// <inheritdoc />
        public async Task DeleteMessageAsync(long chatId, int messageId, CancellationToken cancellationToken = default)
        {
            using var response = await _http.PostAsJsonAsync($"https://api.telegram.org/bot{_token}/deleteMessage", new { chat_id = chatId, message_id = messageId }, cancellationToken);
            response.EnsureSuccessStatusCode();
        }

        #endregion Методы
    }
}
