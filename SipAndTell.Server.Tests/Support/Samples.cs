using SipAndTell.Application.Evenings.Models.Entities;
using SipAndTell.Application.Evenings.Models.Enums;

namespace SipAndTell.Server.Tests.Support
{
    /// <summary>
    /// Готовые значения для тестов
    /// </summary>
    internal static class Samples
    {
        #region Методы

        /// <summary>
        /// Восемь настроений одной силы
        /// </summary>
        public static double[] Mood(double value = 0.5) => Enumerable.Repeat(value, Evening.MoodAxes).ToArray();

        /// <summary>
        /// Семь эффектов одной силы
        /// </summary>
        public static double[] Effects(double value = 0.5) => Enumerable.Repeat(value, Evening.EffectAxes).ToArray();

        /// <summary>
        /// Чаепитие с разумными значениями
        /// </summary>
        public static Evening MakeEvening(long ownerId, Guid teaId, DateTimeOffset? drankAt = null, int? score = 8)
        {
            return new Evening(ownerId, teaId, score, Place.Home, Daytime.Evening, Mood(), Effects(), "Хороший чай", drankAt ?? DateTimeOffset.UtcNow);
        }

        #endregion Методы
    }
}
