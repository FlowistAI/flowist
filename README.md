# GIDE

## Layout of the project

```text
packages/
    web/
    electron/
scripts/
```

## Setup

```bash
pnpm i
```

## Development

```bash

# Start the web app in @gide-app/web
pnpm --filter @gide-app/web run dev

# Start the electron app in @gide-app/electron
pnpm --filter @gide-app/electron run dev
```
