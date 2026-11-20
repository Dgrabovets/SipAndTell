using Microsoft.AspNetCore.Mvc;
using SipAndTell.Application.Ai.Services;

namespace SipAndTell.Server.Controllers
{
    /// <summary>
    /// Черновик чаепития по фото или рассказу из приложения. Загруженный файл нигде не сохраняется.
    /// </summary>
    [ApiController]
    [Route("api/drafts")]
    public class DraftsController : ControllerBase
    {
        #region Константы

        /// <summary>
        /// Самый большой файл в байтах
        /// </summary>
        private const long MaxFileBytes = 15_000_000;

        #endregion Константы

        #region Поля

        /// <summary>
        /// Разбор фото и рассказа
        /// </summary>
        private readonly IAiDraftService _ai;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать контроллер
        /// </summary>
        /// <param name="ai">Разбор фото и рассказа</param>
        public DraftsController(IAiDraftService ai)
        {
            _ai = ai ?? throw new ArgumentNullException(nameof(ai));
        }

        #endregion Конструктор

        #region Методы

        /// <summary>
        /// Разобрать фото чая
        /// </summary>
        /// <param name="file">Фото</param>
        /// <param name="cancellationToken">Токен отмены</param>
        [HttpPost("photo")]
        [RequestSizeLimit(MaxFileBytes)]
        public async Task<IActionResult> Photo(IFormFile file, CancellationToken cancellationToken = default)
        {
            await using var stream = file.OpenReadStream();
            return Ok(await _ai.FromPhotoAsync(stream, cancellationToken));
        }

        /// <summary>
        /// Разобрать голосовой рассказ или звук видео
        /// </summary>
        /// <param name="file">Запись</param>
        /// <param name="cancellationToken">Токен отмены</param>
        [HttpPost("voice")]
        [RequestSizeLimit(MaxFileBytes)]
        public async Task<IActionResult> Voice(IFormFile file, CancellationToken cancellationToken = default)
        {
            await using var stream = file.OpenReadStream();
            return Ok(await _ai.FromVoiceAsync(stream, cancellationToken));
        }

        #endregion Методы
    }
}
