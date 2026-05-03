const express = require('express');
const { Telegraf } = require('telegraf');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('🎰 Welcome to FastKeno Ethiopia! 🎰', {
        reply_markup: {
            inline_keyboard: [[
                { text: "Play Now", web_app: { url: process.env.APP_URL } }
            ]]
        }
    });
});

bot.launch().then(() => console.log('Bot Active'));
app.listen(PORT, () => console.log(`Server on ${PORT}`));
