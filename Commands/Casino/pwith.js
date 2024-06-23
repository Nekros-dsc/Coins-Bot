const Discord = require('discord.js');
const optionArray = ['coins', 'rep', 'xp']
exports.help = {
  name: 'pwith',
  aliases: ['premiumwith'],
  description: 'Retire votre argent premium ',
  use: 'pwith <amount> ',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
    if(!args[0]) return message.reply(`:x: Veuillez préciser un argument valide (coins/rep/xp)`)
    if(optionArray.includes(args[0])) return message.reply(':x: L\'argument est invalide, essayez `pwith <coins/rep/xp>`')
    if(!args[1]) return message.reply(`:x: Vous devez préciser une somme à retirer !`)
    if(!verifnum(args[1])) return message.reply(`:x: Vous devez préciser une somme **valide** à retirer (>= 0) !`)

    return message.reply(`:x: Vous n'avez que 0 premium-${args[0]} à récupérer, pour en acheter [**cliquez ici**](https://discord.gg/7hDfsSZeCK)`)
}
function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}