import { Context, Telegraf } from 'telegraf';
import cron from 'node-cron';
import 'dotenv/config'

const bot = new Telegraf(process.env.TELEGRAM_ACCESS_TOKEN as string)
const h4AlertUsers: Record<number, boolean> = {};

const commandList: { [key: string]: string } = {
    h4Alert: "h4Alert",
    stopH4Alert: "stopH4Alert",
    start: "start",
    help: "help"
}

cron.schedule('*/2 16 * * *', () => {

    for (const userId in h4AlertUsers) {
        bot.telegram.sendMessage(Number(userId), "🚀 Check the stock market, H4 candle has closed! 📈");
    }
}, {
    timezone: "Europe/Istanbul"
});

bot.command(commandList.h4Alert, (ctx: Context) => {
    const userId = ctx.message?.from?.id;
    if (userId) {
        h4AlertUsers[userId] = true;
        ctx.reply('✅ H4 alerts enabled. You will receive notifications at the specified times.');
        console.log(`📣 ${ctx.message?.from?.username} (${userId}) enabled H4 alerts.`);
    }
});

bot.command(commandList.stopH4Alert, (ctx: Context) => {
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
    const value: string[] = getValue(commandList, ctx.message.text);

    if (value?.length === 0) {
        ctx.reply("❌ Invalid command!")
    }
});

const getValue = (object: { [key: string]: string }, value: string) => {
    const slashedValue: string = removeSlash(value)
    return Object.values(object).filter((objValue) => slashedValue == objValue);
}

const removeSlash = (text: string): string => {
    if (text.startsWith("/")) {
        return text.slice(1);
    } else {
        return text;
    }
}

bot.launch().then(() => {
    console.log('🚀 Bot is running.');
}).catch((error) => {
    console.error('❌ Bot couldn\'t start:', error);
});

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))