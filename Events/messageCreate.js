const Discord = require('discord.js');
const blockedCommand2 = ['add', 'remove', 'reset']
module.exports = {
  name: 'messageCreate',
  async execute(message, bot, config) {
    const guild = bot.functions.checkGuild(bot, message, message.guild.id)
    let blacklistUserArray = JSON.parse(guild.blacklist)
    const blockedCommand = JSON.parse(guild.blockedCommand)
    try { 
      if (!message.guild && message.author.bot) return;

      if(message.content == `<@${bot.user.id}>`) return message.reply(`:star: Mon préfixe sur ce serveur est : \`${guild.prefix}\``)
      
      if (message.content.startsWith(`<@${bot.user.id}>`)) {
        const args = message.content.slice(`<@${bot.user.id}>`.length).trim().split(/ +/);
        const commandFile = args.shift()?.toLowerCase() ? bot.commands.get(args.shift()?.toLowerCase()) : null;
        if(bot.functions.checkUser(bot, message, args, message.author.id).color) guild.color = bot.functions.checkUser(bot, message, args, message.author.id).color
        if(blacklistUserArray.includes(message.author.id)) return message.reply("`⛔`Vous êtes blacklist coins ! Contactez un owner du serveur pour plus d'informations !")
          if(blockedCommand2.includes(commandFile.help.name)) {
            const json = JSON.parse(guild.blockedCommandAdmin)
            if(json[commandFile.help.name] == "on") return message.reply(`Ces commandes ont été désactivé sur le serveur par le propriétaire du bot !`)
          }
          if(blockedCommand.includes(message.channel.id)) return message.reply("`❌` Les commandes sont désactivées dans ce salon !")
          if(permOrNON(bot, message, guild, commandFile, config) == true) await commandFile.run(bot, message, args, config, guild);
          const req = bot.functions.checkUser(bot, message, args, message.author.id)
        if(!req.quete) return
        let json = JSON.parse(req.quete)
        if(json?.type == 1 && json.command == commandFile.help.name) {
            if(json.nombre == 0) return
            else json["nombre"] = json.nombre - 1
            bot.db.prepare(`UPDATE user SET quete = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
        } else if(json?.type == 2) {
          if(json.nombre == 0) return
          else json["nombre"] = json.nombre - 1
          bot.db.prepare(`UPDATE user SET quete = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
        }
    } else if (message.content.startsWith(guild.prefix)) {
        const messageArray = message.content.slice(guild.prefix.length).trim().split(/ +/);
        if(!messageArray[0]) return
        const args = messageArray.slice(1);
        const commandFile = bot.commands.get(messageArray[0].toLowerCase());
        if (!commandFile) return;
        if(bot.functions.checkUser(bot, message, args, message.author.id).color) guild.color = bot.functions.checkUser(bot, message, args, message.author.id).color
        if(blacklistUserArray.includes(message.author.id)) return message.reply("`⛔`Vous êtes blacklist coins ! Contactez un owner du serveur pour plus d'informations !")
        if(blockedCommand2.includes(commandFile.help.name)) {
          const json = JSON.parse(guild.blockedCommandAdmin)
          if(json[commandFile.help.name] == "on") return message.reply(`Ces commandes ont été désactivé sur le serveur par le propriétaire du bot !`)
        }
        if(blockedCommand.includes(message.channel.id)) return message.reply("`❌` Les commandes sont désactivées dans ce salon !")
          if(permOrNON(bot, message, guild, commandFile, config) == true) await commandFile.run(bot, message, args, config, guild);
        const req = bot.functions.checkUser(bot, message, args, message.author.id)
        if(!req.quete) return
        let json = JSON.parse(req.quete)
        if(json?.type == 1 && json.command == commandFile.help.name) {
            if(json.nombre == 0) return
            else json["nombre"] = json.nombre - 1
            bot.db.prepare(`UPDATE user SET quete = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
        } else if(json?.type == 2) {
          if(json.nombre == 0) return
          else json["nombre"] = json.nombre - 1
          bot.db.prepare(`UPDATE user SET quete = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
        }
        }
    } catch(e) {
      console.log(e)
    }
  },
};

function permOrNON(bot, message, guild, commandFile, config) {
  if(commandFile.help.perm == "WHITELIST") {
    const whitelist = JSON.parse(guild.wl)
    const owners = JSON.parse(guild.owners)
    if(whitelist.includes(message.author.id)) return true
    else if(owners.includes(message.author.id)) return true
    else if(config.buyers.includes(message.author.id)) return true
    else return message.reply("`❌` Vous devez être `whitelist` pour utiliser cette commande !")
  } if(commandFile.help.perm == "OWNER") {
    const owners = JSON.parse(guild.owners)
    if(owners.includes(message.author.id)) return true
    else if(config.buyers.includes(message.author.id)) return true
    else return message.reply("`❌` Vous devez être `owner` pour utiliser cette commande !")
  } else if(commandFile.help.perm == "BUYER") {
  if(config.buyers.includes(message.author.id)) return true
    else return message.reply("`❌` Vous devez être `buyer` pour utiliser cette commande !")
  } else return true
}