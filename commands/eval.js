const discord = require("discord.js");

module.exports.run = async (bot, message, arguments, folder) => {

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        if(message.author.id !== "423478609529929728") return;
        try {
        const code = arguments.join(" ");
        let evaled = eval(code);
    
        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
    
        //message.channel.send(evaled, {code:"xl"});
        } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${(err)}\n\`\`\``);
        }

    }

module.exports.help = {
    name: "eval",
    description: "Dangerous, Danana only"
}