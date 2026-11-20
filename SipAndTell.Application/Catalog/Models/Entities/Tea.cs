using SipAndTell.Application.Catalog.Models.Enums;
using SipAndTell.Application.Common.SeedWork;

namespace SipAndTell.Application.Catalog.Models.Entities
{
    /// <summary>
    /// Чай в каталоге
    /// </summary>
    public class Tea : IAggregateRoot
    {
        #region Конструктор

        /// <summary>
        /// Конструктор для EF
        /// </summary>
        protected Tea()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
        }

        /// <summary>
        /// Создать чай
        /// </summary>
        /// <param name="name">Название</param>
        /// <param name="type">Тип чая</param>
        /// <param name="ownerId">Кто добавил (идентификатор Telegram), null для чая из общего списка</param>
        /// <param name="status">Состояние в каталоге</param>
        public Tea(string name, TeaType type, long? ownerId, CatalogStatus status)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Название чая не может быть пустым", nameof(name));
            }

            Id = Guid.NewGuid();
            Name = name.Trim();
            NormalizedName = Normalize(name);
            Type = type;
            OwnerId = ownerId;
            Status = status;
        }

        #endregion Конструктор

        #region Свойства

        /// <summary>
        /// Идентификатор
        /// </summary>
        public Guid Id { get; private set; }

        /// <summary>
        /// Название
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Название в нижнем регистре для поиска
        /// </summary>
        public string NormalizedName { get; private set; }

        /// <summary>
        /// Тип чая
        /// </summary>
        public TeaType Type { get; private set; }

        /// <summary>
        /// Кто добавил (идентификатор Telegram)
        /// </summary>
        public long? OwnerId { get; private set; }

        /// <summary>
        /// Состояние в каталоге
        /// </summary>
        public CatalogStatus Status { get; private set; }

        #endregion Свойства

        #region Методы

        /// <summary>
        /// Привести название к виду для поиска
        /// </summary>
        /// <param name="name">Название</param>
        /// <returns>Название без лишних пробелов в нижнем регистре</returns>
        public static string Normalize(string name)
        {
            return name.Trim().ToLowerInvariant();
        }

        /// <summary>
        /// Подтвердить чай после проверки: он становится виден всем
        /// </summary>
        public void Confirm()
        {
            Status = CatalogStatus.Confirmed;
        }

        #endregion Методы
    }
}
