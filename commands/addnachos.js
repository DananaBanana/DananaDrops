const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, arguments, db) => {

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
    let target;
    let nachos;
    if(message.author.id !== "423478609529929728" && message.author.id !== "222694725487034369") return message.lineReply("dammn you tought you could get free money? we aren't a charity fuck off")
    if(!arguments[0]) return message.lineReply("We need more info, valid arguments: `@user <amount>`, `<amount>`")
    if(!isNaN(Number(arguments[0]))) {target = message.author; nachos = Number(arguments[0])} else {
        target = getUserFromMention(arguments[0]);
        if(!target) {
            return message.lineReply('Please mention someone or give us an amount.');
        }
        if(!arguments[1] || isNaN(Number(arguments[1]))) return message.lineReply("Please enter a number.")
        nachos = Number(arguments[1])
    }
    await db.set(target.id, Number(db.get(target.id)) + nachos) // Add nachos
    message.lineReply("Succesfully added " + nachos + " nachos.")

}
module.exports.help = {
    name: "addnachos",
    aliasses: ["an"],
    description: "Free money generator 420p punjabi movie"
}