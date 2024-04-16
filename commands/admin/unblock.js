
module.exports = {

  name: "unblock",
  description: "Re-active l'ajout de coins",
  owner: true,

  run: async (client, message, args, db) => {
    let guild = db.guilds
    if (args[0] == 'add') {
      guild.update(
        { Add: false },
        { where: { guildId: message.guild.id } }
      );
      message.channel.send(`:x: Les commandes pour ajouter de l'argent ont été activé`)
    } else if (args[0] == 'reset') {
      guild.update(
        { Reset: null },
        { where: { guildId: message.guild.id } }
      );
      message.channel.send(`:x: Les commandes pour reset ont été activé !`)
    } else if (args[0] == 'remove') {
      guild.update(
        { Remove: false },
        { where: { guildId: message.guild.id } }
      );
      message.channel.send(`:x: Les commandes pour retirer de l'argent ont été activé`)
    }

  }
}