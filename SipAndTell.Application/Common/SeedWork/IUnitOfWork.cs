namespace SipAndTell.Application.Common.SeedWork
{
    /// <summary>
    /// Единица работы: сохраняет изменения агрегатов одной транзакцией
    /// </summary>
    public interface IUnitOfWork
    {
        /// <summary>
        /// Сохранить все изменения
        /// </summary>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>true, если изменения сохранены</returns>
        Task<bool> SaveEntitiesAsync(CancellationToken cancellationToken = default);
    }
}
