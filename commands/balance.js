const discord = require("discord.js");

module.exports.run = async (bot, message, arguments, folder, db) => {

    function getUserFromMention(mention) {
        if (!mention) return;
    
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
    
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
    
            return bot.users.cache.get(mention);
        }
    }

    let target
    let bal = 0
    if(arguments[0]) {
        target = getUserFromMention(arguments[0]);
        if(!target) {
            return message.reply('Please mention someone.');
        }
    } else target = message.author
    bal = db.get(target.id)
    if(bal == undefined) bal = 0;

    message.channel.send("**" + target.username + "** currently has **" + bal + " nachos!**")

}

module.exports.help = {
    name: "balance",
    aliasses: ["bl", "bal"]
}