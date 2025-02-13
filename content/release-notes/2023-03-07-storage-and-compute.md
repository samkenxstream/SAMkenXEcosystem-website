### Bug Fixes

- Pageserver: Added logic to handle unexpected Write-Ahead Log (WAL) redo process failures, which could cause a `Broken pipe` error on the Pageserver. In case of a failure, the WAL redo process is now restarted, and requests to apply redo records are retried automatically.
- Pageserver: Added timeout logic for the copy operation that occurs when downloading a data layer. The timeout logic prevents a deadlock state if a data layer download is blocked.
- Safekeeper: Addressed `Failed to open WAL file` warnings that appeared in the Safekeeper log files. The warnings were due to an outdated `truncate_lsn` value on the Safekeeper, which caused the _walproposer_ (the Postgres compute node) to download WAL records starting from a Log Sequence Number (LSN) that was older than the `backup_lsn`. This resulted in unnecessary WAL record downloads from cold storage.
