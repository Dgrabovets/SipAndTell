namespace SipAndTell.Application.Bot.Services
{
    /// <summary>
    /// Действия бота в Telegram
    /// </summary>
    public interface IBotMessenger
    {
        /// <summary>
        /// Скачать присланный файл
        /// </summary>
        /// <param name="fileId">Идентификатор файла в Telegram</param>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>Содержимое файла</returns>
        Task<Stream> DownloadAsync(string fileId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Отправить текст в чат
        /// </summary>
        /// <param name="chatId">Идентификатор чата</param>
        /// <param name="text">Текст</param>
        /// <param name="cancellationToken">Токен отмены</param>
        Task SendTextAsync(long chatId, string text, CancellationToken cancellationToken = default);

        /// <summary>
        /// Удалить сообщение из чата
        /// </summary>
        /// <param name="chatId">Идентификатор чата</param>
        /// <param name="messageId">Идентификатор сообщения</param>
        /// <param name="cancellationToken">Токен отмены</param>
        Task DeleteMessageAsync(long chatId, int messageId, CancellationToken cancellationToken = default);
    }
}
