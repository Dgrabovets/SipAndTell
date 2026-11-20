namespace SipAndTell.Application.Catalog.Models.Enums
{
    /// <summary>
    /// Состояние чая в каталоге
    /// </summary>
    public enum CatalogStatus
    {
        /// <summary>
        /// Ждёт проверки: виден только автору
        /// </summary>
        Pending = 0,

        /// <summary>
        /// Проверен: виден всем
        /// </summary>
        Confirmed = 1
    }
}
