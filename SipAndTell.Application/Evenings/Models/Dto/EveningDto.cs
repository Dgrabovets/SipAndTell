using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Evenings.Models.Enums;

namespace SipAndTell.Application.Evenings.Models.Dto
{
    /// <summary>
    /// Чаепитие для экрана дневника
    /// </summary>
    /// <param name="Id">Идентификатор</param>
    /// <param name="TeaId">Идентификатор чая</param>
    /// <param name="TeaName">Название чая</param>
    /// <param name="TeaType">Тип чая</param>
    /// <param name="Score">Оценка или null</param>
    /// <param name="Place">Где пили</param>
    /// <param name="Time">Время суток</param>
    /// <param name="Mood">Сила восьми настроений</param>
    /// <param name="Effects">Сила семи эффектов</param>
    /// <param name="Review">Отзыв</param>
    /// <param name="DrankAt">Когда пили</param>
    public record EveningDto(Guid Id, Guid TeaId, string TeaName, TeaType TeaType, int? Score, Place Place, Daytime Time, double[] Mood, double[] Effects, string Review, DateTimeOffset DrankAt);
}
