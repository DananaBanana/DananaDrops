const discord = require("discord.js");
const fs = require("fs")

module.exports.run = async (bot, message, arguments, folder, db) => {

    let objects = await db.JSON();
    console.log(objects)

    let arr = []
    for(var k in objects) {
        let nachos = objects[k]
        let user = bot.users.cache.get(k)
        console.log(user)
        user.nachos = nachos
        arr.push(user)
    }
    function compareNachos(a, b) {
        return a.nachos - b.nachos;
    }
    let sortedArray = []
    sortedArray = arr.sort(compareNachos).reverse();
    console.log(sortedArray)
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
    embed.setDescription("Ranked users, most nachos.\nYou are the `#" + rank + " person on the leaderboard.`")
    embed.setColor('64648c')
    message.channel.send(embed)
}

module.exports.help = {
    name: "leaderboard",
    aliasses: ["lb"],
    description: "See is the drippiest among us 0_0"
}