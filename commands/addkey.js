const discord = require("discord.js");
const fs = require(`fs`)

module.exports.run = async (bot, message, arguments, folder) => {

    var keyJson = JSON.parse(fs.readFileSync(`${folder}/keys.json`).toString());

    if(message.author.id !== "423478609529929728" && message.author.id !== "222694725487034369") return message.reply("You are not permitted to use this command.")

    if(!arguments) return message.reply(`Please give me a code to put into the system`)
    if(arguments[1]) return message.reply(`Please only give me one code at a time.`)

    if(String(arguments[0]).length < 3) return message.reply("Key length is too short.")

    var key = arguments[0];
    var keyArray = keyJson.keyArray
    if(!key) return message.reply("There is no key for me to add.")
    console.log(String(key).length, key)

    keyArray = keyArray.push(key);

    fs.writeFileSync(`${folder}/keys.json`, JSON.stringify(keyJson));

    message.reply("Succesfully added the key: " + key)
}

module.exports.help = {
    name: "addkey"
}