const discord = require("discord.js");

module.exports.inflation = async function(db) {

    let json = await db.JSON();
    
    let totalCirculation = 0;

    for(var k in json) {
        let nachos = json[k]
        totalCirculation += nachos;
    }

    let percentage = 10;
    let keyCost = Math.round(totalCirculation/100*percentage)

    return { totalCirculation: totalCirculation, keyCost: keyCost }

}