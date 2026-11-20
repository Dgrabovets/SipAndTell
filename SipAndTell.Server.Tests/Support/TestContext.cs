using Microsoft.EntityFrameworkCore;
using SipAndTell.Infrastructure;

namespace SipAndTell.Server.Tests.Support
{
    /// <summary>
    /// Контекст базы в памяти для тестов, у каждого теста своя база
    /// </summary>
    internal static class TestContext
    {
        #region Методы

        /// <summary>
        /// Создать контекст с пустой базой
        /// </summary>
        /// <returns>Контекст</returns>
        public static SipAndTellContext Create()
        {
            var options = new DbContextOptionsBuilder<SipAndTellContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
            return new SipAndTellContext(options);
        }

        #endregion Методы
    }
}
