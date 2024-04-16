const Discord = require('discord.js');

module.exports = {
    name: "setprice",
    description: "Modifie le prix des objets pré-installés dans le bot (bâtiments, team, impôts)",
    whitelist: true,
    run: async (client, message, args, data) => {

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
            bar: 'barprice',
            impots: 'impotsprice',
            garage: 'garageprice',
            team: 'teamprice',
            magasin: 'magasinprice',
            antirob: 'antirobprice',
            cinema: 'cinemaprice',
            gare: 'gareprice',
            mairie: 'mairieprice',
            logo: 'logoprice',
            banner: 'bannerprice',
            cadena: 'cadenaprice',
            braqueur: 'braqueurprice',
            cambrioleur: 'braqueurprice',
            juge: 'braqueurprice',
            policier: 'braqueurprice',
            hacker: 'braqueurprice',
            tueur: 'braqueurprice',
            blanchisseur: 'braqueurprice',
            cultivateur: 'braqueurprice',
            wagon: "wagonprice",
            jugement: "jugementprice"
        };

        if (!(itemName in priceKeys)) {
            return message.reply("L'objet spécifié n'existe pas.");
        }

        const priceKey = priceKeys[itemName];
        let embedDescription = '';
        let ActualPrices = data.guild.Prices || {}
        if (itemName === 'impots') {
            embedDescription = `:coin: Le prix des **${itemName}** a été modifié en ${newPrice} toutes les 4 heures`;
        } else if (itemName === 'logo' || itemName === 'banner' || itemName === 'cadena') {
            embedDescription = `:small_red_triangle: Le prix des **${itemName}s de team** a été modifié en ${newPrice} rep de team`;
        } else {
            embedDescription = `:wrench: Le prix des **${itemName}s** a été modifié en ${newPrice}`;
        }

        ActualPrices[priceKey] = Number(args[1]);
        await data.guilds.update({ Prices: ActualPrices }, { where: { guildId: message.guild.id }});

        message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(":white_check_mark: Succès")
                    .setColor(data.color)
                    .setDescription(embedDescription)
            ]
        });

    }
};
