using Microsoft.EntityFrameworkCore;
using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Common.SeedWork;
using SipAndTell.Application.Evenings.Models.Entities;

namespace SipAndTell.Infrastructure
{
    /// <summary>
    /// Контекст базы данных и единица работы приложения
    /// </summary>
    public class SipAndTellContext : DbContext, IUnitOfWork
    {
        #region Конструктор

        /// <summary>
        /// Создать контекст
        /// </summary>
        /// <param name="options">Настройки контекста</param>
        public SipAndTellContext(DbContextOptions<SipAndTellContext> options) : base(options)
        {
        }

        #endregion Конструктор

        #region Свойства

        /// <summary>
        /// Чаи каталога
        /// </summary>
        public DbSet<Tea> Teas => Set<Tea>();

        /// <summary>
        /// Чаепития пользователей
        /// </summary>
        public DbSet<Evening> Evenings => Set<Evening>();

        #endregion Свойства

        #region Методы

        /// <inheritdoc />
        public async Task<bool> SaveEntitiesAsync(CancellationToken cancellationToken = default)
        {
            await SaveChangesAsync(cancellationToken);
            return true;
        }

        /// <inheritdoc />
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(SipAndTellContext).Assembly);
        }

        #endregion Методы
    }
}
