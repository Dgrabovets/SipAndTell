using SipAndTell.Application.Ai.Models;
using SipAndTell.Application.Ai.Services;
using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Evenings.Models.Enums;

namespace SipAndTell.Infrastructure.Ai
{
    /// <summary>
    /// Имитация разбора ИИ: всегда возвращает один и тот же черновик. Настоящую модель подключим, когда владелец выберет её и ключи.
    /// </summary>
    public class FakeAiDraftService : IAiDraftService
    {
        #region Методы

        /// <inheritdoc />
        public Task<DraftResult> FromPhotoAsync(Stream photo, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new DraftResult("Да Хун Пао", TeaType.Oolong, null, null, null, null, null, null));
        }

        /// <inheritdoc />
        public Task<DraftResult> FromVoiceAsync(Stream audio, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(new DraftResult(
                null,
                null,
                9,
                Place.Home,
                Daytime.Evening,
                [0.1, 0.25, 0.3, 0.85, 0, 0.35, 0, 0],
                [0.4, 0.5, 0.9, 0.6, 0.1, 0.7, 0.1],
                "Тёплый, с минеральной ноткой. Заварил шесть раз, к концу почти сладкий."));
        }

        #endregion Методы
    }
}
