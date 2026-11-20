using SipAndTell.Application.Catalog.Exceptions;
using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Evenings.Commands;
using SipAndTell.Application.Evenings.Models.Enums;
using SipAndTell.Infrastructure.Catalog.Repositories;
using SipAndTell.Infrastructure.Evenings.CommandHandlers;
using SipAndTell.Infrastructure.Evenings.Repositories;
using SipAndTell.Server.Tests.Support;
using Microsoft.EntityFrameworkCore;

namespace SipAndTell.Server.Tests.Evenings
{
    /// <summary>
    /// Добавление чаепития: новый чай ждёт проверки, известный переиспользуется, чужой непроверенный недоступен
    /// </summary>
    public class CreateEveningCommandHandlerTests
    {
        #region Методы

        private static CreateEveningCommand Command(long owner, Guid? teaId = null, string? name = null, TeaType? type = null)
        {
            return new CreateEveningCommand(owner, teaId, name, type, 9, Place.Home, Daytime.Evening, Samples.Mood(), Samples.Effects(), "Вкусно", DateTimeOffset.UtcNow);
        }

        private static CreateEveningCommandHandler Handler(SipAndTell.Infrastructure.SipAndTellContext context)
        {
            return new CreateEveningCommandHandler(new TeaRepository(context), new EveningRepository(context));
        }

        /// <summary>
        /// Новый чай создаётся ждущим проверки и принадлежит автору, чаепитие сохраняется
        /// </summary>
        [Fact]
        public async Task Handle_NewTea_CreatesPendingTeaAndEvening()
        {
            await using var context = TestContext.Create();

            await Handler(context).Handle(Command(1, name: "Лао Бань Чжан", type: TeaType.Puer), default);

            var tea = await context.Teas.SingleAsync();
            Assert.Equal(CatalogStatus.Pending, tea.Status);
            Assert.Equal(1, tea.OwnerId);
            Assert.Single(context.Evenings);
        }

        /// <summary>
        /// Проверенный чай с тем же названием не дублируется
        /// </summary>
        [Fact]
        public async Task Handle_KnownNameInDifferentCase_ReusesConfirmedTea()
        {
            await using var context = TestContext.Create();
            context.Teas.Add(new Tea("Сенча", TeaType.Green, null, CatalogStatus.Confirmed));
            await context.SaveChangesAsync();

            await Handler(context).Handle(Command(1, name: "  сенча ", type: TeaType.Green), default);

            Assert.Single(context.Teas);
        }

        /// <summary>
        /// Чужой чай, ждущий проверки, по идентификатору не берётся
        /// </summary>
        [Fact]
        public async Task Handle_ForeignPendingTea_Throws()
        {
            await using var context = TestContext.Create();
            var foreign = new Tea("Чужой", TeaType.Black, 2, CatalogStatus.Pending);
            context.Teas.Add(foreign);
            await context.SaveChangesAsync();

            await Assert.ThrowsAsync<TeaNotFoundException>(() => Handler(context).Handle(Command(1, teaId: foreign.Id), default));
        }

        /// <summary>
        /// Без чая команда отклоняется
        /// </summary>
        [Fact]
        public async Task Handle_NoTea_Throws()
        {
            await using var context = TestContext.Create();

            await Assert.ThrowsAsync<ArgumentException>(() => Handler(context).Handle(Command(1), default));
        }

        #endregion Методы
    }
}
