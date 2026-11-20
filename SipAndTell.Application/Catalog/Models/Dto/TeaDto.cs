using SipAndTell.Application.Catalog.Models.Enums;

namespace SipAndTell.Application.Catalog.Models.Dto
{
    /// <summary>
    /// Чай для экрана каталога
    /// </summary>
    /// <param name="Id">Идентификатор</param>
    /// <param name="Name">Название</param>
    /// <param name="Type">Тип чая</param>
    /// <param name="Status">Состояние в каталоге</param>
    public record TeaDto(Guid Id, string Name, TeaType Type, CatalogStatus Status);
}
