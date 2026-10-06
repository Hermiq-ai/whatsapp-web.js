# Running Tests

## Unit tests

Unit tests do not require a WhatsApp account, a browser session, or secrets.
They run on every pull request.

```bash
npm test
```

## Integration tests

These tests require an authenticated WhatsApp Web session, as well as an additional phone that you can send messages to.

This can be configured using the following environment variables:

- `WWEBJS_TEST_CLIENT_ID`: `clientId` to use for local file based authentication (required for authenticated tests).
- `WWEBJS_TEST_REMOTE_ID`: A valid WhatsApp ID that you can send messages to, e.g. `123456789@c.us`. It should be different from the ID used by the provided session (required).

You can create a `.env` file in the root directory with these variables. See `.env.example` for a template.

To run the tests:

```bash
npm run test:integration
```
