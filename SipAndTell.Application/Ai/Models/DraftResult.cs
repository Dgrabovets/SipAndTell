using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Evenings.Models.Enums;

namespace SipAndTell.Application.Ai.Models
{
    /// <summary>
    /// Черновик чаепития, который ИИ собрал по фото, видео или рассказу. Пустое поле значит, что ИИ его не определил.
    /// </summary>
    /// <param name="TeaName">Название чая</param>
    /// <param name="TeaType">Тип чая</param>
    /// <param name="Score">Оценка от 1 до 10</param>
    /// <param name="Place">Где пили</param>
    /// <param name="Time">Время суток</param>
    /// <param name="Mood">Сила восьми настроений по тексту рассказа</param>
    /// <param name="Effects">Сила семи эффектов</param>
    /// <param name="Review">Слова человека из расшифровки</param>
    public record DraftResult(string? TeaName, TeaType? TeaType, int? Score, Place? Place, Daytime? Time, IReadOnlyList<double>? Mood, IReadOnlyList<double>? Effects, string? Review);
}
