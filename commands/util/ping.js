const { GuildsInstance } = require('../../base/Database/database');
module.exports = {
  name: "ping",
  description: "Affiches les latences du bot",
  cooldown: 2,

  run: async (client, message, args) => {

    const start = Date.now();
    await GuildsInstance.authenticate();
    const latency = Date.now() - start;

    let m = await message.reply({ content: `Pong! :ping_pong:\n\nLatence: \`0 ms\`\nAPI: \`0 ms\`\nDB Ping: \`0 ms\``, allowedMentions: { repliedUser: false } })
    let ping = (m.createdTimestamp - message.createdTimestamp);
    m.edit({ content: `Pong! :ping_pong:\n\nLatence d'edit: \`${ping} ms\`\nAPI: \`${Math.round(message.client.ws.ping)} ms\`\nDB Ping: \`${latency} ms\``, allowedMentions: { repliedUser: false } })

  }
};