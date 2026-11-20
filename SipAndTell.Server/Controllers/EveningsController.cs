using MediatR;
using Microsoft.AspNetCore.Mvc;
using SipAndTell.Application.Catalog.Exceptions;
using SipAndTell.Application.Evenings.Commands;
using SipAndTell.Application.Evenings.Exceptions;
using SipAndTell.Application.Evenings.Services;
using SipAndTell.Server.Auth;
using SipAndTell.Server.Models;

namespace SipAndTell.Server.Controllers
{
    /// <summary>
    /// Чаепития текущего пользователя. Контроллер только передаёт запрос команде или чтению.
    /// </summary>
    [ApiController]
    [Route("api/evenings")]
    public class EveningsController : ControllerBase
    {
        #region Поля

        /// <summary>
        /// Посредник команд
        /// </summary>
        private readonly IMediator _mediator;

        /// <summary>
        /// Чтение чаепитий
        /// </summary>
        private readonly IEveningQuery _query;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать контроллер
        /// </summary>
        /// <param name="mediator">Посредник команд</param>
        /// <param name="query">Чтение чаепитий</param>
        public EveningsController(IMediator mediator, IEveningQuery query)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _query = query ?? throw new ArgumentNullException(nameof(query));
        }

        #endregion Конструктор

        #region Методы

        /// <summary>
        /// Свои чаепития, новые первыми
        /// </summary>
        /// <param name="limit">Сколько вернуть не больше</param>
        /// <param name="cancellationToken">Токен отмены</param>
        [HttpGet]
        public async Task<IActionResult> List([FromQuery] int limit = 50, CancellationToken cancellationToken = default)
        {
            return Ok(await _query.ListAsync(HttpContext.GetTelegramUser().Id, limit, cancellationToken));
        }

        /// <summary>
        /// Добавить чаепитие
        /// </summary>
        /// <param name="request">Данные чаепития</param>
        /// <param name="cancellationToken">Токен отмены</param>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEveningRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                var command = new CreateEveningCommand(
                    HttpContext.GetTelegramUser().Id,
                    request.TeaId,
                    request.NewTeaName,
                    request.NewTeaType,
                    request.Score,
                    request.Place,
                    request.Time,
                    request.Mood,
                    request.Effects,
                    request.Review ?? string.Empty,
                    request.DrankAt ?? DateTimeOffset.UtcNow);
                var id = await _mediator.Send(command, cancellationToken);
                return CreatedAtAction(nameof(List), new { id });
            }
            catch (TeaNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Удалить своё чаепитие
        /// </summary>
        /// <param name="id">Идентификатор чаепития</param>
        /// <param name="cancellationToken">Токен отмены</param>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                await _mediator.Send(new DeleteEveningCommand(HttpContext.GetTelegramUser().Id, id), cancellationToken);
                return NoContent();
            }
            catch (EveningNotFoundException)
            {
                return NotFound();
            }
        }

        #endregion Методы
    }
}
