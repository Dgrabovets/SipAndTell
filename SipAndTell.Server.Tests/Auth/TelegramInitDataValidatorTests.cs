using System.Security.Cryptography;
using System.Text;
using SipAndTell.Application.Auth.Services;

namespace SipAndTell.Server.Tests.Auth
{
    /// <summary>
    /// Проверка подписи данных запуска Mini App
    /// </summary>
    public class TelegramInitDataValidatorTests
    {
        #region Поля

        private const string Token = "123456:test-token";
        private static readonly DateTimeOffset Now = new(2026, 11, 20, 12, 0, 0, TimeSpan.Zero);

        #endregion Поля

        #region Методы

        /// <summary>
        /// Подписать данные так, как это делает Telegram
        /// </summary>
        private static string Sign(string token, Dictionary<string, string> fields)
        {
            var check = string.Join("\n", fields.OrderBy(f => f.Key, StringComparer.Ordinal).Select(f => $"{f.Key}={f.Value}"));
            var secret = HMACSHA256.HashData(Encoding.UTF8.GetBytes("WebAppData"), Encoding.UTF8.GetBytes(token));
            var hash = Convert.ToHexStringLower(HMACSHA256.HashData(secret, Encoding.UTF8.GetBytes(check)));
            return string.Join("&", fields.Select(f => $"{f.Key}={Uri.EscapeDataString(f.Value)}")) + "&hash=" + hash;
        }

        private static Dictionary<string, string> Fields(DateTimeOffset authDate)
        {
            return new Dictionary<string, string>
            {
                ["auth_date"] = authDate.ToUnixTimeSeconds().ToString(),
                ["query_id"] = "AAH",
                ["user"] = "{\"id\":42,\"first_name\":\"Аня\"}",
            };
        }

        private static TelegramInitDataValidator Validator() => new(Token, TimeSpan.FromHours(24), new FixedTime(Now));

        /// <summary>
        /// Верная подпись даёт пользователя
        /// </summary>
        [Fact]
        public void Validate_ValidData_ReturnsUser()
        {
            var user = Validator().Validate(Sign(Token, Fields(Now.AddMinutes(-5))));

            Assert.NotNull(user);
            Assert.Equal(42, user.Id);
            Assert.Equal("Аня", user.FirstName);
        }

        /// <summary>
        /// Подпись, сделанная другим токеном, не проходит
        /// </summary>
        [Fact]
        public void Validate_WrongToken_ReturnsNull()
        {
            Assert.Null(Validator().Validate(Sign("999:other", Fields(Now))));
        }

        /// <summary>
        /// Подмена поля ломает подпись
        /// </summary>
        [Fact]
        public void Validate_TamperedField_ReturnsNull()
        {
            var signed = Sign(Token, Fields(Now)).Replace("42", "43");

            Assert.Null(Validator().Validate(signed));
        }

        /// <summary>
        /// Старые данные не принимаются
        /// </summary>
        [Fact]
        public void Validate_Expired_ReturnsNull()
        {
            Assert.Null(Validator().Validate(Sign(Token, Fields(Now.AddDays(-2)))));
        }

        /// <summary>
        /// Пустая строка, строка без подписи и мусор не проходят
        /// </summary>
        [Theory]
        [InlineData("")]
        [InlineData("auth_date=1&user=%7B%7D")]
        [InlineData("hash=zzzz&auth_date=1")]
        [InlineData("совсем не данные")]
        public void Validate_Garbage_ReturnsNull(string initData)
        {
            Assert.Null(Validator().Validate(initData));
        }

        #endregion Методы
    }
}
