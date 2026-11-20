using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Infrastructure.Catalog.Services;
using SipAndTell.Server.Tests.Support;

namespace SipAndTell.Server.Tests.Catalog
{
    /// <summary>
    /// Каталог: проверенные чаи видят все, непроверенные только автор
    /// </summary>
    public class CatalogQueryTests
    {
        #region Методы

        /// <summary>
        /// Чужой чай, ждущий проверки, в каталог не попадает
        /// </summary>
        [Fact]
        public async Task Search_HidesForeignPendingTea()
        {
            await using var context = TestContext.Create();
            context.Teas.AddRange(
                new Tea("Проверенный", TeaType.Black, null, CatalogStatus.Confirmed),
                new Tea("Мой новый", TeaType.White, 1, CatalogStatus.Pending),
                new Tea("Чужой новый", TeaType.Puer, 2, CatalogStatus.Pending));
            await context.SaveChangesAsync();

            var names = (await new CatalogQuery(context).SearchAsync(1, null, 50)).Select(t => t.Name).ToList();

            Assert.Contains("Проверенный", names);
            Assert.Contains("Мой новый", names);
            Assert.DoesNotContain("Чужой новый", names);
        }

        /// <summary>
        /// Поиск по части названия не зависит от регистра
        /// </summary>
        [Fact]
        public async Task Search_ByText_IgnoresCase()
        {
            await using var context = TestContext.Create();
            context.Teas.AddRange(new Tea("Да Хун Пао", TeaType.Oolong, null, CatalogStatus.Confirmed), new Tea("Сенча", TeaType.Green, null, CatalogStatus.Confirmed));
            await context.SaveChangesAsync();

            var found = await new CatalogQuery(context).SearchAsync(1, "ХУН", 50);

            Assert.Single(found);
        }

        #endregion Методы
    }
}
