using Microsoft.EntityFrameworkCore;
using SipAndTell.Application.Evenings.Models.Dto;
using SipAndTell.Application.Evenings.Services;

namespace SipAndTell.Infrastructure.Evenings.Services
{
    /// <summary>
    /// Чтение чаепитий: только свои, новые первыми
    /// </summary>
    public class EveningQuery : IEveningQuery
    {
        #region Константы

        /// <summary>
        /// Самое большое число чаепитий в ответе
        /// </summary>
        private const int MaxLimit = 200;

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
        public EveningQuery(SipAndTellContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        #endregion Конструктор

        #region Методы

        /// <inheritdoc />
        public async Task<IReadOnlyList<EveningDto>> ListAsync(long ownerId, int limit, CancellationToken cancellationToken = default)
        {
            return await (
                from evening in _context.Evenings.AsNoTracking()
                where evening.OwnerId == ownerId
                join tea in _context.Teas.AsNoTracking() on evening.TeaId equals tea.Id
                orderby evening.DrankAt descending
                select new EveningDto(evening.Id, tea.Id, tea.Name, tea.Type, evening.Score, evening.Place, evening.Time, evening.Mood, evening.Effects, evening.Review, evening.DrankAt))
                .Take(Math.Clamp(limit, 1, MaxLimit))
                .ToListAsync(cancellationToken);
        }

        #endregion Методы
    }
}
