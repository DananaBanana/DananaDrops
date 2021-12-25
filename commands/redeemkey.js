const discord = require("discord.js");
const { MessageButton }= require('discord-buttons');
const path = require("path")
const fs = require("fs");
const { updateTokens } = require("../lib");

module.exports.run = async (bot, message, arguments, db) => {

    /**
     * @param {discord.Client} bot
     * @param {discord.Message} message
     */

    let tokenJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tokens.json")).toString());
    let currTokens = tokenJson[message.author.id];

    let yesButton = new MessageButton()
        .setStyle('green') //default: blurple
        .setLabel('Yes!') //default: NO_LABEL_PROVIDED
        .setID('continue_redeem') //note: if you use the style "url" you must provide url using .setURL('https://example.com')

    let cancelButton = new MessageButton()
        .setStyle('red')
        .setLabel("Cancel")
        .setID('cancel_redeem')

    message.channel.send(`Hello ${message.author.username}.\nYou currently have ${currTokens} tokens.\nRedeeming a key would remove 1 token and give you 1 steam key.\nAre you sure you want to continue?`, {buttons: [yesButton, cancelButton]})

    let disabled = false;

    bot.on('clickButton', async (button) => {
        if(disabled) return;
        if(button.id === 'continue_redeem') {
            disabled = true;
            if(button.clicker.user.id !== message.author.id) return;


            if(!currTokens) currTokens = 0;   
            if(currTokens == 0) return button.reply.send("You do not have enough tokens.\nYou need at least 1 token.")
            var jsonFile =  JSON.parse(fs.readFileSync(path.join(__dirname, "..", "keys.json")).toString());
            var keyArray = jsonFile.keyArray
            if (keyArray.length === 0) return button.reply.send("There were no keys left, you still have the same amount of tokens.") // When there are no keys left, notify me and 3oF
            var key = keyArray[0];
            keyArray.shift(); // delete the used key
            currTokens--;
            jsonFile.keyArray = keyArray // update the file so the key is deleted
            tokenJson[button.clicker.user.id] = currTokens;
            updateTokens(message.member, currTokens)

            button.reply.send(message.author.tag + " clicked yes, and I sent them the steam key via a DM!")
            try {
                let keyObj = new Object()
                if(typeof key == 'string') {
                    keyObj.key = key
                    keyObj.author = "3oF#6969"
                } else {
                    keyObj = key;
                }
                const embed = new discord.MessageEmbed()
                    .setColor('#fcc603')
                    .setTitle('You Redeemed a key!')
                    .setDescription(`This key can be redeemed on steam.`)
                    .addField("Key:", `||${keyObj.key}||`)
                    .addField("Added by:", `${keyObj.author}`)
                    .setFooter(`You currently have ${currTokens} tokens.`)
                    .setTimestamp()
                    .setAuthor(bot.user.username, bot.user.avatarURL())
                
                message.author.send(embed);
                bot.channels.cache.get("924361720951099443").send(`${message.author.username}#${message.author.discriminator} redeemed a key`)
            }
            catch (e) {
                button.reply.edit("Hmm I couldn't send you a message, I added the key back to the database and added your tokens back!"); 
                keyArray.push(key)
                currTokens++
                tokenJson[button.clicker.user.id] = currTokens;
                jsonFile.keyArray = keyArray;
                updateTokens(message.member, currTokens)
        }
            let redemptions = jsonFile['redemptions']
            redemptions++
            jsonFile['redemptions'] = redemptions;
            console.log(redemptions)
            bot.channels.cache.get("924386339313557595").edit({ name: `🪙 Redemptions: ${redemptions}`}).catch(console.error)};
            fs.writeFileSync(path.join(__dirname, "..", "tokens.json"), JSON.stringify(tokenJson))
            fs.writeFileSync(path.join(__dirname, "..", "keys.json"), JSON.stringify(jsonFile));
        if(button.id === 'cancel_redeem') {
            if(button.clicker.user.id !== message.author.id) return;
            button.reply.send(`Succesfully canceled your request.`);
            disabled = true;
        }
    });

    }

module.exports.help = {
    name: "redeemkey",
    description: "Convert tokens to steam keys."
}