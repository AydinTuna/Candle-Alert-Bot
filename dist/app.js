"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const node_cron_1 = __importDefault(require("node-cron"));
require("dotenv/config");
const bot = new telegraf_1.Telegraf(process.env.TELEGRAM_ACCESS_TOKEN);
const h4AlertUsers = {};
const commandList = {
    h4Alert: "h4Alert",
    stopH4Alert: "stopH4Alert",
    start: "start",
    help: "help"
};
node_cron_1.default.schedule('55 2,6,10,14,18,22 * * *', () => {
    for (const userId in h4AlertUsers) {
        bot.telegram.sendMessage(Number(userId), "🚀 Check the stock market, H4 candle has closed! 📈");
    }
});
bot.command(commandList.h4Alert, (ctx) => {
    const userId = ctx.message?.from?.id;
    if (userId) {
        h4AlertUsers[userId] = true;
        ctx.reply('✅ H4 alerts enabled. You will receive notifications at the specified times.');
        console.log(`📣 ${ctx.message?.from?.username} (${userId}) enabled H4 alerts.`);
    }
});
bot.command(commandList.stopH4Alert, (ctx) => {
    const userId = ctx.message?.from?.id;
    if (userId) {
        delete h4AlertUsers[userId];
        ctx.reply('❌ H4 alerts disabled.');
        console.log(`🔕 ${ctx.message?.from?.username} (${userId}) disabled H4 alerts.`);
    }
});
bot.command(commandList.start, (ctx) => ctx.reply('🤖 Bot started.'));
bot.command(commandList.help, (ctx) => ctx.reply(`
This bot will provide you with stock market reminders. 
    - You can enable alerts with the "/h4Alert" command. 
    - You can disable alerts with the "/stopH4Alert" command.
`));
bot.on('text', (ctx) => {
    const value = getValue(commandList, ctx.message.text);
    if (value?.length === 0) {
        ctx.reply("❌ Invalid command!");
    }
});
const getValue = (object, value) => {
    const slashedValue = removeSlash(value);
    return Object.values(object).filter((objValue) => slashedValue == objValue);
};
const removeSlash = (text) => {
    if (text.startsWith("/")) {
        return text.slice(1);
    }
    else {
        return text;
    }
};
bot.launch().then(() => {
    console.log('🚀 Bot is running.');
}).catch((error) => {
    console.error('❌ Bot couldn\'t start:', error);
});
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=app.js.map