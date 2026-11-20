using SipAndTell.Application.Evenings.Models.Entities;
using SipAndTell.Application.Evenings.Models.Enums;
using SipAndTell.Server.Tests.Support;

namespace SipAndTell.Server.Tests.Evenings
{
    /// <summary>
    /// Правила чаепития: оценка, оси настроения и эффекта, длина отзыва
    /// </summary>
    public class EveningTests
    {
        #region Методы

        private static Evening Make(int? score = 8, double[]? mood = null, double[]? effects = null, string review = "ок")
        {
            return new Evening(1, Guid.NewGuid(), score, Place.Home, Daytime.Day, mood ?? Samples.Mood(), effects ?? Samples.Effects(), review, DateTimeOffset.UtcNow);
        }

        /// <summary>
        /// Оценка от 1 до 10 и пустая оценка допустимы
        /// </summary>
        [Theory]
        [InlineData(1)]
        [InlineData(10)]
        [InlineData(null)]
        public void Create_ValidScore_Works(int? score)
        {
            Assert.Equal(score, Make(score).Score);
        }

        /// <summary>
        /// Оценка вне диапазона отклоняется
        /// </summary>
        [Theory]
        [InlineData(0)]
        [InlineData(11)]
        [InlineData(-3)]
        public void Create_ScoreOutOfRange_Throws(int score)
        {
            Assert.Throws<ArgumentOutOfRangeException>(() => Make(score));
        }

        /// <summary>
        /// Неверное число осей настроения отклоняется
        /// </summary>
        [Fact]
        public void Create_WrongMoodLength_Throws()
        {
            Assert.Throws<ArgumentException>(() => Make(mood: new double[7]));
        }

        /// <summary>
        /// Значение эффекта больше единицы отклоняется
        /// </summary>
        [Fact]
        public void Create_EffectAboveOne_Throws()
        {
            var effects = Samples.Effects();
            effects[3] = 1.5;

            Assert.Throws<ArgumentOutOfRangeException>(() => Make(effects: effects));
        }

        /// <summary>
        /// Слишком длинный отзыв отклоняется
        /// </summary>
        [Fact]
        public void Create_TooLongReview_Throws()
        {
            Assert.Throws<ArgumentException>(() => Make(review: new string('я', Evening.MaxReviewLength + 1)));
        }

        #endregion Методы
    }
}
