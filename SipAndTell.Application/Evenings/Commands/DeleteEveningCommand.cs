using MediatR;

namespace SipAndTell.Application.Evenings.Commands
{
    /// <summary>
    /// Команда удаления своего чаепития
    /// </summary>
    /// <param name="OwnerId">Кто удаляет (идентификатор Telegram)</param>
    /// <param name="EveningId">Идентификатор чаепития</param>
    public record DeleteEveningCommand(long OwnerId, Guid EveningId) : IRequest;
}
