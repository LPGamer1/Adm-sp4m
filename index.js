const http = require('http');
const fs = require('fs');
const path = require('path');
const startBot = require('./core.js');

// --- SERVIDOR WEB (Para manter o Render Online) ---
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'templates', 'home.html');
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Bot Online! (HTML não encontrado)');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('🌐 Web Server Online na porta 3000.');
});

// --- INICIALIZAÇÃO DO BOT ÚNICO ---
(async () => {
    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!token || !clientId) {
        console.error("❌ ERRO: 'DISCORD_TOKEN' ou 'DISCORD_CLIENT_ID' faltando no Render.");
        return;
    }

    try {
        console.log("🚀 Iniciando Bot Nuker...");
        await startBot(token, clientId);
        console.log("✅ Bot iniciado com sucesso!");
    } catch (err) {
        console.error("❌ Erro fatal ao iniciar:", err);
    }
})();

// Anti-Crash
process.on('unhandledRejection', (r) => console.log('Rejection:', r));
process.on('uncaughtException', (e) => console.log('Exception:', e));
