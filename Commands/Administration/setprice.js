const Discord = require('discord.js');
const changeArray = ['bar', 'garage', 'magasin', 'gare', 'cinema', 'mairie', 'antirob']
exports.help = {
  name: 'setprice',
  aliases: [],
  description: 'Modifie le prix des objets pré-installés dans le bot (bâtiments, team, impôts)',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration'
}
exports.run = async (bot, message, args, config, data) => {
    if (!args[0] || !args[1]) {
        return message.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`:coin: Configuration des prix`)
                    .setColor(data.color)
                    .setDescription(`**Pour changer le gain prix d'un item faites \`setprice <bar/antirob/team/braqueur/charbon/impots/...> <prix>\`**`)
            ]
        });
    }

    const itemName = args[0].toLowerCase();
    const newPrice = parseInt(args[1]);

    const priceKeys = {
        bar: 'bar',
        impots: 'impots',
        garage: 'garage',
        team: 'team',
        magasin: 'magasin',
        antirob: 'antirob',
        cinema: 'cinema',
        gare: 'gare',
        mairie: 'mairie',
        logo: 'logo',
        banner: 'banner',
        cadena: 'cadenas',
        braqueur: 'braqueure',
        cambrioleur: 'cambrioleur',
        juge: 'juge',
        policier: 'policier',
        hacker: 'hacker',
        tueur: 'tueur',
        blanchisseur: 'blanchisseur',
        cultivateur: 'cultivateur',
        wagon: "wagon"
    };

    if (!(itemName in priceKeys)) {
        return message.reply("L'objet spécifié n'existe pas.");
    }

    const priceKey = priceKeys[itemName];
    let embedDescription = '';
    let ActualPrices = JSON.parse(data.gain)
    if (itemName === 'impots') {
        embedDescription = `:coin: Le prix des **${itemName}** a été modifié en ${newPrice} toutes les 4 heures`;
    } else if (itemName === 'logo' || itemName === 'banner' || itemName === 'cadena') {
        embedDescription = `:small_red_triangle: Le prix des **${itemName}s de team** a été modifié en ${newPrice} rep de team`;
    } else {
        embedDescription = `:wrench: Le prix des **${itemName}s** a été modifié en ${newPrice}`;
    }

    if(changeArray.includes(priceKey)) ActualPrices[priceKey].price = Number(args[1]);
    else ActualPrices[priceKey] = Number(args[1])
    bot.db.prepare(`UPDATE guild SET gain = @coins WHERE id = @id`).run({ coins: JSON.stringify(ActualPrices), id: message.guild.id});

    message.channel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(":white_check_mark: Succès")
                .setColor(data.color)
                .setDescription(embedDescription)
        ]
    });
}