using MediatR;
using SipAndTell.Application.Evenings.Commands;
using SipAndTell.Application.Evenings.Exceptions;
using SipAndTell.Application.Evenings.Repositories;

namespace SipAndTell.Infrastructure.Evenings.CommandHandlers
{
    /// <summary>
    /// Обработчик команды удаления своего чаепития. Чужое чаепитие выглядит как несуществующее.
    /// </summary>
    public class DeleteEveningCommandHandler : IRequestHandler<DeleteEveningCommand>
    {
        #region Поля

        /// <summary>
        /// Репозиторий чаепитий
        /// </summary>
        private readonly IEveningRepository _eveningRepository;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать обработчик
        /// </summary>
        /// <param name="eveningRepository">Репозиторий чаепитий</param>
        public DeleteEveningCommandHandler(IEveningRepository eveningRepository)
        {
            _eveningRepository = eveningRepository ?? throw new ArgumentNullException(nameof(eveningRepository));
        }

        #endregion Конструктор

        #region Методы

        /// <inheritdoc />
        public async Task Handle(DeleteEveningCommand request, CancellationToken cancellationToken)
        {
            var evening = await _eveningRepository.GetOwnedAsync(request.EveningId, request.OwnerId, cancellationToken) ?? throw new EveningNotFoundException();
            _eveningRepository.Remove(evening);
            await _eveningRepository.UnitOfWork.SaveEntitiesAsync(cancellationToken);
        }

        #endregion Методы
    }
}
