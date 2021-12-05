const discord = require("discord.js");

module.exports.run = async (bot, message, arguments) => {

    if(message.author.id !== "423478609529929728") return message.reply("only danana can do this command lmao")

    var taggedUser = message.mentions.users.first();

    if(!taggedUser) {
        return message.channel.send("Who do you want to shut up?")
    } 
    const filter = (m) => m.author.id === taggedUser.id;

    const collector = message.channel.createMessageCollector(filter, { time: 15 * 1000 });
    message.channel.send("Hey <@" + taggedUser.id +"> fuck you you little shit")

    collector.on('collect', m => {
        const messages = ["fuck off", "ok zoomer", "cringe", "shit on quick", "get rekt", "noob", "joodt"]
        let randomMessage = messages[Math.floor(Math.random() * messages.length)];
        m.reply(randomMessage)
        m.delete();
    });
}   

module.exports.help = {
    name: "shut",
    description: "Mute someone while humiliating them as well."
}