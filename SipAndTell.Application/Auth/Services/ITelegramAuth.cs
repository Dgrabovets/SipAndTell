using SipAndTell.Application.Auth.Models;

namespace SipAndTell.Application.Auth.Services
{
    /// <summary>
    /// Проверка данных, которые Telegram передаёт Mini App
    /// </summary>
    public interface ITelegramAuth
    {
        /// <summary>
        /// Проверить подпись и свежесть данных запуска
        /// </summary>
        /// <param name="initData">Строка initData из Mini App</param>
        /// <returns>Пользователь или null, если данные подделаны, устарели или повреждены</returns>
        TelegramUser? Validate(string initData);
    }
}
