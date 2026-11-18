# Customer access operations

Tokenmaxxing runs access reconciliation on server startup and every 30 seconds through `server/plugins/access.ts`. Run the Node/Bun Nitro server continuously for automatic enforcement. A sleeping/serverless process cannot guarantee these checks. Restart the application after updating it.

- Disabling a customer revokes portal sessions immediately and queues the associated 9Router key for deactivation.
- Expired plans and exhausted rolling 30-day input + output quotas deactivate the key at the next successful synchronization. Existing requests and polling latency can exceed a quota.
- Only keys disabled by Tokenmaxxing are automatically restored after renewal, quota increase, or rolling usage falling below the quota. Externally disabled keys remain disabled.
- Package presets set a name, expiry and rolling 30-day quota; they do not reset historical key usage or implement billing.
- Remote failures are retried each cycle. Admins can use “Sinkronkan key sekarang” in customer details.
- Use `TOKENMAXXING_DISABLE_ACCESS_SYNC=true` only for isolated startup tests. This disables the background reconciler, not explicit admin synchronization actions.
- Production requires the existing database and 9Router environment variables; never expose the 9Router dashboard password to clients.

Audit records start with this implementation; prior actions are not backfilled. Passwords and raw API keys are not included in audit logs.

## Checks

`bun test src/modules/usage src/modules/customers/access-policy.test.ts`

`bun scripts/test-customer-access.ts` tests quota block/restore, manual-key preservation, expiry, customer login, password changes, reset/session revocation, disabled login and audit. It uses a temporary database customer, mocks all router HTTP calls, and deletes the fixture and its logs afterward. It never modifies real router keys.
