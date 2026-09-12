# ThibitiFare backend

FastAPI service wiring together the two ThibitiFare flows:

1. **STK push** — conductor sends a payment prompt to the commuter's own phone.
2. **Verification** — conductor checks a transaction code against Safaricom's record.

## Setup

```bash
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env` with the Consumer Key, Consumer Secret, and Passkey from your app
on [developer.safaricom.co.ke](https://developer.safaricom.co.ke).

## Expose a callback URL

Daraja needs to reach your machine over HTTPS to deliver results.

```bash
ngrok http 8000
```

Copy the `https://....ngrok-free.app` URL ngrok gives you into `DARAJA_CALLBACK_URL`
in `.env`.

## Run

```bash
uvicorn app.main:app --reload
```

## Try it (sandbox)

```bash
curl -X POST http://localhost:8000/stk-push \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "254708374149", "amount": 1, "route": "Rongai-Town"}'
```

`254708374149` is Safaricom's sandbox test number — it always "succeeds" without
a real phone. Watch your server logs for the callback hitting `/daraja/callback`.

## What's stubbed vs real

- **STK push (`/stk-push`, `/daraja/callback`)** — fully wired to real Daraja
  endpoints; already tested end to end against the sandbox, including a real
  phone receiving a PIN prompt.

- **Verify: real vs stub** — `/verify` has two modes, controlled by
  `DARAJA_VERIFY_STUB` in `.env`:

  - **`true` (default, demo-safe)** — checks the code against receipts
    ThibitiFare has actually seen from real STK Push callbacks
    (`known_receipts`, filled in by `/daraja/callback`). This is genuinely
    checking real Safaricom transaction data — it's just sourced from your
    own callbacks instead of a second live round-trip to Daraja. Reliable to
    demo live in front of judges since it doesn't depend on network timing.
  - **`false` (the real path)** — calls Safaricom's `TransactionStatusQuery`
    directly, authenticated with a proper RSA-encrypted `SecurityCredential`
    (see `app/security_credential.py` for the one-time certificate setup).
    This is the architecturally correct approach for production, but
    `TransactionStatusQuery` is *asynchronous*: Safaricom's real answer
    arrives later via POST to `/daraja/transaction-status-result`, not in
    the immediate response. That endpoint has a `TODO` to match the result
    back to the original request — needed before this path is demo-reliable.

  Either way, `used_codes` still prevents the same code being accepted twice.

- **Storage** — `stk_requests`, `used_codes`, and `known_receipts` are plain
  in-memory dicts/sets for the demo. Anything you want to survive a restart
  (or work across more than one server process) needs a real database —
  SQLite is enough for a hackathon.

## Next steps

- Swap in-memory storage for SQLite (`sqlite3` or `sqlmodel` — light enough to
  keep for a hackathon, easy to swap for Postgres later).
- Point the two React prototypes at this API instead of their simulated
  responses (`fetch("http://localhost:8000/stk-push", ...)`, etc.).
- Move the `verify_c2b_transaction` credential handling to the real
  certificate-based `SecurityCredential` before any live demo with real money.
