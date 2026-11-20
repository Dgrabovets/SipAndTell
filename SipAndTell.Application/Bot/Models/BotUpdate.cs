namespace SipAndTell.Application.Bot.Models
{
    /// <summary>
    /// То, что нужно боту из обновления Telegram: откуда сообщение и какие файлы в нём
    /// </summary>
    /// <param name="ChatId">Идентификатор чата</param>
    /// <param name="MessageId">Идентификатор сообщения</param>
    /// <param name="PhotoFileId">Файл фото или null</param>
    /// <param name="VoiceFileId">Файл голосового или null</param>
    /// <param name="VideoFileId">Файл видео или null</param>
    public record BotUpdate(long ChatId, int MessageId, string? PhotoFileId, string? VoiceFileId, string? VideoFileId);
}
