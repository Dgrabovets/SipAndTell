namespace SipAndTell.Application.Evenings.Exceptions
{
    /// <summary>
    /// Чаепитие не найдено или принадлежит другому человеку
    /// </summary>
    public class EveningNotFoundException : Exception
    {
        #region Конструктор

        /// <summary>
        /// Создать исключение
        /// </summary>
        public EveningNotFoundException() : base("Чаепитие не найдено")
        {
        }

        #endregion Конструктор
    }
}
