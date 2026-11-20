using MediatR;
using SipAndTell.Application.Catalog.Exceptions;
using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Catalog.Repositories;
using SipAndTell.Application.Evenings.Commands;
using SipAndTell.Application.Evenings.Models.Entities;
using SipAndTell.Application.Evenings.Repositories;

namespace SipAndTell.Infrastructure.Evenings.CommandHandlers
{
    /// <summary>
    /// Обработчик команды добавления чаепития. Чай и чаепитие сохраняются одной транзакцией.
    /// </summary>
    public class CreateEveningCommandHandler : IRequestHandler<CreateEveningCommand, Guid>
    {
        #region Поля

        /// <summary>
        /// Репозиторий чаёв
        /// </summary>
        private readonly ITeaRepository _teaRepository;

        /// <summary>
        /// Репозиторий чаепитий
        /// </summary>
        private readonly IEveningRepository _eveningRepository;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать обработчик
        /// </summary>
        /// <param name="teaRepository">Репозиторий чаёв</param>
        /// <param name="eveningRepository">Репозиторий чаепитий</param>
        public CreateEveningCommandHandler(ITeaRepository teaRepository, IEveningRepository eveningRepository)
        {
            _teaRepository = teaRepository ?? throw new ArgumentNullException(nameof(teaRepository));
            _eveningRepository = eveningRepository ?? throw new ArgumentNullException(nameof(eveningRepository));
        }

        #endregion Конструктор

        #region Методы

        /// <inheritdoc />
        public async Task<Guid> Handle(CreateEveningCommand request, CancellationToken cancellationToken)
        {
            var tea = await FindOrCreateTeaAsync(request, cancellationToken);
            var evening = new Evening(request.OwnerId, tea.Id, request.Score, request.Place, request.Time, request.Mood, request.Effects, request.Review, request.DrankAt);
            _eveningRepository.Add(evening);
            await _eveningRepository.UnitOfWork.SaveEntitiesAsync(cancellationToken);
            return evening.Id;
        }

        /// <summary>
        /// Взять известный чай или завести новый, который будет виден только автору до проверки
        /// </summary>
        private async Task<Tea> FindOrCreateTeaAsync(CreateEveningCommand request, CancellationToken cancellationToken)
        {
            if (request.TeaId is { } teaId)
            {
                return await _teaRepository.GetVisibleAsync(teaId, request.OwnerId, cancellationToken) ?? throw new TeaNotFoundException();
            }

            if (string.IsNullOrWhiteSpace(request.NewTeaName) || request.NewTeaType is null)
            {
                throw new ArgumentException("Нужен чай: идентификатор или название и тип");
            }

            var existing = await _teaRepository.FindVisibleByNameAsync(request.NewTeaName, request.OwnerId, cancellationToken);
            if (existing is not null)
            {
                return existing;
            }

            var created = new Tea(request.NewTeaName, request.NewTeaType.Value, request.OwnerId, CatalogStatus.Pending);
            _teaRepository.Add(created);
            return created;
        }

        #endregion Методы
    }
}
