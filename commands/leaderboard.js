const discord = require("discord.js");
const fs = require("fs")

module.exports.run = async (bot, message, arguments, folder, db) => {

    let objects = await db.JSON();

    let arr = []
    for(var k in objects) {
        let nachos = objects[k]
        let user = bot.users.cache.get(k)
        if(!user) {
            user = new Object()
            user.username = k
            user.discriminator = "????"
        }
        user.nachos = nachos
        arr.push(user)
    }
    function compareNachos(a, b) {
        return a.nachos - b.nachos;
    }
    let sortedArray = []
    sortedArray = arr.sort(compareNachos).reverse();
    let embed = new discord.MessageEmbed()
    .setTitle(`${message.guild.name} Leaderboard`)
    let i = 0;
    let rank;
    sortedArray.forEach(user => {
        if(message.author.id == user.id) rank = i + 1;
        i++
        if(i > 10) return;
        embed.addField(user.username + "#" +user.discriminator, "Nachos: " + user.nachos)
    })
    embed.setDescription("Ranked users, most nachos.\nYour rank is `#" + rank + "/" + arr.length + "`.")
    embed.setColor('4c8639')
    message.channel.send(embed)
}

module.exports.help = {
    name: "leaderboard",
    aliasses: ["lb"],
    description: "See who has the most nachos among us 0_0"
}