using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using SipAndTell.Application.Bot.Models;
using SipAndTell.Application.Bot.Services;

namespace SipAndTell.Server.Controllers
{
    /// <summary>
    /// Вебхук бота. Telegram присылает секрет в заголовке X-Telegram-Bot-Api-Secret-Token, без него ответ 404.
    /// </summary>
    [ApiController]
    [Route("bot")]
    public class BotController : ControllerBase
    {
        #region Поля

        /// <summary>
        /// Обработка присланных боту файлов
        /// </summary>
        private readonly BotUpdateHandler _handler;

        /// <summary>
        /// Секрет вебхука из настроек
        /// </summary>
        private readonly string? _secret;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать контроллер
        /// </summary>
        /// <param name="handler">Обработка присланных боту файлов</param>
        /// <param name="configuration">Настройки: Telegram:WebhookSecret</param>
        public BotController(BotUpdateHandler handler, IConfiguration configuration)
        {
            _handler = handler ?? throw new ArgumentNullException(nameof(handler));
            _secret = configuration["Telegram:WebhookSecret"];
        }

        #endregion Конструктор

        #region Методы

        /// <summary>
        /// Принять обновление от Telegram
        /// </summary>
        /// <param name="update">Тело обновления</param>
        /// <param name="cancellationToken">Токен отмены</param>
        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] JsonElement update, CancellationToken cancellationToken = default)
        {
            var given = Request.Headers["X-Telegram-Bot-Api-Secret-Token"].ToString();
            if (string.IsNullOrEmpty(_secret) || !CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(given), Encoding.UTF8.GetBytes(_secret)))
            {
                return NotFound();
            }

            var parsed = Parse(update);
            if (parsed is not null)
            {
                await _handler.HandleAsync(parsed, cancellationToken);
            }

            return Ok();
        }

        /// <summary>
        /// Достать из обновления чат, сообщение и файлы
        /// </summary>
        private static BotUpdate? Parse(JsonElement update)
        {
            if (!update.TryGetProperty("message", out var message))
            {
                return null;
            }

            var chatId = message.GetProperty("chat").GetProperty("id").GetInt64();
            var messageId = message.GetProperty("message_id").GetInt32();
            string? photo = null;
            if (message.TryGetProperty("photo", out var sizes) && sizes.GetArrayLength() > 0)
            {
                photo = sizes[sizes.GetArrayLength() - 1].GetProperty("file_id").GetString();
            }

            return new BotUpdate(chatId, messageId, photo, FileId(message, "voice"), FileId(message, "video") ?? FileId(message, "video_note"));
        }

        /// <summary>
        /// Идентификатор файла из поля сообщения или null
        /// </summary>
        private static string? FileId(JsonElement message, string field)
        {
            return message.TryGetProperty(field, out var value) ? value.GetProperty("file_id").GetString() : null;
        }

        #endregion Методы
    }
}
