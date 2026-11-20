using SipAndTell.Application.Ai.Models;

namespace SipAndTell.Application.Ai.Services
{
    /// <summary>
    /// Разбор фото и рассказа в черновик чаепития
    /// </summary>
    public interface IAiDraftService
    {
        /// <summary>
        /// Разобрать фото чая: упаковка даёт название и тип, настой только догадку о типе
        /// </summary>
        /// <param name="photo">Содержимое фото</param>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>Черновик</returns>
        Task<DraftResult> FromPhotoAsync(Stream photo, CancellationToken cancellationToken = default);

        /// <summary>
        /// Расшифровать рассказ (голос или звук видео) и разложить по полям. Рассказ остаётся словами человека.
        /// </summary>
        /// <param name="audio">Содержимое записи</param>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>Черновик</returns>
        Task<DraftResult> FromVoiceAsync(Stream audio, CancellationToken cancellationToken = default);
    }
}
