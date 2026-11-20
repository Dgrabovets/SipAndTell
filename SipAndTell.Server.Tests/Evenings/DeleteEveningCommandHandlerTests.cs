using Microsoft.EntityFrameworkCore;
using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Evenings.Commands;
using SipAndTell.Application.Evenings.Exceptions;
using SipAndTell.Infrastructure.Evenings.CommandHandlers;
using SipAndTell.Infrastructure.Evenings.Repositories;
using SipAndTell.Server.Tests.Support;

namespace SipAndTell.Server.Tests.Evenings
{
    /// <summary>
    /// Удаление чаепития: своё удаляется, чужое выглядит несуществующим и остаётся
    /// </summary>
    public class DeleteEveningCommandHandlerTests
    {
        #region Методы

        /// <summary>
        /// Владелец удаляет своё чаепитие
        /// </summary>
        [Fact]
        public async Task Handle_Owner_DeletesEvening()
        {
            await using var context = TestContext.Create();
            var tea = new Tea("Сенча", TeaType.Green, null, CatalogStatus.Confirmed);
            var evening = Samples.MakeEvening(1, tea.Id);
            context.AddRange(tea, evening);
            await context.SaveChangesAsync();

            await new DeleteEveningCommandHandler(new EveningRepository(context)).Handle(new DeleteEveningCommand(1, evening.Id), default);

            Assert.Empty(context.Evenings);
        }

        /// <summary>
        /// Чужое чаепитие удалить нельзя, и оно остаётся
        /// </summary>
        [Fact]
        public async Task Handle_ForeignEvening_ThrowsAndKeepsRow()
        {
            await using var context = TestContext.Create();
            var tea = new Tea("Сенча", TeaType.Green, null, CatalogStatus.Confirmed);
            var evening = Samples.MakeEvening(1, tea.Id);
            context.AddRange(tea, evening);
            await context.SaveChangesAsync();

            await Assert.ThrowsAsync<EveningNotFoundException>(() => new DeleteEveningCommandHandler(new EveningRepository(context)).Handle(new DeleteEveningCommand(2, evening.Id), default));

            Assert.Single(await context.Evenings.ToListAsync());
        }

        #endregion Методы
    }
}
