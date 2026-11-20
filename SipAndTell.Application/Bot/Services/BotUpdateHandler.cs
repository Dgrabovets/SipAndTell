using SipAndTell.Application.Ai.Models;
using SipAndTell.Application.Ai.Services;
using SipAndTell.Application.Bot.Models;

namespace SipAndTell.Application.Bot.Services
{
    /// <summary>
    /// Обработка присланных боту фото, видео и голосовых: разбор ИИ, ответ в чат, удаление присланного.
    /// Присланное удаляется из чата только после успешного разбора, чтобы при сбое его можно было отправить снова.
    /// </summary>
    public class BotUpdateHandler
    {
        #region Поля

        /// <summary>
        /// Разбор фото и рассказа
        /// </summary>
        private readonly IAiDraftService _ai;

        /// <summary>
        /// Действия бота в Telegram
        /// </summary>
        private readonly IBotMessenger _bot;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать обработчик
        /// </summary>
        /// <param name="ai">Разбор фото и рассказа</param>
        /// <param name="bot">Действия бота в Telegram</param>
        public BotUpdateHandler(IAiDraftService ai, IBotMessenger bot)
        {
            _ai = ai ?? throw new ArgumentNullException(nameof(ai));
            _bot = bot ?? throw new ArgumentNullException(nameof(bot));
        }

        #endregion Конструктор

        #region Методы

        /// <summary>
        /// Обработать обновление
        /// </summary>
        /// <param name="update">Обновление</param>
        /// <param name="cancellationToken">Токен отмены</param>
        public async Task HandleAsync(BotUpdate update, CancellationToken cancellationToken = default)
        {
            var photo = update.PhotoFileId;
            var sound = update.VoiceFileId ?? update.VideoFileId;
            if (photo is null && sound is null)
            {
                return;
            }

            try
            {
                DraftResult draft;
                if (photo is not null)
                {
                    await using var stream = await _bot.DownloadAsync(photo, cancellationToken);
                    draft = await _ai.FromPhotoAsync(stream, cancellationToken);
                }
                else
                {
                    await using var stream = await _bot.DownloadAsync(sound!, cancellationToken);
                    draft = await _ai.FromVoiceAsync(stream, cancellationToken);
                }

                await _bot.SendTextAsync(update.ChatId, Describe(draft), cancellationToken);
                await _bot.DeleteMessageAsync(update.ChatId, update.MessageId, cancellationToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                await _bot.SendTextAsync(update.ChatId, "Не получилось разобрать, попробуй отправить ещё раз.", cancellationToken);
            }
        }

        /// <summary>
        /// Коротко рассказать, что распознано
        /// </summary>
        private static string Describe(DraftResult draft)
        {
            var parts = new List<string>();
            if (draft.TeaName is not null)
            {
                parts.Add($"чай: {draft.TeaName}");
            }

            if (draft.Score is not null)
            {
                parts.Add($"оценка: {draft.Score} из 10");
            }

            if (draft.Review is not null)
            {
                parts.Add("отзыв записан");
            }

            return parts.Count == 0 ? "Ничего не распознал, открой приложение и заполни вручную." : "Распознал, " + string.Join(", ", parts) + ". Открой приложение, чтобы проверить и сохранить.";
        }

        #endregion Методы
    }
}
