const Discord = require('discord.js');
const bot = new Discord.Client({ intents: 3276799, partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.User, Discord.Partials.GuildMember, Discord.Partials.Reaction, Discord.Partials.ThreadMember, Discord.Partials.GuildScheduledEvent] });
bot.commands = new Discord.Collection();
bot.slashCommands = new Discord.Collection();
bot.setMaxListeners(70);

const commandHandler = require('./Handler/Commands')(bot);
const eventdHandler = require('./Handler/Events')(bot);
const DatabaseHandler = require('./Handler/database')(bot);
const anticrashHandler = require('./Handler/anticrash');
anticrashHandler(bot);
bot.db = DatabaseHandler;
bot.functions = require('./Utils/function/functionCoins')


bot.login(require('./config.js').token).then(() => { console.log(`[!] — Logged in as ${bot.user.username} (${bot.user.id})`); }).catch(() => { console.log('\x1b[31m[!] — Please configure a valid bot token\x1b[0m'); });