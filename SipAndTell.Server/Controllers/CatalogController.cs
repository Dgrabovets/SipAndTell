using Microsoft.AspNetCore.Mvc;
using SipAndTell.Application.Catalog.Services;
using SipAndTell.Server.Auth;

namespace SipAndTell.Server.Controllers
{
    /// <summary>
    /// Каталог чаёв: проверенные и свои, ждущие проверки
    /// </summary>
    [ApiController]
    [Route("api/catalog")]
    public class CatalogController : ControllerBase
    {
        #region Поля

        /// <summary>
        /// Чтение каталога
        /// </summary>
        private readonly ICatalogQuery _query;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать контроллер
        /// </summary>
        /// <param name="query">Чтение каталога</param>
        public CatalogController(ICatalogQuery query)
        {
            _query = query ?? throw new ArgumentNullException(nameof(query));
        }

        #endregion Конструктор

        #region Методы

        /// <summary>
        /// Найти чай по части названия
        /// </summary>
        /// <param name="text">Часть названия</param>
        /// <param name="limit">Сколько вернуть не больше</param>
        /// <param name="cancellationToken">Токен отмены</param>
        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string? text, [FromQuery] int limit = 50, CancellationToken cancellationToken = default)
        {
            return Ok(await _query.SearchAsync(HttpContext.GetTelegramUser().Id, text, limit, cancellationToken));
        }

        #endregion Методы
    }
}
