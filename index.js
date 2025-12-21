const http = require('http');
const fs = require('fs');
const path = require('path');
const startBot = require('./core.js');

// --- SERVIDOR WEB ---
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'templates', 'home.html');
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Bot Online!');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('🌐 Web Server Online.');
});

// --- INICIALIZAÇÃO DO BOT ---
(async () => {
    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!token || !clientId) {
        console.error("❌ ERRO: Verifique 'DISCORD_TOKEN' e 'DISCORD_CLIENT_ID' no Render.");
        return;
    }

    try {
        console.log("🚀 Iniciando Bot...");
        await startBot(token, clientId);
        console.log("✅ Bot iniciado!");
    } catch (err) {
        console.error("❌ Erro ao iniciar:", err);
    }
})();

// Anti-Crash Simples
process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});
