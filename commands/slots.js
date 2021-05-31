const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, arguments, db) => {

    function howMany(str, icon) {
        return str.split(icon).length -1;
    }

    let bet = Number(parseInt(arguments[0]));
    let bal = Number(db.get(message.author.id))
    let sides = ['💎', '🥇',  '💵', '💰', '💯']
    let digits = []
    for (i = 0; i < 3; i++) {
        digits[i] = sides[Math.floor(Math.random() * sides.length)]
    }

    if(bet <= 0) {
        return message.channel.send("Please enter the amount of nachos you want to bet.")
    } else if(Number.isNaN(bet)) { 
        return message.channel.send("Please enter the amount of nachos you want to bet.")
    } else if(bet > bal) {
        return message.channel.send("Please make sure the amount of drip you bet is smaller than your balance.")
    }

    let embed = new discord.MessageEmbed()
    .setTitle("Roll the slots!!")
    .setDescription(`Rolling...`)
    .setColor('4c8639')
    .setFooter("Current bet: " + bet)

    message.channel.send(embed).then(async m => {

        setTimeout(() => {
            let embed2 = new discord.MessageEmbed()
            .setTitle("Roll the slots!!")
            .setColor('4c8639')
            .setFooter("Current bet: " + bet)
            .setDescription(`Rolling... ` + digits[0])
            m.edit(embed2)
            setTimeout(() => {
                let embed2 = new discord.MessageEmbed()
                .setTitle("Roll the slots!!")
                .setColor('4c8639')
                .setFooter("Current bet: " + bet)
                .setDescription(`Rolling... ` + digits[0] + " " + digits[1])
                m.edit(embed2)
                setTimeout(() => {
                    let embed2 = new discord.MessageEmbed()
                    .setTitle("Roll the slots!!")
                    .setColor('4c8639')
                    .setFooter("Current bet: " + bet)
                    .setDescription(`Rolling... ` + digits.join(" "))
                    m.edit(embed2)
                }, 1500 /3)
            }, 1500 /3)
        }, 1500 /3)

            setTimeout(() => {
            let embed3 = new discord.MessageEmbed()
            if(howMany(digits.join(" "), "🥇") == 3) {
                let multiplier = 3
                let winnings = Math.round(bet*multiplier-bet)
                embed3.setTitle(`You win, <:nacho:848167478453731338>${winnings}`)                
                embed3.setDescription("You rolled " + digits.join(" ") + " this has a " + multiplier + "x multiplier.")
                embed3.setColor("GREEN")
                embed3.setFooter("Current bet: " + bet)
                embed3.setTimestamp()
                m.edit(embed3)
                return won(winnings);
            }
            
            if(howMany(digits.join(" "), "💎") == 3) {
                let multiplier = 3
                let winnings = Math.round(bet*multiplier-bet)
                embed3.setTitle(`You win, <:nacho:848167478453731338>${winnings}`)                
                embed3.setDescription("You rolled " + digits.join(" ") + " this has a " + multiplier + "x multiplier.")
                embed3.setColor("GREEN")
                embed3.setFooter("Current bet: " + bet)
                embed3.setTimestamp()
                m.edit(embed3)
                return won(winnings);
            }
            
            if(howMany(digits.join(" "), "💯") == 3) {
                let multiplier = 4
                let winnings = Math.round(bet*multiplier-bet)
                embed3.setTitle(`You win, <:nacho:848167478453731338>${winnings}`)                
                embed3.setDescription("You rolled " + digits.join(" ") + " this has a " + multiplier + "x multiplier.")
                embed3.setColor("GREEN")
                embed3.setFooter("Current bet: " + bet)
                embed3.setTimestamp()
                m.edit(embed3)
                return won(winnings);
            }
            
            if(howMany(digits.join(" "), "💵") == 3) {
                let multiplier = 7
                let winnings = Math.round(bet*multiplier-bet)
                embed3.setTitle(`You win, <:nacho:848167478453731338>${winnings}`)
                embed3.setDescription("You rolled " + digits.join(" ") + " this has a " + multiplier + "x multiplier.")
                embed3.setColor("GREEN")
                embed3.setFooter("Current bet: " + bet)
                embed3.setTimestamp()
                m.edit(embed3)
                return won(winnings);
            }
            
            if(howMany(digits.join(" "), "💰") == 3) {
                let multiplier = 10
                let winnings = Math.round(bet*multiplier-bet)
                embed3.setTitle(`You win, <:nacho:848167478453731338>${winnings}`)                
                embed3.setDescription("You rolled " + digits.join(" ") + " this has a " + multiplier + "x multiplier.")
                embed3.setColor("GREEN")
                embed3.setFooter("Current bet: " + bet)
                embed3.setTimestamp()
                m.edit(embed3)
                return won(winnings);
            }
            if(howMany(digits.join(" "), "💰") == 2) {
                let multiplier = 3
                let winnings = Math.round(bet*multiplier-bet)
                embed3.setTitle(`You win, <:nacho:848167478453731338>${winnings}`)                
                embed3.setDescription("You rolled " + digits.join(" ") + " this has a " + multiplier + "x multiplier.")
                embed3.setColor("GREEN")
                embed3.setFooter("Current bet: " + bet)
                embed3.setTimestamp()
                m.edit(embed3)
                return won(winnings);
            }
            if(howMany(digits.join(" "), "💵") == 2) {
                let multiplier = 2
                let winnings = Math.round(bet*multiplier-bet)
                embed3.setTitle(`You win, <:nacho:848167478453731338>${winnings}`)                
                embed3.setDescription("You rolled " + digits.join(" ") + " this has a " + multiplier + "x multiplier.")
                embed3.setColor("GREEN")
                embed3.setFooter("Current bet: " + bet)
                embed3.setTimestamp()
                m.edit(embed3)
                return won(winnings);
            }
            if(howMany(digits.join(" "), "💎") == 2) {
                let multiplier = 2
                let winnings = Math.round(bet*multiplier-bet)
                embed3.setTitle(`You win, <:nacho:848167478453731338>${winnings}`)                
                embed3.setDescription("You rolled " + digits.join(" ") + " this has a " + multiplier + "x multiplier.")
                embed3.setColor("GREEN")
                embed3.setFooter("Current bet: " + bet)
                embed3.setTimestamp()
                m.edit(embed3)
                return won(winnings);
            }
            embed3.setTitle(`You lost, <:nacho:848167478453731338>${bet}`)
            embed3.setDescription("You rolled " + digits.join(" "))
            embed3.setColor("RED")
            embed3.setFooter("Current bet: " + bet)
            embed3.setTimestamp()
            m.edit(embed3)
            return lost()
            }, 1500 + 1500/3)
            

                async function lost() {
                    await db.set(message.author.id, Number(db.get(message.author.id)) - bet)
                    db.sync()
                }
                async function won(winnings) {
                    await db.set(message.author.id, Number(db.get(message.author.id)) + winnings)
                    db.sync()
                }
        })
}

module.exports.help = {
    name: "slots",
    aliasses: ["roll"],
    description: "Roll the slots!"
}