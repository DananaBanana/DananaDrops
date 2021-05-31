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
    if(!arguments[0]) return message.lineReply("We need more info, valid arguments: `@user <amount>`")
    
    target = getUserFromMention(arguments[0]);
    if(!target || target == message.author) {
        return message.lineReply('Please mention someone or give us an amount.');
    }
    if(!arguments[1] || isNaN(Number(arguments[1]))) return message.lineReply("Please enter a number.")
    nachos = Number(arguments[1])
    if(nachos <= 0) return message.lineReply("Nacho amount must be bigger than 0.")
    await db.set(target.id, Number(db.get(target.id)) + nachos) // Add nachos
    await db.set(message.author.id, Number(db.get(message.author.id)) - nachos)
    message.lineReply("Succesfully sent " + nachos + " nachos to " + target.username + "!")

}
module.exports.help = {
    name: "givemoney",
    aliasses: ["pay", "paypal", "pp"],
    description: "Paypal but for Nachos"
}