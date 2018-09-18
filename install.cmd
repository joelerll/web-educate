start cmd.exe /k "npm install && cd client && npm install && npm run build && cd .. && npm run cross-env NODE_ENV=production forever -o out.log -errr err.log app.js
