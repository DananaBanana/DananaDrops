const discord = require("discord.js");
const fs = require(`fs`)
var path = require('path');
const { updateTokens } = require("../lib");

/**
 * @param {discord.Client} bot
 * @param {discord.Message} message
 * @param {discord.User} target
*/

module.exports.run = async (bot, message, arguments) => {

    if(!arguments[0]) return message.lineReply("We need more info, valid arguments: `@user <number>`")
    if(!arguments[1]) return message.lineReply("We need more info, valid arguments: `@user <number>`")
    let amount = Number(arguments[1])
    if(amount <= 0 || !Number.isInteger(amount)) return message.lineReply("The amount of tokens specified must be a positive integer.")
    
    let target = message.mentions.users.first()
    let targetMember = message.mentions.members.first()
    let tokenJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tokens.json")).toString());

    let authorTokens = tokenJson[message.author.id];
    if(!authorTokens) authorTokens = 0;
    if(authorTokens < amount) return message.lineReply("You don't have enough tokens to do that.")
    authorTokens-= amount;
    tokenJson[message.author.id] = authorTokens;

    let targetTokens = tokenJson[target.id];
    if(!targetTokens) targetTokens = 0;
    targetTokens+= amount;
    tokenJson[target.id] = targetTokens;

    fs.writeFileSync(path.join(__dirname, "..", "tokens.json"), JSON.stringify(tokenJson))

    updateTokens(message.member, authorTokens)
    updateTokens(targetMember, targetTokens)

    message.lineReply(`Gave ${target.username} ${amount} token(s)!`)
    const embed = new discord.MessageEmbed()
        .setColor('#356734')
        .setTitle(`You have received a token from ${message.author.username}#${message.author.discriminator}.`)
        .setDescription('This token allows you to get a steam key.\nYou can redeem said steam key by going to <#924321539330043964> and typing `d!redeemkey`\nYou can also give the token to someone else by going to <#809326928037281813> typing `d!givetoken @user <amount>`')
        .setFooter(`You currently have ${targetTokens} tokens.`)
        .setTimestamp()
        .setAuthor(bot.user.username, bot.user.avatarURL())
        
    target.send(embed);
}

module.exports.help = {
    name: "givetoken",
    description: "Give someone a token!",
    aliasses: ["gt", "givet", "gtoken"]
}