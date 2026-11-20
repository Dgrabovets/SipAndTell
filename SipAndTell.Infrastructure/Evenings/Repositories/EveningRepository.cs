using Microsoft.EntityFrameworkCore;
using SipAndTell.Application.Common.SeedWork;
using SipAndTell.Application.Evenings.Models.Entities;
using SipAndTell.Application.Evenings.Repositories;

namespace SipAndTell.Infrastructure.Evenings.Repositories
{
    /// <summary>
    /// Репозиторий чаепитий. Чужое чаепитие он не отдаёт.
    /// </summary>
    public class EveningRepository : IEveningRepository
    {
        #region Поля

        /// <summary>
        /// Контекст базы данных
        /// </summary>
        private readonly SipAndTellContext _context;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать репозиторий
        /// </summary>
        /// <param name="context">Контекст базы данных</param>
        public EveningRepository(SipAndTellContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        #endregion Конструктор

        #region Свойства

        /// <inheritdoc />
        public IUnitOfWork UnitOfWork => _context;

        #endregion Свойства

        #region Методы

        /// <inheritdoc />
        public void Add(Evening evening)
        {
            _context.Evenings.Add(evening);
        }

        /// <inheritdoc />
        public void Remove(Evening evening)
        {
            _context.Evenings.Remove(evening);
        }

        /// <inheritdoc />
        public Task<Evening?> GetOwnedAsync(Guid id, long ownerId, CancellationToken cancellationToken = default)
        {
            return _context.Evenings.FirstOrDefaultAsync(e => e.Id == id && e.OwnerId == ownerId, cancellationToken);
        }

        #endregion Методы
    }
}
