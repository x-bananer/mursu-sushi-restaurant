#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "starting backend"
(
  cd "$ROOT/backend"
  npm run dev
) &

echo "----------------------------------"

echo "starting frontend"
(
  cd "$ROOT/frontend"
  npm run dev
) &

wait
