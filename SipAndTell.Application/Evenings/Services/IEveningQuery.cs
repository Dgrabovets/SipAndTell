using SipAndTell.Application.Evenings.Models.Dto;

namespace SipAndTell.Application.Evenings.Services
{
    /// <summary>
    /// Чтение чаепитий для экранов
    /// </summary>
    public interface IEveningQuery
    {
        /// <summary>
        /// Свои чаепития, новые первыми
        /// </summary>
        /// <param name="ownerId">Идентификатор пользователя</param>
        /// <param name="limit">Сколько вернуть не больше</param>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>Чаепития для дневника</returns>
        Task<IReadOnlyList<EveningDto>> ListAsync(long ownerId, int limit, CancellationToken cancellationToken = default);
    }
}
