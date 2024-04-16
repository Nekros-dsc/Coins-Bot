const { newCard } = require("../../base/functions");

module.exports = {
    name: "carddrop",
    description: "Génère une carte à collectionner",
    usage: "carddrop",
    cooldown: 5,
    owner: true,
    run: async (client, message, args) => {
        var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
        if (!channel || channel.type !== 'GUILD_TEXT') return message.channel.send(`:x: Salon incorrect`)
        await newCard(client, channel, message.guild)
        message.channel.send(`_Carte générée dans ${channel}_`)

    }
}