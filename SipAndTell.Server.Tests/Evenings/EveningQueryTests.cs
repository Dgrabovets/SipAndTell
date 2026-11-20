using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Infrastructure.Evenings.Services;
using SipAndTell.Server.Tests.Support;

namespace SipAndTell.Server.Tests.Evenings
{
    /// <summary>
    /// Чтение дневника: только свои чаепития, новые первыми, с лимитом
    /// </summary>
    public class EveningQueryTests
    {
        #region Методы

        /// <summary>
        /// Чужие чаепития в ответ не попадают
        /// </summary>
        [Fact]
        public async Task List_ReturnsOnlyOwnEvenings()
        {
            await using var context = TestContext.Create();
            var tea = new Tea("Да Хун Пао", TeaType.Oolong, null, CatalogStatus.Confirmed);
            context.Teas.Add(tea);
            context.Evenings.AddRange(Samples.MakeEvening(1, tea.Id), Samples.MakeEvening(2, tea.Id), Samples.MakeEvening(2, tea.Id));
            await context.SaveChangesAsync();

            var mine = await new EveningQuery(context).ListAsync(1, 50);
            var theirs = await new EveningQuery(context).ListAsync(2, 50);

            Assert.Single(mine);
            Assert.Equal(2, theirs.Count);
        }

        /// <summary>
        /// Новые чаепития идут первыми, число ограничено
        /// </summary>
        [Fact]
        public async Task List_NewestFirstAndLimited()
        {
            await using var context = TestContext.Create();
            var tea = new Tea("Сенча", TeaType.Green, null, CatalogStatus.Confirmed);
            context.Teas.Add(tea);
            var now = DateTimeOffset.UtcNow;
            context.Evenings.AddRange(Samples.MakeEvening(1, tea.Id, now.AddDays(-3)), Samples.MakeEvening(1, tea.Id, now), Samples.MakeEvening(1, tea.Id, now.AddDays(-1)));
            await context.SaveChangesAsync();

            var list = await new EveningQuery(context).ListAsync(1, 2);

            Assert.Equal(2, list.Count);
            Assert.True(list[0].DrankAt > list[1].DrankAt);
        }

        #endregion Методы
    }
}
