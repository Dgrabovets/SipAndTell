using MediatR;
using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Evenings.Models.Enums;

namespace SipAndTell.Application.Evenings.Commands
{
    /// <summary>
    /// Команда добавления чаепития. Чай задаётся либо идентификатором, либо названием и типом нового чая.
    /// </summary>
    /// <param name="OwnerId">Кто пил (идентификатор Telegram)</param>
    /// <param name="TeaId">Идентификатор известного чая или null</param>
    /// <param name="NewTeaName">Название нового чая, если TeaId не задан</param>
    /// <param name="NewTeaType">Тип нового чая, если TeaId не задан</param>
    /// <param name="Score">Оценка от 1 до 10 или null</param>
    /// <param name="Place">Где пили</param>
    /// <param name="Time">Время суток</param>
    /// <param name="Mood">Сила восьми настроений</param>
    /// <param name="Effects">Сила семи эффектов</param>
    /// <param name="Review">Отзыв</param>
    /// <param name="DrankAt">Когда пили</param>
    public record CreateEveningCommand(long OwnerId, Guid? TeaId, string? NewTeaName, TeaType? NewTeaType, int? Score, Place Place, Daytime Time, IReadOnlyList<double> Mood, IReadOnlyList<double> Effects, string Review, DateTimeOffset DrankAt) : IRequest<Guid>;
}
