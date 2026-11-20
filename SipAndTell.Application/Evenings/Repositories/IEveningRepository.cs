using SipAndTell.Application.Common.SeedWork;
using SipAndTell.Application.Evenings.Models.Entities;

namespace SipAndTell.Application.Evenings.Repositories
{
    /// <summary>
    /// Репозиторий чаепитий
    /// </summary>
    public interface IEveningRepository : IRepository<Evening>
    {
        /// <summary>
        /// Добавить чаепитие
        /// </summary>
        /// <param name="evening">Чаепитие</param>
        void Add(Evening evening);

        /// <summary>
        /// Удалить чаепитие
        /// </summary>
        /// <param name="evening">Чаепитие</param>
        void Remove(Evening evening);

        /// <summary>
        /// Найти чаепитие, если оно принадлежит пользователю
        /// </summary>
        /// <param name="id">Идентификатор чаепития</param>
        /// <param name="ownerId">Идентификатор пользователя</param>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>Чаепитие или null, в том числе если оно чужое</returns>
        Task<Evening?> GetOwnedAsync(Guid id, long ownerId, CancellationToken cancellationToken = default);
    }
}
