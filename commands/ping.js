const discord = require("discord.js");

module.exports.run = async (bot, message, arguments, folder, messageArray, discord, cooldown) => {

    message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`);

    
}

module.exports.help = {
    name: "ping",
    description: "How slow is the bot?"
}