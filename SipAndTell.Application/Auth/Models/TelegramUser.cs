namespace SipAndTell.Application.Auth.Models
{
    /// <summary>
    /// Пользователь Telegram, подпись данных которого проверена
    /// </summary>
    /// <param name="Id">Идентификатор Telegram</param>
    /// <param name="FirstName">Имя</param>
    public record TelegramUser(long Id, string FirstName);
}
