const discord = require("discord.js");
const fs = require('fs')

module.exports.run = async (bot, message, arguments, folder) => {

    let botConfigPath = `${folder}/botconfig.json`

    var botConfig =  JSON.parse(fs.readFileSync(botConfigPath).toString());

    if(message.author.id !== "423478609529929728" && message.author.id !== "222694725487034369") return message.reply("You are not permitted to use this command.")

    if(!arguments[0]) return message.reply('Please insert an argument so I know what config you are trying to change.\nValid arguments: `minimumSpeakers || minCooldown || maxCooldown || dropPercentage || prefix || nachoCooldown`')
    if(!arguments[1]) return message.reply('Please enter a value for the config you want to change.')
    
    if(arguments[0].toLowerCase() == "minimumspeakers") {
        var number = Number(arguments[1])
        if(isNaN(number)) return message.reply("This isn't a number.")
        botConfig.minimumSpeakers = number;
        fs.writeFileSync(botConfigPath, JSON.stringify(botConfig));
        return message.channel.send("Succesfully set " + arguments[0].toLowerCase() + " to " + number + "!")
    }
    if(arguments[0].toLowerCase() == "mincooldown") {
        var number = Number(arguments[1])
        if(isNaN(number)) return message.reply("This isn't a number.")
        botConfig.minCooldown = number;
        fs.writeFileSync(botConfigPath, JSON.stringify(botConfig));
        return message.channel.send("Succesfully set " + arguments[0].toLowerCase() + " to " + number + "!")
    }
    if(arguments[0].toLowerCase() == "maxcooldown") {
        var number = Number(arguments[1])
        if(isNaN(number)) return message.reply("This isn't a number.")
        botConfig.maxCooldown = number;
        fs.writeFileSync(botConfigPath, JSON.stringify(botConfig));
        return message.channel.send("Succesfully set " + arguments[0].toLowerCase() + " to " + number + "!")
    }
    if(arguments[0].toLowerCase() == "droppercentage") {
        var number = Number(arguments[1])
        if(isNaN(number)) return message.reply("This isn't a number.")
        botConfig.dropPercentage = number;
        fs.writeFileSync(botConfigPath, JSON.stringify(botConfig));
        return message.channel.send("Succesfully set " + arguments[0].toLowerCase() + " to " + number + "!")
    }
    if(arguments[0].toLowerCase() == "prefix") {
        var prefix = arguments[1];
        botConfig.prefix = prefix;
        fs.writeFileSync(botConfigPath, JSON.stringify(botConfig));
        return message.channel.send("Succesfully set " + arguments[0].toLowerCase() + " to " + arguments[1])
    }
    if(arguments[0].toLowerCase() == "nachocooldown") {
        var nachoCooldown = Number(arguments[1]);
        if(isNaN(nachoCooldown)) return message.reply("This isn't a number.")
        botConfig.nachoCooldown = nachoCooldown;
        fs.writeFileSync(botConfigPath, JSON.stringify(botConfig));
        return message.channel.send("Succesfully set " + arguments[0].toLowerCase() + " to " + arguments[1])
    }

    return message.reply('Please insert an argument so I know what config you are trying to change.\nValid arguments: `minimumSpeakers || minCooldown || maxCooldown || dropPercentage || prefix || nachoCooldown`')

}

module.exports.help = {
    name: "config"
}