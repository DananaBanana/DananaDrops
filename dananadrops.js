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
                randomNumb = Math.random() * botConfig.dropChance;
                if(randomNumb < Number(botConfig.dropChance)) {

                    let items = Array.from(talkedSet);
                    var randomUser = items[Math.floor(Math.random() * items.length)]; 
                    let target = message.guild.members.cache.get(randomUser) // select a random user

                    if(target.id == "222694725487034369" || target.id == "423478609529929728" || target.id == "319116998384680960") return;

                    let targetMember = target.member
                    let tokenJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tokens.json")).toString());
                    let currTokens = tokenJson[target.id];
                    if(!currTokens) currTokens = 0;
                    currTokens++;
                    tokenJson[target.id] = currTokens;
                    fs.writeFileSync(path.join(__dirname, "..", "tokens.json"), JSON.stringify(tokenJson))

                    const embed = new discord.MessageEmbed()
                        .setColor('#356734')
                        .setTitle('You have received a token.')
                        .setDescription('This token allows you to get a steam key.\nYou can redeem said steam key by going to <#924321539330043964> and typing `d!redeemkey`\nYou can also give the token to someone else by going to <#809326928037281813> typing `d!givetoken @user <amount>`')
                        .setFooter(`You currently have ${currTokens} tokens.`)
                        .setTimestamp()
                        .setAuthor(bot.user.username, bot.user.avatarURL())
                        
                    target.send(embed);

                    let mainDir = path.join(__dirname, '..')
                    await require(mainDir + "/lib.js").updateTokens(targetMember, currTokens)

                
                    message.channel.send("<@" + randomUser.id + "> won a drop!\nI gave them a token!") // announce someone won the key
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

 });

bot.on('error', console.error);

bot.login(botConfig.token)

const disbut = require('discord-buttons')(bot);