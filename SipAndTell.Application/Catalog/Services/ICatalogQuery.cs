using SipAndTell.Application.Catalog.Models.Dto;

namespace SipAndTell.Application.Catalog.Services
{
    /// <summary>
    /// Чтение каталога чаёв
    /// </summary>
    public interface ICatalogQuery
    {
        /// <summary>
        /// Найти чаи, видимые пользователю: проверенные и свои ждущие проверки
        /// </summary>
        /// <param name="userId">Идентификатор пользователя</param>
        /// <param name="text">Часть названия или null</param>
        /// <param name="limit">Сколько чаёв вернуть не больше</param>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>Чаи для экрана каталога</returns>
        Task<IReadOnlyList<TeaDto>> SearchAsync(long userId, string? text, int limit, CancellationToken cancellationToken = default);
    }
}
