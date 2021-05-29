const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, arguments, folder, db) => {

    let bet = Number(parseInt(arguments[0]));
    let bal = Number(db.get(message.author.id))
    let sides = ['Tails', 'Heads']
    let result;
    let success;
    let dealerTotalWorth
    if(bet == 0) {
        return message.channel.send("Please enter the amount of nachos you want to bet.")
    } else if(Number.isNaN(bet)) { 
        return message.channel.send("Please enter the amount of nachos you want to bet.")
    } else if(bet > bal) {
        return message.channel.send("Please make sure the amount of drip you bet is smaller than your balance.")
    }

    let embed = new discord.MessageEmbed()
    .setTitle("Play Coinflip!")
    .setDescription(`Say ` + "`heads`" +` to select heads and say ` + "`tails`" + ` to select tails`)
    .setColor('4c8639')
    .setFooter("Current bet: " + bet)

    message.channel.send(embed).then(m => {
        let pickside = sides[Math.floor(Math.random() * sides.length)]
        const filter = (filterM) => {
            return (filterM.content.includes('heads') || filterM.content.includes('tails')) && (filterM.author.id === message.author.id)
        }
        const collector = message.channel.createMessageCollector(filter, { time: 30000 });
        collector.on('collect', collectedMessage => {
            if(collectedMessage.content.toLowerCase() == "heads") {
                let resultEmbed = new discord.MessageEmbed()
                if(pickside == "Heads") {
                    resultEmbed.setTitle(`You win, <:nacho:848167478453731338>${bet}`)
                    resultEmbed.setDescription("It was heads!")
                    resultEmbed.setColor("GREEN")
                    won();
                }
                if(pickside == "Tails") {
                    resultEmbed.setTitle(`You lose <:nacho:848167478453731338>${bet}`)
                    resultEmbed.setDescription("It was tails!")
                    resultEmbed.setColor("RED")
                    lost();
                }
                resultEmbed.setFooter("Current bet: " + bet)
                collector.stop()
                m.edit(resultEmbed)
            }
        if(collectedMessage.content.toLowerCase() == "tails") {
            let hitEmbed = new discord.MessageEmbed()
            if(pickside == "Tails") {
                hitEmbed.setTitle(`You win, <:nacho:848167478453731338>${bet}`)
                hitEmbed.setDescription("It was tails!")
                hitEmbed.setColor("GREEN")
                won();
            }
            if(pickside == "Heads") {
                hitEmbed.setTitle(`You lose <:nacho:848167478453731338>${bet}`)
                hitEmbed.setDescription("It was heads!")
                hitEmbed.setColor("RED")
                lost();
                }
                hitEmbed.setFooter("Current bet: " + bet)
                collector.stop()
                m.edit(hitEmbed)
        }
    }),

    collector.on('end', collected => {
        if(collected.size === 0) {return message.channel.send("Timed out, no message was collected.")}
    });

    async function lost() {
        await db.set(message.author.id, Number(db.get(message.author.id)) - bet)
        db.sync()
    }
    async function won() {
        await db.set(message.author.id, Number(db.get(message.author.id)) + bet)
        db.sync()
    }
})}
module.exports.help = {
    name: "coinflip",
    aliasses: ["cf", "cointoss", "flip", "toss"],
    description: "Play Coin Flip!"
}