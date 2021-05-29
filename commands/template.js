const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, arguments, folder, db) => {

    //Your code goes here!
    await db.set(message.author.id, Number(db.get(message.author.id)) + 69) // Add nachos
    await db.set(message.author.id, Number(db.get(message.author.id)) - 69) // Remove Nachos    

}
module.exports.help = {
    name: "commandName",
    aliasses: ["alias1", "alias2"],
    description: "Description!"
}