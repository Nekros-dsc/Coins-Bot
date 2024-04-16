const Discord = require("discord.js");
var rslow = require('../../roulette.js');
const { wlog } = require("../../base/functions");
var items = require("../../shop.json");
const getUser = require("../../base/functions/getUser.js");
const addMinerais = require("../../base/functions/addMinerais.js");
module.exports = {

  name: "wagon",
  description: "Affiche le contenu de votre wagon",
  aliases: ['minerais'],

  run: async (client, message, args, data) => {
    let user = await getUser(message.member.user.id, message.guild.id);
    let mineData = JSON.parse(user.Minerais) || {}

    if (!mineData.wagon) return message.reply({
      embeds: [new Discord.EmbedBuilder()
        .setColor(data.color)
        .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })
        .setDescription(`:x: Vous devez acheter un wagon avant de pouvoir utiliser cette commande !
  Exemple: \`buy wagon\``)], allowedMentions: { repliedUser: false }
    })



    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Faire une action')
          .addOptions([
            {
              label: 'Vendre',
              description: 'Permets de vendre un minerais',
              value: 'vendre',
            }
          ]),
      );

    let dureefiltrer = response => { return response.author.id === message.author.id };

    message.reply({
      content: "Chargement...",
      components: [row], allowedMentions: { repliedUser: false }
    }).then(async m => {
      update(m)
      rslow.wagon[message.author.id] = false;

      const collector = m.createMessageComponentCollector({
        componentType: Discord.ComponentType.SelectMenu,
        time: 50000
      })
      collector.on("collect", async (select) => {
        if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
        const value = select.values[0]
        await select.deferUpdate()
        if (value == 'vendre') {
          if (rslow.wagon[message.author.id] == true) {
            setTimeout(() => {
              rslow.wagon[message.author.id] = false;
            }, 30000);
            return message.channel.send(`:x: Une vente est déjà en cours ! Veuillez finaliser celle-ci !`)
          }
          rslow.wagon[message.author.id] = true;
          select.followUp(`:question: Entrez maintenant le minerais que vous souhaitez vendre:`)
          message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
            .then(async cld => {
              var msg = cld.first();
              if (msg.content === "charbon" || msg.content === "Charbon") {
                await check("charbon")
                rslow.wagon[message.author.id] = false;
              } else if (msg.content === "fer" || msg.content === "Fer") {
                await check("fer")
                rslow.wagon[message.author.id] = false;
              } else if (msg.content === "or" || msg.content === "Or") {
                await check("or")
                rslow.wagon[message.author.id] = false;
              } else if (msg.content === "diamant" || msg.content === "Diamant") {
                await check("diamant")
                rslow.wagon[message.author.id] = false;
              } else {
                message.channel.send(`:x: Ceci n'est pas un minerais valide !`)
                rslow.wagon[message.author.id] = false;
              }

            })
        }
      })




      function check(minerais) {
        let mineraisgain = (data.guild.Gains)[`${minerais}gain`] || items.minerais[minerais].price

        mineraisgain = parseInt(mineraisgain)
        message.channel.send(`:question: Entrez maintenant la quantité de **${minerais}** que vous souhaitez vendre:`)
        message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
          .then(cld => {
            var msg = cld.first();
            if (isNaN(msg.content)) { update(m); return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`) }
            let somme = msg.content
            let total = mineData[minerais] || 0
            if (parseInt(somme) > parseInt(total)) return message.channel.send(`:x: Vous n'avez pas assez de ce minerais !`)
            if (somme < 5) {
              update(m)
              return message.channel.send(`Vous devez vendre 5 ${minerais} minimum !`)
            }
            let price = mineraisgain * somme
            message.channel.send(`Êtes-vous sûr de vouloir vendre **${somme} ${minerais}** pour \`${price} coins\` ? \`oui\` ?`)
            message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
              .then(async cd => {
                var mssg = cd.first();
                if (typeof (mssg.content) !== "string") { update(m); return message.channel.send(":x: Réponse invalide") }
                let content = mssg.content.toLowerCase()
                if (content == "oui") {
                  mineData = await addMinerais(message.member.id, message.guild.id, minerais, somme, false)

                  user.increment('Coins', { by: price });
                  message.channel.send({
                    embeds: [new Discord.EmbedBuilder()
                      .setColor(data.color)
                      .setDescription(`:pick: Vous venez de vendre ${somme} ${minerais} pour \`${price} coins\` !`)
                      .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
                  })
                  update(m)
                  //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: Vous avez vendu ${somme} ${minerais} pour \`\`${price} coins\`\``)
                  wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de vendre ${somme} ${minerais} pour \`\`${price} coins\`\` !`, "Wagon ")
                }
              })
          })
      }
    })
    async function update(m) {
      user = await getUser(message.member.user.id, message.guild.id);
      m.edit({
        content: " ",
        embeds: [new Discord.EmbedBuilder()
          .setColor(data.color)
          .setThumbnail(`https://cdn.discordapp.com/attachments/902802602306183168/903178186010005544/wagon-removebg-preview.png`)
          .setAuthor({ name: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })
          .setDescription(`
  \`💵\` - Vendre des minerais
  \`📞\` - Donner des minerais
  
  \`\`\`                                                                                                    \`\`\`
  
  **Charbon:** ${mineData.charbon || 0}\n**Fer:** ${mineData.fer || 0}\n**Or:** ${mineData.or || 0}\n**Diamant:** ${mineData.diamant || 0}
  
  _Vous pouvez miner encore ${mineData.wagon} fois avant que le wagon se casse ! Utilisez la commande \`buy wagon\` pour racheter des wagons !_`)], allowedMentions: { repliedUser: false }
      })
    }

  }
};