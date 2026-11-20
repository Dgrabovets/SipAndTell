namespace SipAndTell.Application.Common.SeedWork
{
    /// <summary>
    /// Репозиторий агрегата
    /// </summary>
    /// <typeparam name="T">Тип корня агрегата</typeparam>
    public interface IRepository<T> where T : IAggregateRoot
    {
        /// <summary>
        /// Единица работы репозитория
        /// </summary>
        IUnitOfWork UnitOfWork { get; }
    }
}
