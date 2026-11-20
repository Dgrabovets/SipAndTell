using SipAndTell.Application.Auth.Services;

namespace SipAndTell.Server.Auth
{
    /// <summary>
    /// Проверка Telegram для запросов к /api: заголовок Authorization: tma initData. Без верной подписи ответ 401.
    /// </summary>
    public class TelegramAuthMiddleware
    {
        #region Константы

        /// <summary>
        /// Начало значения заголовка Authorization
        /// </summary>
        private const string Scheme = "tma ";

        #endregion Константы

        #region Поля

        /// <summary>
        /// Следующий обработчик запроса
        /// </summary>
        private readonly RequestDelegate _next;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать обработчик
        /// </summary>
        /// <param name="next">Следующий обработчик запроса</param>
        public TelegramAuthMiddleware(RequestDelegate next)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
        }

        #endregion Конструктор

        #region Методы

        /// <summary>
        /// Обработать запрос
        /// </summary>
        /// <param name="context">Контекст запроса</param>
        /// <param name="auth">Проверка данных Telegram</param>
        public async Task InvokeAsync(HttpContext context, ITelegramAuth auth)
        {
            if (!context.Request.Path.StartsWithSegments("/api"))
            {
                await _next(context);
                return;
            }

            var header = context.Request.Headers.Authorization.ToString();
            var user = header.StartsWith(Scheme, StringComparison.OrdinalIgnoreCase) ? auth.Validate(header[Scheme.Length..]) : null;
            if (user is null)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            context.SetTelegramUser(user);
            await _next(context);
        }

        #endregion Методы
    }
}
