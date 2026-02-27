#!/usr/bin/env bash
set -e
cd backend && npm run build
npx tsc ../api/index.ts --outDir ../api --esModuleInterop --skipLibCheck --module commonjs --target ES2020
cd .. && npx @vercel/ncc build api/index.js -o api --target es2020
mv api/index.js api/handler.js
rm -f api/index.js.map
# index.ts solo re-exporta el bundle; así Vercel encuentra el archivo y no pisa handler.js
echo "module.exports = require('./handler.js');" > api/index.ts
cd frontend && npm run build
