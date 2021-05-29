const discord = require("discord.js");

module.exports.run = async (bot, message, arguments, folder) => {


    if(!arguments) return message.channel.send("Uw command is ni volledig")
    var taggedUser = message.mentions.users.first();

    if(arguments[0] == "bellen")  {
            message.guild.members.cache.forEach(member => {
                if(member.user.bot) return;
                if(member.id == bot.user.id) return;
                if(member.id == message.author.id) return;
                console.log(member.id)
                const msg = message.author.username + ": " + bericht 
                member.send(msg)
                message.channel.send("\nDit bericht: `" + msg + "` " + "is verzonden naar: **" + member.user.username + "**")
            })
        return;
    }

    if(!taggedUser) {
        var bericht = arguments.join(" ")
    } else {
        arguments = arguments.slice(1);
        var bericht = arguments.join(" ")
    }
    if(taggedUser) {
        const msg = message.author.username + ": " + bericht 
        taggedUser.send(msg)
        message.channel.send("\nDit bericht: `" + msg + "` " + "is verzonden naar: **" + taggedUser.username + "**")
    }
    if(!taggedUser) {      
            message.guild.members.cache.forEach(member => {
                if(member.user.bot) return;
                if(member.id == bot.user.id) return;
                if(member.id == message.author.id) return;
                console.log(member.id)
                const msg = message.author.username + ": " + bericht 
                member.send(msg)
                message.channel.send("\nDit bericht: `" + msg + "` " + "is verzonden naar: **" + member.user.username + "**")
                        
                    })
            }
    }

module.exports.help = {
    name: "message"
}