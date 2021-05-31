const discord = require("discord.js");

module.exports.inflation = async function(db, percentage) {

    let json = await db.JSON();
    
    let totalCirculation = 0;

    for(var k in json) {
        let nachos = json[k]
        totalCirculation += nachos;
    }

    let keyCost = Math.round(totalCirculation/100*percentage)

    return { totalCirculation: totalCirculation, keyCost: keyCost }

}