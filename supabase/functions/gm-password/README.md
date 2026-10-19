# Password hashing on Cloudflare Workers

The application preserves PBKDF2-SHA256 at 600,000 iterations, including existing
password hashes. Cloudflare Workers rejects Web Crypto PBKDF2 calls above 100,000
iterations. `src/lib/auth/password.server.ts` falls back to this Supabase Edge
Function only for that specific runtime error. Other crypto failures fail closed.

Deploy `index.ts` together with `src/lib/auth/hash.ts`, preserving their relative
paths. Disable the gateway's legacy JWT verification for this function: it performs
its own authentication against the project's injected `SUPABASE_SECRET_KEYS`.
The caller sends the existing server-only Supabase secret in the `apikey` header.
No browser may call this function with a privileged key. The function does not log
passwords, read the database, or grant sessions. Turnstile and rate limits still
run in the application's login/signup handlers before password processing.

Deploy this function before publishing the application. Verify that unauthenticated
requests return 401, the correct password returns `valid: true`, and an incorrect
password returns `valid: false`. Local Node tests alone do not reproduce the Workers
iteration limit; `tests/password-fallback.test.ts` explicitly simulates it.
