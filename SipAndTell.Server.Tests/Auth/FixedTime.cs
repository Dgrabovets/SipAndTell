namespace SipAndTell.Server.Tests.Auth
{
    /// <summary>
    /// Источник времени с одним и тем же моментом
    /// </summary>
    internal sealed class FixedTime : TimeProvider
    {
        #region Поля

        private readonly DateTimeOffset _now;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать источник времени
        /// </summary>
        /// <param name="now">Какой сейчас момент</param>
        public FixedTime(DateTimeOffset now)
        {
            _now = now;
        }

        #endregion Конструктор

        #region Методы

        /// <inheritdoc />
        public override DateTimeOffset GetUtcNow() => _now;

        #endregion Методы
    }
}
