using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Evenings.Models.Enums;

namespace SipAndTell.Server.Models
{
    /// <summary>
    /// Запрос на добавление чаепития. Чай задаётся идентификатором или названием и типом нового.
    /// </summary>
    /// <param name="TeaId">Идентификатор известного чая или null</param>
    /// <param name="NewTeaName">Название нового чая</param>
    /// <param name="NewTeaType">Тип нового чая</param>
    /// <param name="Score">Оценка от 1 до 10 или null</param>
    /// <param name="Place">Где пили</param>
    /// <param name="Time">Время суток</param>
    /// <param name="Mood">Сила восьми настроений</param>
    /// <param name="Effects">Сила семи эффектов</param>
    /// <param name="Review">Отзыв</param>
    /// <param name="DrankAt">Когда пили, по умолчанию сейчас</param>
    public record CreateEveningRequest(Guid? TeaId, string? NewTeaName, TeaType? NewTeaType, int? Score, Place Place, Daytime Time, double[] Mood, double[] Effects, string? Review, DateTimeOffset? DrankAt);
}
