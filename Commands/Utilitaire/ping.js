const Discord = require('discord.js');

exports.help = {
  name: 'ping',
  aliases: [],
  description: 'Affiches les latences du bot',
  use: 'Pas d\'utilisation conseillée',
  category: 'Utilitaire'
}
exports.run = async (bot, message, args, config, data) => {
    const start = Date.now();
    const latency = Date.now() - start;

    let m = await message.reply({ content: `Pong! :ping_pong:\n\nLatence: \`0 ms\`\nAPI: \`0 ms\`\nDB Ping: \`0 ms\``, allowedMentions: { repliedUser: false } })
    let ping = (m.createdTimestamp - message.createdTimestamp);
    m.edit({ content: `Pong! :ping_pong:\n\nLatence d'edit: \`${ping} ms\`\nAPI: \`${Math.round(bot.ws.ping)} ms\`\nDB Ping: \`${latency} ms\``, allowedMentions: { repliedUser: false } })
}