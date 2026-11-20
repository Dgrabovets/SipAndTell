using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SipAndTell.Application.Ai.Services;
using SipAndTell.Application.Bot.Services;
using SipAndTell.Application.Catalog.Repositories;
using SipAndTell.Application.Catalog.Services;
using SipAndTell.Application.Evenings.Repositories;
using SipAndTell.Application.Evenings.Services;
using SipAndTell.Infrastructure.Ai;
using SipAndTell.Infrastructure.Bot;
using SipAndTell.Infrastructure.Catalog.Repositories;
using SipAndTell.Infrastructure.Catalog.Services;
using SipAndTell.Infrastructure.Evenings.Repositories;
using SipAndTell.Infrastructure.Evenings.Services;

namespace SipAndTell.Infrastructure
{
    /// <summary>
    /// Подключение инфраструктуры к контейнеру служб
    /// </summary>
    public static class DependencyInjection
    {
        #region Методы

        /// <summary>
        /// Добавить базу данных, репозитории, чтение, имитацию ИИ и клиента бота. Строка подключения и токен берутся из окружения.
        /// </summary>
        /// <param name="services">Контейнер служб</param>
        /// <param name="configuration">Настройки: ConnectionStrings:Default и Telegram:BotToken</param>
        /// <returns>Тот же контейнер</returns>
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<SipAndTellContext>(options => options.UseNpgsql(
                configuration.GetConnectionString("Default") ?? throw new InvalidOperationException("Не задана строка подключения ConnectionStrings:Default (переменная окружения ConnectionStrings__Default)")));
            services.AddScoped<ITeaRepository, TeaRepository>();
            services.AddScoped<IEveningRepository, EveningRepository>();
            services.AddScoped<ICatalogQuery, CatalogQuery>();
            services.AddScoped<IEveningQuery, EveningQuery>();
            services.AddScoped<IAiDraftService, FakeAiDraftService>();
            services.AddHttpClient<IBotMessenger, TelegramBotMessenger>((http, _) => new TelegramBotMessenger(
                http,
                configuration["Telegram:BotToken"] ?? throw new InvalidOperationException("Не задан токен бота Telegram:BotToken (переменная окружения Telegram__BotToken)")));
            return services;
        }

        #endregion Методы
    }
}
