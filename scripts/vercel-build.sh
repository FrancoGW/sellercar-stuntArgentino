#!/usr/bin/env bash
set -e
cd backend && npm run build
npx tsc ../api/index.ts --outDir ../api --esModuleInterop --skipLibCheck --module commonjs --target ES2020
cd .. && npx @vercel/ncc build api/index.js -o api --target es2020
rm -f api/index.ts api/index.js.map
cd frontend && npm run build
