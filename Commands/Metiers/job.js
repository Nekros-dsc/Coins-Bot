const Discord = require('discord.js');
var items = require("../../Utils/function/shop.json");
exports.help = {
  name: 'job',
  aliases: ['métier'],
  description: 'Permets d\'acheter un métier',
  use: 'job <métier>',
  category: 'Metier'
}
exports.run = async (bot, message, args, config, data) => {
    const jobData = items.job

    const author = bot.functions.checkUser(bot, message, args, message.author.id)

    let job = args[0]
    let jobInfo
    if (job) {
      job = job.toLowerCase()
      jobInfo = jobData[job];
    }

    if (!job || !jobInfo) {
      const jobList = Object.entries(items.job).map(([name, job]) => {
        const price = JSON.parse(data.gain)[name]
        return `**${name.charAt(0).toUpperCase() + name.slice(1)}** \n Prix : ${price} rep :small_red_triangle:\n ┖ ${job.description}`;
      }).join('\n\n')
      const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Entrez un métier à acheter !\n${jobList}`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
      return message.channel.send({ embeds: [embed] });
    }

    const jobPrice = JSON.parse(data.gain)[job]
    if (author.metier === job) return message.channel.send(`:x: Vous êtes déjà un **${job}**`);

    if (parseInt(JSON.parse(author.coins).rep) < parseInt(jobPrice)) {
      const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous avez besoin de ${jobPrice} réputations pour devenir un **${job}**`);
      return message.channel.send({ embeds: [embed] });
    }

    bot.db.prepare(`UPDATE user SET metier = @coins WHERE id = @id`).run({ coins: job, id: message.author.id });
    bot.functions.removeCoins(bot, message, args, message.author.id, jobPrice, 'rep')
    const embed = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setDescription(`:white_check_mark: Vous êtes devenu **${job}** pour \`${jobPrice} rep\`\nAvanusernamee: ${jobInfo.description}`);
    message.channel.send({ embeds: [embed] });
}