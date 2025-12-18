const http = require('http');
const startBot = require('./core.js');

http.createServer((req, res) => {
  res.write("SP4M_B0T UNLEASHED - ADM MODE");
  res.end();
}).listen(process.env.PORT || 3000);

console.log("🚀 Lançando Bots em modo agressivo...");

// Bot 1
startBot(process.env.TOKEN_1, process.env.CLIENT_ID_1);
// Bot 2
startBot(process.env.TOKEN_2, process.env.CLIENT_ID_2);

