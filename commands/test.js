const discord = require("discord.js");

module.exports.run = async (bot, message, arguments, folder, messageArray, discord, cooldown) => {

    //message.reply("Random amount of milliseconds generated: " + Math.floor(Math.random() * (20 - 10) + 10) * 60 * 1000);
    message.reply("Cooldown is currently " + cooldown)
}

module.exports.help = {
    name: "test"
}