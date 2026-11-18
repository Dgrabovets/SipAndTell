---
name: sipandtell-code-style
description: >-
  Use when writing or moving SipAndTell C# or SipAndTell.Web code, choosing
  folders, or putting more than one type in a file. Use for код-стайл,
  структура папок, один класс на файл, RestshopAPI.
---

# SipAndTell code style

Taken from `D:\MyRepositories\RestshopAPI`. Match that layout and formatting.

## Repository

- Projects sit in the repository root. No `src` or `tests` wrapper.
- `SipAndTell.Application` holds aggregates, commands, repository interfaces, query interfaces, and auth contracts. It does not reference EF.
- `SipAndTell.Infrastructure` holds `SipAndTellContext` (the unit of work), entity configurations, repositories, MediatR handlers, and query services.
- `SipAndTell.Server` is the host: `Program` calls `Startup`, controllers only send a command or call a query, Telegram check is middleware.
- `SipAndTell.Server.Tests` is the test project. `SipAndTell.Web` is the Mini App.
- Solution file is `SipAndTell.slnx`. Target framework is `net10.0`. MediatR is 14.2.0.
- A folder is a feature (`Catalog`, `Evenings`, `Accounts`, `Auth`). Inside it: `Models`, `Commands`, `Services`, `Repositories`, `CommandHandlers`, `Exceptions`.
- An aggregate implements `IAggregateRoot`. A repository implements `IRepository<T>` and exposes `UnitOfWork`. Handlers change the aggregate and call `SaveEntitiesAsync`.
- Read models go through `ICatalogQuery` and `IEveningQuery`. Writes go through MediatR commands.
- The private `eShop.*` packages from RestshopAPI stay out. The same seed-work interfaces live in `SipAndTell.Application/Common/SeedWork`.
- Documentation other than `README.md` lives in `docs`.

## C#

- One public type per file. The file name is the type name.
- Namespace matches the folder. Usings stay above the namespace.
- Braces on the next line. Indent with four spaces.
- Public types and members have an XML summary in Russian.
- Group a class with `#region Поля`, `#region Конструктор`, `#region Методы`, `#region Свойства`.
- Private fields use `_camelCase`. A constructor rejects a null dependency.
- A controller only receives the request and calls an application service or MediatR. It does not own the business rule.
- SipAndTell keeps nullable reference types enabled.

## SipAndTell.Web

- `src/main.tsx` only mounts the application.
- One component, one function, or one type per file.
- Feature folders: `app`, `theme`, `catalog`, `evenings`. Models go in `models` under the feature.
- A component's props type is its own file.
- Same brace and indent rules as C#. Comments on exported types are JSDoc in Russian.
- A test file sits next to the file it checks.
