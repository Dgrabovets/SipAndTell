---
name: safe-persistence
description: >-
  Use when writing or changing database access, migrations, queries,
  transactions, scheduled jobs, or authorization over stored data. Use for
  PostgreSQL, EF Core, Quartz jobs, safe writes, and a responsive API that
  must not leak private rows. Use for безопасную базу, транзакции и доступ
  к данным.
---

# Safe persistence

A private row stays private because the query cannot return it. Hiding a button is not access control.

## Queries

- Every query is parameterized. Do not build SQL by concatenating names, search text, or ids.
- A shared catalog query has `status = confirmed` in the `WHERE`, not after the rows are loaded.
- An unconfirmed card query also has `owner_id = current user`.
- Return a DTO for the screen. Do not return the entity that carries source credentials, run logs, or another person's private place.
- Lists have a limit. Search uses an index on the normalized drink name and on `(source, external_id)`.
- A write endpoint checks the Telegram user before it touches the database.

## Transactions

These finish in one transaction or not at all:

- Move evenings onto another card, attach the second external id, and remove the empty card.
- Advance a loader watermark and mark the run successful.
- Change a card's type and move that evening's progress to the new type strip.

A failed transaction leaves the previous watermark and the previous card. Do not catch the exception and continue as if the write landed.

## Schema

- Unique `(source, external_id)`.
- Foreign keys from an evening to a card and from progress to a user.
- A check constraint on the score: null or an integer from 1 to 10.
- Change the schema with a migration. Do not edit a production table by hand.
- The application role can read and write its tables. It is not a superuser and it cannot read another database.

## Jobs

- Quartz runs inside the same ASP.NET process. One job type per source. `[DisallowConcurrentExecution]` on that job.
- Store the schedule in PostgreSQL so a restart does not forget the next run.
- The job claims a run row first. If a run for that source is already open, the job exits.
- Commit the watermark only after the upsert batch commits. A thrown exception leaves the watermark where it was.
- A row that cannot be mapped is inserted into the quarantine table and the batch continues.

## Secrets and speed

- Connection strings, source tokens, and model keys come from the environment. They are not in the repository, the client, or a migration.
- Log the run id and the error type. Do not log the connection string, the Telegram init data, or the raw model request.
- Indexes cover the filters above before adding caching. A slow shared-table query is an index or a limit problem first.
