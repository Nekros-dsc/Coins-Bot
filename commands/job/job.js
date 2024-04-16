const Discord = require('discord.js');
const getUser = require('../../base/functions/getUser');
var items = require("../../shop.json");
module.exports = {
  name: "job",
  description: "Permets d'acheter un métier",
  usage: "job <métier>",
  aliases: ['métier'],
  run: async (client, message, args, data) => {
    const jobData = items.job

    const author = await getUser(message.member.id, message.guild.id)

    let job = args[0]
    let jobInfo
    if (job) {
      job = job.toLowerCase()
      jobInfo = jobData[job];
    }

    if (!job || !jobInfo) {
      const jobList = Object.entries(items.job).map(([name, job]) => {
        const price = data.guild.Prices[`${name}price`] || job.price
        return `**${name.charAt(0).toUpperCase() + name.slice(1)}** \n Prix : ${price} rep :small_red_triangle:\n ┖ ${job.description}`;
      }).join('\n\n')
      const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Entrez un métier à acheter !\n${jobList}`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
      return message.channel.send({ embeds: [embed] });
    }

    const jobPrice = data.guild.Prices[`${job}price`] || jobInfo.price
    if (author.Metier === job) return message.channel.send(`:x: Vous êtes déjà un **${job}**`);

    if (parseInt(author.Rep) < parseInt(jobPrice)) {
      const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous avez besoin de ${jobPrice} réputations pour devenir un **${job}**`);
      return message.channel.send({ embeds: [embed] });
    }

    author.update({ Metier: job }, { where: { primary: author.primary }});
    author.decrement('Rep', { by: jobPrice });
    const embed = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setDescription(`:white_check_mark: Vous êtes devenu **${job}** pour \`${jobPrice} rep\`\nAvantage: ${jobInfo.description}`);
    message.channel.send({ embeds: [embed] });

  }
}
