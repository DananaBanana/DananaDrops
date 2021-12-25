const discord = require("discord.js");
const fs = require(`fs`)
var path = require('path');

/**
 * @param {discord.Client} bot
 * @param {discord.Message} message
 * @param {discord.User} target
*/

module.exports.run = async (bot, message, arguments) => {
    
    let target = message.mentions.users.first() 
    if(!target) target = message.author;
    let tokenJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tokens.json")).toString());
    let currTokens = tokenJson[target.id];
    if(!currTokens) currTokens = 0;

    message.lineReply(`${target.username} currently has ${currTokens} token(s)`)

}

module.exports.help = {
    name: "tokenbalance",
    description: "Check how much tokens you have.",
    aliasses: ["tb", "tbalance", "tbal", "tokenbal", "tokenb", "balane", "bal", "b"]
}