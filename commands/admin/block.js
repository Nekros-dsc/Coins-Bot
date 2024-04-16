
module.exports = {

  name: "block",
  description: "Permets de bloquer les commandes add, remove et reset",
  cooldown: 2,
  owner: true,
  run: async (client, message, args, db) => {
    let guild = db.guilds
    if (args[0] == 'add') {
      guild.update(
        { Add: true },
        { where: { guildId: message.guild.id } }
      );
      message.channel.send(`:x: Les commandes pour ajouter de l'argent ont été retiré`)
    } else if (args[0] == 'reset') {
      guild.update(
        { Reset: true },
        { where: { guildId: message.guild.id } }
      );
      message.channel.send(`:x: Les commandes pour reset ont été retiré !`)
    } else if (args[0] == 'remove') {
      guild.update(
        { Remove: true },
        { where: { guildId: message.guild.id } }
      );
      message.channel.send(`:x: Les commandes pour retirer de l'argent ont été retiré`)
    } else {
      message.channel.send("Veuillez précisez si vous souhaitez bloquer les ajouts d'argent `add` ou les `remove` d'argent ou les `reset`!")
    }
  }
}