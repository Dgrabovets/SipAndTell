using SipAndTell.Application.Ai.Models;
using SipAndTell.Application.Ai.Services;

namespace SipAndTell.Server.Tests.Bot
{
    /// <summary>
    /// ИИ, который всегда падает
    /// </summary>
    internal sealed class BrokenAi : IAiDraftService
    {
        #region Методы

        /// <inheritdoc />
        public Task<DraftResult> FromPhotoAsync(Stream photo, CancellationToken cancellationToken = default) => throw new InvalidOperationException("сбой");

        /// <inheritdoc />
        public Task<DraftResult> FromVoiceAsync(Stream audio, CancellationToken cancellationToken = default) => throw new InvalidOperationException("сбой");

        #endregion Методы
    }
}
