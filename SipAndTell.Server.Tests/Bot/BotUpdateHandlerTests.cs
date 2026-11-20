using SipAndTell.Application.Bot.Models;
using SipAndTell.Application.Bot.Services;
using SipAndTell.Infrastructure.Ai;

namespace SipAndTell.Server.Tests.Bot
{
    /// <summary>
    /// Бот: присланное разбирается, ответ уходит в чат, присланное удаляется только после успеха
    /// </summary>
    public class BotUpdateHandlerTests
    {
        #region Методы

        /// <summary>
        /// Фото разобрано: ответ отправлен, исходное сообщение удалено
        /// </summary>
        [Fact]
        public async Task Handle_Photo_RepliesAndDeletesOriginal()
        {
            var bot = new FakeBot();

            await new BotUpdateHandler(new FakeAiDraftService(), bot).HandleAsync(new BotUpdate(10, 77, "photo-id", null, null));

            Assert.Single(bot.Sent);
            Assert.Contains("Да Хун Пао", bot.Sent[0]);
            Assert.Equal([77], bot.Deleted);
        }

        /// <summary>
        /// Голосовое разобрано: оценка в ответе, сообщение удалено
        /// </summary>
        [Fact]
        public async Task Handle_Voice_RepliesAndDeletesOriginal()
        {
            var bot = new FakeBot();

            await new BotUpdateHandler(new FakeAiDraftService(), bot).HandleAsync(new BotUpdate(10, 78, null, "voice-id", null));

            Assert.Contains("9 из 10", bot.Sent[0]);
            Assert.Equal([78], bot.Deleted);
        }

        /// <summary>
        /// Видео идёт тем же путём, что и голос
        /// </summary>
        [Fact]
        public async Task Handle_Video_IsTreatedAsVoice()
        {
            var bot = new FakeBot();

            await new BotUpdateHandler(new FakeAiDraftService(), bot).HandleAsync(new BotUpdate(10, 79, null, null, "video-id"));

            Assert.Equal([79], bot.Deleted);
        }

        /// <summary>
        /// При сбое разбора человеку сообщают, а присланное остаётся в чате, чтобы отправить снова
        /// </summary>
        [Fact]
        public async Task Handle_AiFails_KeepsOriginalAndApologises()
        {
            var bot = new FakeBot();

            await new BotUpdateHandler(new BrokenAi(), bot).HandleAsync(new BotUpdate(10, 80, "photo-id", null, null));

            Assert.Empty(bot.Deleted);
            Assert.Contains("Не получилось", bot.Sent[0]);
        }

        /// <summary>
        /// Сообщение без файлов бот не трогает
        /// </summary>
        [Fact]
        public async Task Handle_NoFiles_DoesNothing()
        {
            var bot = new FakeBot();

            await new BotUpdateHandler(new FakeAiDraftService(), bot).HandleAsync(new BotUpdate(10, 81, null, null, null));

            Assert.Empty(bot.Sent);
            Assert.Empty(bot.Deleted);
        }

        #endregion Методы
    }
}
