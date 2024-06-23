const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'juge',
  aliases: [],
  description: 'lance un procès pour enlever le métier d\'un joueur',
  use: 'juge <@user>',
  category: 'Metier'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).juge;
    let memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
    if (memberDB.metier === "juge") {
        if (cooldownsReputation.has(message.author.id)) {
            const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
            const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);
    
            if (remainingCooldown > 0) {
                const hours = Math.floor(remainingCooldown / 3600);
                const minutes = Math.floor((remainingCooldown % 3600) / 60);
                const seconds = Math.floor(remainingCooldown % 60);
    
                const CouldownEmbed = new Discord.EmbedBuilder()
                .setDescription(`🕐 Vous avez déjà \`braquage\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor(data.color)
    
                return message.reply({ embeds: [CouldownEmbed] });
            }
        }
      if (memberDB.capacite === "blanchisseur" || memberDB.capacite === "cultivateur") {
        message.delete().catch(e => { })
        message.channel.send({
          embeds: [new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: Vous ne pouvez pas utiliser cette commande en ayant votre capacité actuel !`)
            .setFooter({ text: `Commande Anonyme` })]
        })
      }
      if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "juge", 29100000, true))) return
      let jprice = data.guild.Prices["jugementprice"] || 500

      let Embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous avez besoin de ${jprice} coins pour lancer un procès !`);
      if (parseInt(JSON.parse(memberDB.coins).coins) < parseInt(jprice)) return message.channel.send({ embeds: [Embed] })

      let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      if (!user || user.user.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
      let targetuser = await bot.functions.checkUser(bot, message, args, user.id)

      let moneyEmbed2 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: **${user.user.username}** n'a pas de métier !`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
      if (!targetuser.metier) {
        return message.channel.send({ embeds: [moneyEmbed2] })
      }

      cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));

      let pour = 0
      let contre = 0
      let votants = {}
      let button_next = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('pour').setEmoji("✅")
      let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('contre').setEmoji("❌")

      let button_row = new Discord.ActionRowBuilder().addComponents([button_next, button_back])
      message.channel.send({
        content: `:judge: **${message.member.user.username} lance un procès contre ${user.user.username}** pour lui retirer son métier de \`${targetuser.metier}\`.\n
> Si vous êtes favorable à ce procès pour lui retirer son métier cliquez sur :white_check_mark:
      
> Si vous êtes contre ce procès et que vous ne souhaitez pas lui enlever son métier cliquez sur :x:
      
Le parti gagnant est celui arrivant au nombre de vote requis en premier, vous ne pouvez voter qu'une fois et vous ne pouvez pas changer d'avis, réfléchissez bien !
                        
        :white_check_mark: **Pour:** \`${pour} / 5 voix\`   |   :x: **Contre:** \`${contre} / 3 voix\``, components: [button_row]
      }).then(m => {
        const collector = message.channel.createMessageComponentCollector({
          componentType: Discord.ComponentType.Button,
          time: 60000
        })
        collector.on("collect", async (i) => {
          if (i.user.id === client.user.id) return
          await i.deferUpdate()
          let reacter = i;
          if (votants[reacter.user.id]) return i.followUp({ content: "Désolé, mais vous ne pouvez pas revoter !", ephemeral: true }).catch(() => { })
          votants[reacter.user.id] = true
          if (i.customId === 'pour') {
            pour++
            m.edit({
              content: `:judge: **${message.member.user.username} lance un procès contre ${user.user.username}** pour lui retirer son métier de \`${targetuser.metier}\`.\n
> Si vous êtes favorable à ce procès pour lui retirer son métier cliquez sur :white_check_mark:
                        
> Si vous êtes contre ce procès et que vous ne souhaitez pas lui enlever son métier cliquez sur :x:
                        
Le parti gagnant est celui arrivant au nombre de vote requis en premier, vous ne pouvez voter qu'une fois et vous ne pouvez pas changer d'avis, réfléchissez bien !
                        
        :white_check_mark: **Pour:** \`${pour} / 5 voix\`   |   :x: **Contre:** \`${contre} / 3 voix\``
            })
            if (pour >= 5) {
              collector.stop()
              let embed = new Discord.EmbedBuilder()
                .setDescription(`:scales: **Vous avez jugé ${user.user}**, son rôle de ${targetuser.metier} lui a bien été retiré et il se retrouve désormais chômeur !`)
                .setColor(data.color)
                .addField(`Voix **pour**:`, `\`${pour} / 5 voix\``)
                .addField(`Voix **contre**:`, `\`${contre} / 3 voix\``)
                .setImage('https://media.discordapp.net/attachments/1249042420163674153/1249835951103148122/3330157_original.gif?ex=6668bfef&is=66676e6f&hm=e90ea96b082f709ef58d1e1d98940ad259029f28e437cfe3948c943cef57cb6c&=&width=899&height=505')
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
              message.channel.send({ embeds: [embed] })
              bot.db.prepare(`UPDATE user SET metier = @coins WHERE id = @id`).run({ coins: null, id: user.id });
              return
            }


          } else if (i.customId === 'contre') {
            contre++
            m.edit(`:judge: **${message.member.user.username} lance un procès contre ${user.user.username}** pour lui retirer son métier de \`${targetuser.metier}\`.\n
> Si vous êtes favorable à ce procès pour lui retirer son métier cliquez sur :white_check_mark:
                        
> Si vous êtes contre ce procès et que vous ne souhaitez pas lui enlever son métier cliquez sur :x:
                        
Le parti gagnant est celui arrivant au nombre de vote requis en premier, vous ne pouvez voter qu'une fois et vous ne pouvez pas changer d'avis, réfléchissez bien !
                        
        :white_check_mark: **Pour:** \`${pour} / 5 voix\`   |   :x: **Contre:** \`${contre} / 3 voix\``)
            if (contre >= 3) {
              collector.stop()
              let embed = new Discord.EmbedBuilder()
                .setDescription(`:scales: **Vous avez jugé ${user.user}**, son rôle de ${targetuser.metier} ne lui a pas été retiré !`)
                .addField(`Voix **pour**:`, pour)
                .addField(`Voix **contre**:`, contre)
                .setColor(data.color)
                .setImage('https://media.discordapp.net/attachments/1249042420163674153/1249835951103148122/3330157_original.gif?ex=6668bfef&is=66676e6f&hm=e90ea96b082f709ef58d1e1d98940ad259029f28e437cfe3948c943cef57cb6c&=&width=899&height=505')
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
              message.channel.send({ embeds: [embed] })
              return
            }
          }
        })
        collector.on("end", async () => {
          return m.edit({ content: ":x:", components: [] }).catch(() => { })
        })
      })

    } else {
      return message.channel.send({
        embeds: [new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(`:x: Vous devez être **juge** pour utiliser cette commande !`)]
      })
    }
}