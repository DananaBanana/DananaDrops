const discord = require("discord.js");
require('discord-reply');
var path = require('path');
var botConfig = require(path.join(__dirname, "botconfig"));
const JSONdb = require('simple-json-db')

var messageCounter = 0;

const db = new JSONdb(path.join(__dirname, "nachos.json"));

const bot = new discord.Client();

const fs = require("fs")
bot.commands = new discord.Collection();
bot.aliasses = new discord.Collection();
var talkedSet = new Set();
var nachosSet = new Set();
var cooldown = false;

fs.readdir(path.join(__dirname, "commands"), (err, files) => {

    if(err) console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if(jsFiles.length <=0) {
        console.log("Couldn't find any commands");
        return;
    }

    jsFiles.forEach((f,i) => {

        var fileGet = require(path.join(__dirname, "commands", f));
        console.log(`The file ${f} has been loaded!`)

        bot.commands.set(fileGet.help.name, fileGet);
        if(fileGet.help.aliasses) {
            fileGet.help.aliasses.forEach(alias => {
                bot.aliasses.set(alias, fileGet)
            })
        }
    })

});

bot.on("ready", async () => {

    console.log(`${bot.user.username} is online.`)


    bot.user.setActivity("with some nachos I guess", { type: "PLAYING" });

    setInterval(() => {
        messageCounter = 0;
        talkedSet.clear();
    }, 10 * 1000);

})

bot.on("message", async message => {

    //return if in DM's
    if(message.channel.type === 'dm') return;
    if(message.author.bot) return;

    var prefix = botConfig.prefix;

    if(message.content.startsWith(prefix)) {

    var messageArray = message.content.split(" ");
    var command = messageArray[0];

    var arguments = messageArray.slice(1);
    var commands = bot.commands.get(command.slice(prefix.length)) || bot.aliasses.get(command.slice(prefix.length));

    if(commands) return commands.run(bot, message, arguments, db);
    }

    if(message.channel.id == "701366325565456435") { // Check if channel is #testing (will later be #general)
        if(talkedSet.has(message.author.id)) return; //Check if they talked in the past 10 sec
            messageCounter++
            talkedSet.add(message.author.id)  // make the bot know they talked
            if(messageCounter == Number(botConfig.minimumSpeakers) && cooldown == false) { // checks if enough people are talking and the cooldown is off
                randomNumb = Math.random() * botConfig.dropPercentage;
                if(randomNumb < Number(botConfig.dropPercentage)) { // 
                    var jsonFile =  JSON.parse(fs.readFileSync(__dirname + "\keys.json").toString());
                    var keyArray = jsonFile.keyArray
                    if (keyArray.length === 0) return bot.channels.cache.get("820726443607588905").send("Array empty, please restock keys!"); // When there are no keys left, notify me and 3oF
                    var key = keyArray[0];
                    keyArray.shift(); // delete the used key
                    jsonFile.keyArray = keyArray // update the file so the key is deleted
                    fs.writeFileSync(__dirname + "\keys.json", JSON.stringify(jsonFile));
                    let items = Array.from(talkedSet);
                    var randomUser = items[Math.floor(Math.random() * items.length)]; 
                    randomUser = message.guild.members.cache.get(randomUser) // select a random user
                    let i = 0;
                    if(randomUser.id == "222694725487034369" || randomUser.id == "423478609529929728") return;
                    randomUser.send("You won a drop!\nHere is your steam key: " + key + "!") // DM the user the key
                    message.channel.send("<@" + randomUser.id + "> won a drop!\nI sent them a steam key!") // announce someone won the key
                    cooldown = true; // enable the cooldown
                    messageCounter = 0; // reset the count for how much people talked
                    talkedSet.clear(); // reset the cache of the saved users
                    var ms = Math.floor(Math.random() * (Number(botConfig.maxCooldown) - Number(botConfig.minCooldown) + 1) + Number(botConfig.minCooldown)) * 60 * 1000 // generate a random cooldown
                    setTimeout(() => {
                        cooldown = false; // turn the cooldown off again when the timer expires
                    }, ms);
                }
            }
    }

    if(!nachosSet.has(message.author.id)) {
        nachosSet.add(message.author.id)
        if(db.get(message.author.id)) {db.set(message.author.id, Number(db.get(message.author.id)) + 5)} else {
            db.set(message.author.id, 10) // give 10 nachos if they talk for the first time
        } // give 5 nachos for talking
        setTimeout(() => {
            nachosSet.delete(message.author.id)
        }, botConfig.nachoCooldown * 1000 * 60)
    }

 });

bot.on('error', console.error);

bot.login(botConfig.token)

const disbut = require('discord-buttons')(bot);