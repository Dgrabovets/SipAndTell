var builder = WebApplication.CreateBuilder(args);
var startup = new SipAndTell.Server.Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();
startup.Configure(app);
app.Run();
