using MediatR;
using SipAndTell.Application.Auth.Services;
using SipAndTell.Application.Bot.Services;
using SipAndTell.Infrastructure;
using SipAndTell.Infrastructure.Evenings.CommandHandlers;
using SipAndTell.Server.Auth;

namespace SipAndTell.Server
{
    /// <summary>
    /// Настройка службы: контроллеры, инфраструктура, проверка Telegram, раздача клиента
    /// </summary>
    public class Startup
    {
        #region Константы

        /// <summary>
        /// Сколько данные запуска Mini App считаются свежими
        /// </summary>
        private static readonly TimeSpan InitDataMaxAge = TimeSpan.FromHours(24);

        #endregion Константы

        #region Поля

        /// <summary>
        /// Настройки приложения
        /// </summary>
        private readonly IConfiguration _configuration;

        #endregion Поля

        #region Конструктор

        /// <summary>
        /// Создать настройку
        /// </summary>
        /// <param name="configuration">Настройки приложения</param>
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        #endregion Конструктор

        #region Методы

        /// <summary>
        /// Зарегистрировать службы
        /// </summary>
        /// <param name="services">Контейнер служб</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateEveningCommandHandler).Assembly));
            services.AddInfrastructure(_configuration);
            services.AddSingleton(TimeProvider.System);
            services.AddSingleton<ITelegramAuth>(sp => new TelegramInitDataValidator(
                _configuration["Telegram:BotToken"] ?? throw new InvalidOperationException("Не задан токен бота Telegram:BotToken (переменная окружения Telegram__BotToken)"),
                InitDataMaxAge,
                sp.GetRequiredService<TimeProvider>()));
            services.AddScoped<BotUpdateHandler>();
        }

        /// <summary>
        /// Настроить конвейер запросов: клиент из wwwroot, проверка Telegram для /api, контроллеры
        /// </summary>
        /// <param name="app">Приложение</param>
        public void Configure(WebApplication app)
        {
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseMiddleware<TelegramAuthMiddleware>();
            app.MapControllers();
            app.MapFallbackToFile("index.html");
        }

        #endregion Методы
    }
}
