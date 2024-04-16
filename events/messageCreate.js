const Discord = require('discord.js');
const { Guilds } = require('../base/Database/Models/Guilds.js');
const { Users } = require('../base/Database/Models/Users.js');
const { wl, owner, webhook } = require('../base/functions');
const color = require('../base/functions/color.js');
const checkGuild = require('../base/functions/checkGuild.js');
const getUser = require('../base/functions/getUser.js');

module.exports = {
  name: 'messageCreate',
  run: async (client, message) => {
    if (!message || !client.token || !message.guild || message.author.bot) return;

    const guildId = message.guild.id;
    const userId = message.author.id;

    // Fetch guild and user data in parallel
    const [guildData, userData] = await Promise.all([
      await checkGuild(client.user.id, guildId),
      await getUser(userId, guildId)
    ]);

    let prefix = guildData?.dataValues.Prefix;
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
      return message.channel.send(`:star: Mon préfixe sur ce serveur est : \`${prefix}\``);
    }

    if (message.content.length === prefix.length) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!cmd) return;

    if (!client.cooldowns.has(cmd.name)) {
      client.cooldowns.set(cmd.name, new Discord.Collection());
    }

    const channels = guildData.PlayChannels || {};
    if (channels[message.channel.id] && await owner(client, userId)) {
      return message.reply(`\`❌\` Les commandes sont désactivées dans ce salon !`);
    }

    const timeNow = Date.now();
    const tStamps = client.cooldowns.get(cmd.name);
    const cdAmount = (cmd.cooldown || 1.5) * 1000;

    if (tStamps.has(userId)) {
      const cooldownExp = tStamps.get(userId) + cdAmount;
      if (timeNow < cooldownExp) {
        let timeLeft = (cooldownExp - timeNow) / 1000;
        let unit = 'seconde';

        if (timeLeft >= 3600) {
          timeLeft = timeLeft / 3600;
          unit = 'heure';
          if (timeLeft >= 60) {
            timeLeft = timeLeft / 60;
            unit = 'minute';
          }
        } else if (timeLeft >= 60) {
          timeLeft = timeLeft / 60;
          unit = 'minute';
        }

        return message.channel.send(`:warning: Veuillez ne pas spam la commande !`);
      }
    }

    if (client.globalCooldowns.has(userId)) {
      const expirationTime = client.globalCooldowns.get(userId) + 1400;

      if (timeNow < expirationTime) {
        const timeLeft = (expirationTime - timeNow) / 1000;
        return message.channel.send(`:warning: Veuillez patienter encore ${timeLeft.toFixed(1)} secondes avant de pouvoir utiliser une autre commande.`);
      }
    }

    tStamps.set(userId, timeNow);
    client.globalCooldowns.set(userId, timeNow);

    setTimeout(() => {
      tStamps.delete(userId);
      client.globalCooldowns.delete(userId);
    }, cdAmount);

    if (cmd.owner) {
      if (await owner(client, message.member.id)) return message.reply('\`❌\` Vous devez être `owner` pour utiliser cette commande !')
  }
  if (cmd.whitelist) {
      if (await wl(client, message.member.id)) return message.reply('\`❌\` Vous devez être `whitelist` pour utiliser cette commande !')
  }



    const db = {
      guilds: Guilds,
      guild: guildData,
      users: Users,
      color: await color(userId, guildId, client)
    };

    try {
      await cmd.run(client, message, args, db);
    } catch (error) {
      console.log(error)
      webhook(error, message);
      return message.channel.send(":x: Une erreur est survenue lors de l'exécution de la commande.").catch(e => { });
    }
  }
};
