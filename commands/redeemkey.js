const discord = require("discord.js");
const { MessageButton }= require('discord-buttons');
const path = require("path")
const fs = require("fs")

module.exports.run = async (bot, message, arguments, db) => {

    let mainDir = path.join(__dirname, '..')
    let result = await require(mainDir + "/lib.js").inflation(db, 10)
    let keyCost = result.keyCost
    let totalCirculation = result.totalCirculation

    let yesButton = new MessageButton()
        .setStyle('green') //default: blurple
        .setLabel('Yes!') //default: NO_LABEL_PROVIDED
        .setID('continue_redeem') //note: if you use the style "url" you must provide url using .setURL('https://example.com')

    let cancelButton = new MessageButton()
        .setStyle('red')
        .setLabel("Cancel")
        .setID('cancel_redeem')

    message.channel.send("There are currently " + totalCirculation + " nachos, you need 10% of the circulating supply to buy a steam key, so a key would cost you " + keyCost + " nachos!\nAre you sure you want to continue?", {buttons: [yesButton, cancelButton]})

    let disabled = false;

    bot.on('clickButton', async (button) => {
        if(disabled) return;
        if(button.id === 'continue_redeem') {
            disabled = true;
            if(button.clicker.user.id !== message.author.id) return;
            if(keyCost > db.get(message.author.id)) return button.reply.send("You do not have enough nachos.")
                var jsonFile =  JSON.parse(fs.readFileSync(path.join(__dirname, "..", "keys.json")).toString());
                    var keyArray = jsonFile.keyArray
                    if (keyArray.length === 0) return button.reply.send("There were no keys left, you still have the same amount of nachos.") // When there are no keys left, notify me and 3oF
                    var key = keyArray[0];
                    keyArray.shift(); // delete the used key
                    jsonFile.keyArray = keyArray // update the file so the key is deleted
            await db.set(message.author.id, db.get(message.author.id) - keyCost)
            button.reply.send(message.author.tag + " clicked yes, and I sent them the steam key via a DM!")
            try {message.author.send(`Here is your key!` + `\n\`${key}\``, true);}
            catch {
            button.reply.edit("Hmm I couldn't send them a message, I added the key back to the database and added their money back!"); 
            await db.set(message.author.id, db.get(message.author.id) + keyCost)
            keyArray.push(key)
            jsonFile.keyArray = keyArray;
        }
        fs.writeFileSync(path.join(__dirname, "..", "keys.json"), JSON.stringify(jsonFile));
        }
        if(button.id === 'cancel_redeem') {
            if(button.clicker.user.id !== message.author.id) return;
            button.reply.send(`Succesfully canceled your request.`);
            disabled = true;
        }
    });

    }

module.exports.help = {
    name: "redeemkey",
    description: "Convert nachos to steam keys."
}