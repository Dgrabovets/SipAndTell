using SipAndTell.Application.Auth.Models;

namespace SipAndTell.Server.Auth
{
    /// <summary>
    /// Пользователь Telegram в контексте запроса
    /// </summary>
    public static class HttpContextExtensions
    {
        #region Константы

        /// <summary>
        /// Ключ пользователя в контексте запроса
        /// </summary>
        private const string UserKey = "telegram-user";

        #endregion Константы

        #region Методы

        /// <summary>
        /// Запомнить проверенного пользователя
        /// </summary>
        /// <param name="context">Контекст запроса</param>
        /// <param name="user">Пользователь</param>
        public static void SetTelegramUser(this HttpContext context, TelegramUser user)
        {
            context.Items[UserKey] = user;
        }

        /// <summary>
        /// Получить проверенного пользователя
        /// </summary>
        /// <param name="context">Контекст запроса</param>
        /// <returns>Пользователь</returns>
        public static TelegramUser GetTelegramUser(this HttpContext context)
        {
            return context.Items[UserKey] as TelegramUser ?? throw new InvalidOperationException("Запрос не прошёл проверку Telegram");
        }

        #endregion Методы
    }
}
