using SipAndTell.Application.Common.SeedWork;
using SipAndTell.Application.Evenings.Models.Enums;

namespace SipAndTell.Application.Evenings.Models.Entities
{
    /// <summary>
    /// Чаепитие пользователя
    /// </summary>
    public class Evening : IAggregateRoot
    {
        #region Константы

        /// <summary>
        /// Сколько осей у настроения
        /// </summary>
        public const int MoodAxes = 8;

        /// <summary>
        /// Сколько осей у эффекта чая
        /// </summary>
        public const int EffectAxes = 7;

        /// <summary>
        /// Самый длинный отзыв
        /// </summary>
        public const int MaxReviewLength = 4000;

        #endregion Константы

        #region Конструктор

        /// <summary>
        /// Конструктор для EF
        /// </summary>
        protected Evening()
        {
            Mood = [];
            Effects = [];
            Review = string.Empty;
        }

        /// <summary>
        /// Создать чаепитие
        /// </summary>
        /// <param name="ownerId">Кто пил (идентификатор Telegram)</param>
        /// <param name="teaId">Какой чай</param>
        /// <param name="score">Оценка от 1 до 10 или null, если не оценивал</param>
        /// <param name="place">Где пили</param>
        /// <param name="time">Время суток</param>
        /// <param name="mood">Сила восьми настроений, каждая от 0 до 1</param>
        /// <param name="effects">Сила семи эффектов чая, каждая от 0 до 1</param>
        /// <param name="review">Свой отзыв</param>
        /// <param name="drankAt">Когда пили</param>
        public Evening(long ownerId, Guid teaId, int? score, Place place, Daytime time, IReadOnlyList<double> mood, IReadOnlyList<double> effects, string review, DateTimeOffset drankAt)
        {
            if (score is < 1 or > 10)
            {
                throw new ArgumentOutOfRangeException(nameof(score), "Оценка от 1 до 10");
            }

            Id = Guid.NewGuid();
            OwnerId = ownerId;
            TeaId = teaId;
            Score = score;
            Place = place;
            Time = time;
            Mood = CheckAxes(mood, MoodAxes, nameof(mood));
            Effects = CheckAxes(effects, EffectAxes, nameof(effects));
            Review = (review ?? string.Empty).Trim();
            if (Review.Length > MaxReviewLength)
            {
                throw new ArgumentException("Отзыв слишком длинный", nameof(review));
            }

            DrankAt = drankAt;
        }

        #endregion Конструктор

        #region Свойства

        /// <summary>
        /// Идентификатор
        /// </summary>
        public Guid Id { get; private set; }

        /// <summary>
        /// Кто пил (идентификатор Telegram)
        /// </summary>
        public long OwnerId { get; private set; }

        /// <summary>
        /// Какой чай
        /// </summary>
        public Guid TeaId { get; private set; }

        /// <summary>
        /// Оценка от 1 до 10 или null
        /// </summary>
        public int? Score { get; private set; }

        /// <summary>
        /// Где пили
        /// </summary>
        public Place Place { get; private set; }

        /// <summary>
        /// Время суток
        /// </summary>
        public Daytime Time { get; private set; }

        /// <summary>
        /// Сила восьми настроений
        /// </summary>
        public double[] Mood { get; private set; }

        /// <summary>
        /// Сила семи эффектов чая
        /// </summary>
        public double[] Effects { get; private set; }

        /// <summary>
        /// Свой отзыв
        /// </summary>
        public string Review { get; private set; }

        /// <summary>
        /// Когда пили
        /// </summary>
        public DateTimeOffset DrankAt { get; private set; }

        #endregion Свойства

        #region Методы

        /// <summary>
        /// Проверить число осей и диапазон значений
        /// </summary>
        private static double[] CheckAxes(IReadOnlyList<double> values, int expected, string name)
        {
            if (values is null || values.Count != expected)
            {
                throw new ArgumentException($"Нужно значений: {expected}", name);
            }

            if (values.Any(v => double.IsNaN(v) || v < 0 || v > 1))
            {
                throw new ArgumentOutOfRangeException(name, "Каждое значение от 0 до 1");
            }

            return [.. values];
        }

        #endregion Методы
    }
}
