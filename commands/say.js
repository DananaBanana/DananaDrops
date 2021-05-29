const discord = require("discord.js");

module.exports.run = async (bot, message, arguments, folder) => {

    if(message.author.id !== "423478609529929728" && message.author.id !== "222694725487034369") return message.reply("You are not permitted to use this command.")

    if(arguments.length < 1) return message.channel.send("Bruh there aint no message 0_0")
    var sayMessage = arguments.join(" ");
    message.channel.send(sayMessage);
    message.delete();

}

module.exports.help = {
    name: "say"
}