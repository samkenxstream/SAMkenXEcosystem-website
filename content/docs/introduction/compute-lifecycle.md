---
title: Compute lifecycle
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/compute-lifecycle
---

A compute node in Neon is a stateless PostgreSQL process due to the separation of storage and compute. It has two main states: `Active` and `Idle`.

`Active` means that PostgreSQL is currently running. If there are no active queries for 5 minutes, your compute node is automatically placed into an `Idle` state to save on energy and resources. Neon [Pro plan](/docs/introduction/pro-plan) users can disable this auto-suspension behavior so that a compute always remains active, or they can increase or decrease the amount of time after which a compute is placed into an `Idle` state. Auto-suspension behavior is controlled by an **Auto-suspend delay** setting. For information about configuring this setting, see [Edit a compute endpoint](/docs/manage/endpoints#edit-a-compute-endpoint).

The _Auto-suspend_ feature is conservative. It treats an "idle-in-transaction" connection as active to avoid breaking application logic that involves long-running transactions. Only connections that are truly inactive are closed after the defined period of inactivity.

When you connect to an idle compute, Neon automatically activates it. Activation can take anywhere from 500 ms to a few seconds, meaning that the first connection may have a higher latency than subsequent connections. Also, PostgreSQL shared memory buffers are cold after a compute wakes up from the `Idle` state, which means that initial queries may take longer until the shared memory buffers are warmed.

After a period of time in the `Idle` state, Neon occasionally activates your compute to check for data availability. The time between checks gradually increases if the compute does not receive any client connections over an extended period of time.

You can check if a compute is `Active` or `Idle` and watch as a compute transitions form one state to another in the **Branches** widget on the Neon **Dashboard** or on the **Branches** page.

## Compute configuration

Neon only supports modifying session-level configuration parameters. Parameters are reset when the session terminates, such as when the compute suspends due to inactivity.

For information about Neon's PostgreSQL server configuration, see [Neon PostgreSQL parameter settings](/docs/reference/compatibility#neon-postgresql-parameter-settings).

For information about PostgreSQL server configuration, see [Server Configuration](https://www.postgresql.org/docs/14/runtime-config.html), in the PostgreSQL documentation.
