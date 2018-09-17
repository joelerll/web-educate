git clone https://github.com/joelerll/web-educate.git
cd web-educate 
npm install 
cd client
npm install
npm run build
cd ..

# NODE_ENV=production forever -o log.log -e err.log app.js 