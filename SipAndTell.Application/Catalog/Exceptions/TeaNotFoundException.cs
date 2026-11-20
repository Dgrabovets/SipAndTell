namespace SipAndTell.Application.Catalog.Exceptions
{
    /// <summary>
    /// Чай не найден или недоступен пользователю
    /// </summary>
    public class TeaNotFoundException : Exception
    {
        #region Конструктор

        /// <summary>
        /// Создать исключение
        /// </summary>
        public TeaNotFoundException() : base("Чай не найден")
        {
        }

        #endregion Конструктор
    }
}
