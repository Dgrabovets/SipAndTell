using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Common.SeedWork;

namespace SipAndTell.Application.Catalog.Repositories
{
    /// <summary>
    /// Репозиторий чаёв
    /// </summary>
    public interface ITeaRepository : IRepository<Tea>
    {
        /// <summary>
        /// Добавить чай
        /// </summary>
        /// <param name="tea">Чай</param>
        void Add(Tea tea);

        /// <summary>
        /// Найти чай по идентификатору среди видимых пользователю: проверенных и своих
        /// </summary>
        /// <param name="id">Идентификатор чая</param>
        /// <param name="userId">Идентификатор пользователя</param>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>Чай или null</returns>
        Task<Tea?> GetVisibleAsync(Guid id, long userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Найти чай по названию среди видимых пользователю: проверенных и своих
        /// </summary>
        /// <param name="name">Название</param>
        /// <param name="userId">Идентификатор пользователя</param>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>Чай или null</returns>
        Task<Tea?> FindVisibleByNameAsync(string name, long userId, CancellationToken cancellationToken = default);
    }
}
