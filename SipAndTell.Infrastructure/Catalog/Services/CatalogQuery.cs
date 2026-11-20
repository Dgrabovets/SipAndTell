using Microsoft.EntityFrameworkCore;
using SipAndTell.Application.Catalog.Models.Dto;
using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Catalog.Services;

namespace SipAndTell.Infrastructure.Catalog.Services
{
    /// <summary>
    /// Чтение каталога: общий список только из проверенных чаёв, свои ждущие проверки видит один автор
    /// </summary>
    public class CatalogQuery : ICatalogQuery
    {
        #region Константы

        /// <summary>
        /// Самое большое число чаёв в ответе
        /// </summary>
        private const int MaxLimit = 100;

        #endregion Константы

        #region Поля

        /// <summary>
        /// Контекст базы данных
        /// </summary>
        private readonly SipAndTellContext _context;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать сервис
        /// </summary>
        /// <param name="context">Контекст базы данных</param>
        public CatalogQuery(SipAndTellContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        #endregion Конструктор

        #region Методы

        /// <inheritdoc />
        public async Task<IReadOnlyList<TeaDto>> SearchAsync(long userId, string? text, int limit, CancellationToken cancellationToken = default)
        {
            var query = _context.Teas.AsNoTracking().Where(t => t.Status == CatalogStatus.Confirmed || t.OwnerId == userId);
            if (!string.IsNullOrWhiteSpace(text))
            {
                var normalized = Tea.Normalize(text);
                query = query.Where(t => t.NormalizedName.Contains(normalized));
            }

            return await query
                .OrderBy(t => t.NormalizedName)
                .Take(Math.Clamp(limit, 1, MaxLimit))
                .Select(t => new TeaDto(t.Id, t.Name, t.Type, t.Status))
                .ToListAsync(cancellationToken);
        }

        #endregion Методы
    }
}
