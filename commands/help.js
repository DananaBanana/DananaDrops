const discord = require("discord.js");
var botConfig = require("../botConfig.json");
const fs = require("fs")

module.exports.run = async (bot, message, arguments) => {

    fs.readdir("./commands/" , (err, files) => {

        if(err) console.log(err);
    
        var jsFiles = files.filter(f => f.split(".").pop() === "js");

        var embed = new discord.MessageEmbed()
            .setTitle(`${bot.user.username} commands!`)
            .setDescription("This is a list of all of the bot commands and their description!")
            .setTimestamp()
            .setColor('4c8639')

        jsFiles.forEach((f,i) => {
            let field2;
            var fileGet = require(`../commands/${f}`);
            if(!fileGet.help.aliasses) {field2 = `**Description**: ${fileGet.help.description}`}
            else {field2 = `**Description**: ${fileGet.help.description}\n**Aliasses**: ${botConfig.prefix}${fileGet.help.aliasses.join(`, ${botConfig.prefix}`)}`}
            embed.addField(`${botConfig.prefix}${fileGet.help.name}`, field2)
        })
        message.channel.send(embed)
    })

}

module.exports.help = {
    name: "help",
    aliasses: ["h"],
    description: "See all of the commands this bot has!"
}