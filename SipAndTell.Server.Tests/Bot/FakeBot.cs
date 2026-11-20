using SipAndTell.Application.Bot.Services;

namespace SipAndTell.Server.Tests.Bot
{
    /// <summary>
    /// Бот, который запоминает, что ему велели сделать
    /// </summary>
    internal sealed class FakeBot : IBotMessenger
    {
        #region Свойства

        /// <summary>
        /// Отправленные тексты
        /// </summary>
        public List<string> Sent { get; } = [];

        /// <summary>
        /// Удалённые сообщения
        /// </summary>
        public List<int> Deleted { get; } = [];

        #endregion Свойства

        #region Методы

        /// <inheritdoc />
        public Task<Stream> DownloadAsync(string fileId, CancellationToken cancellationToken = default) => Task.FromResult<Stream>(new MemoryStream([1, 2, 3]));

        /// <inheritdoc />
        public Task SendTextAsync(long chatId, string text, CancellationToken cancellationToken = default)
        {
            Sent.Add(text);
            return Task.CompletedTask;
        }

        /// <inheritdoc />
        public Task DeleteMessageAsync(long chatId, int messageId, CancellationToken cancellationToken = default)
        {
            Deleted.Add(messageId);
            return Task.CompletedTask;
        }

        #endregion Методы
    }
}
