const discord = require("discord.js");
const fs = require(`fs`)
var path = require('path');

/**
 * @param {discord.Client} bot
 * @param {discord.Message} message
 * @param {discord.User} target
*/

module.exports.run = async (bot, message, arguments) => {

    if(message.author.id !== "423478609529929728" && message.author.id !== "222694725487034369" && message.author.id !== "470064639007522837") return message.lineReply("no")
    if(!message.mentions.members) return message.lineReply("We need more info, valid arguments: `@user`")
    
    for (var targetMember of message.mentions.members) {
        let target = targetMember[1].user
        targetMember = message.guild.members.cache.get(target.id);
        let tokenJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tokens.json")).toString());
        let currTokens = tokenJson[target.id];
        if(!currTokens) currTokens = 0;
        currTokens++;
        tokenJson[target.id] = currTokens;
        fs.writeFileSync(path.join(__dirname, "..", "tokens.json"), JSON.stringify(tokenJson))

        message.lineReply(`Gave ${target.username} a token!`)
        const embed = new discord.MessageEmbed()
            .setColor('#356734')
            .setTitle('You have received a token.')
            .setDescription('This token allows you to get a steam key.\nYou can redeem said steam key by going to <#924321539330043964> and typing `d!redeemkey`\nYou can also give the token to someone else by going to <#809326928037281813> typing `d!givetoken @user <amount>`')
            .setFooter(`You currently have ${currTokens} tokens.`)
            .setTimestamp()
            .setAuthor(bot.user.username, bot.user.avatarURL())
            
        target.send(embed);

        let mainDir = path.join(__dirname, '..')
        require(mainDir + "/lib.js").updateTokens(targetMember, currTokens)
    }

}

module.exports.help = {
    name: "addtoken",
    description: "Send Keys Giveaway Winners!",
    aliasses: ["at", "addt", "atoken"]
}