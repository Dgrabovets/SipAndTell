using Microsoft.EntityFrameworkCore;
using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Catalog.Repositories;
using SipAndTell.Application.Common.SeedWork;

namespace SipAndTell.Infrastructure.Catalog.Repositories
{
    /// <summary>
    /// Репозиторий чаёв. Чужие чаи, ждущие проверки, он не отдаёт.
    /// </summary>
    public class TeaRepository : ITeaRepository
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
        public TeaRepository(SipAndTellContext context)
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
        public void Add(Tea tea)
        {
            _context.Teas.Add(tea);
        }

        /// <inheritdoc />
        public Task<Tea?> GetVisibleAsync(Guid id, long userId, CancellationToken cancellationToken = default)
        {
            return _context.Teas.FirstOrDefaultAsync(t => t.Id == id && (t.Status == CatalogStatus.Confirmed || t.OwnerId == userId), cancellationToken);
        }

        /// <inheritdoc />
        public Task<Tea?> FindVisibleByNameAsync(string name, long userId, CancellationToken cancellationToken = default)
        {
            var normalized = Tea.Normalize(name);
            return _context.Teas
                .Where(t => t.NormalizedName == normalized && (t.Status == CatalogStatus.Confirmed || t.OwnerId == userId))
                .OrderByDescending(t => t.Status)
                .FirstOrDefaultAsync(cancellationToken);
        }

        #endregion Методы
    }
}
