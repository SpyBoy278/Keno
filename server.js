const express = require('express');
const { Telegraf } = require('telegraf');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the frontend files
app.use(express.static(__dirname));

// Initialize Bot with the token from Render Env Variables
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Welcome to FastKeno! 🎰', {
        reply_markup: {
            inline_keyboard: [[
                { 
                    text: "Play Now", 
                    web_app: { url: process.env.APP_URL } 
                }
            ]]
        }
    });
});

bot.launch();

app.listen(PORT, () => {
    console.log(`✅ Server is live on port ${PORT}`);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
