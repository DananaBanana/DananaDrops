const discord = require("discord.js");
const fs = require(`fs`)
var path = require('path');

module.exports.run = async (bot, message, arguments, db) => {

    let keysPath = path.join(__dirname, '..', 'keys.json')
    var keyJson = JSON.parse(fs.readFileSync(keysPath).toString());
    if(message.author.id !== "423478609529929728" && message.author.id !== "222694725487034369") return message.reply("You are not permitted to use this command.")

    let keys = keyJson.keyArray.length

    message.reply(`The bot has ${keys} keys!`)

}

module.exports.help = {
    name: "checkStock",
    aliasses: ["cs"],
    description: "Check how many keys the bot has in its system!"
}