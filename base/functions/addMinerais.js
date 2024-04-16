const { Users } = require("../Database/Models/Users");
const getUser = require("./getUser");

module.exports = async (UserId, GuildId, minerais, Value, addMinerais = true) => {
    let user = await getUser(UserId, GuildId)
    Value = parseInt(Value)
    const currentMinerais = JSON.parse(user.Minerais) || {}

    if (addMinerais) {
        currentMinerais[minerais] = (currentMinerais[minerais] || 0) + Value
    } else {
        if (currentMinerais[minerais] && currentMinerais[minerais] > 0) {
            currentMinerais[minerais] -= Value
        }
    }

    await Users.update(
        { Minerais: currentMinerais },
        { where: { primary: user.primary } }
    )
    return currentMinerais

};
