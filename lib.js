const discord = require("discord.js");

const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

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

module.exports.updateTokens = async function(member, tokens) {

    /**
     * @param {discord.Client} bot
     * @param {discord.GuildMember} member
     * @param {Number} tokens
    */

    let collection = member.roles.cache
    for (var k of collection) {
        if (k[1].name.endsWith("Tokens") || k[1].name.endsWith("Token")) {
            member.roles.remove(k[1].id)
        }
    }
    if(tokens == 0) return;

    let numText = new String;
    if(tokens >= 5) numText = "5+ Tokens"; 
    else if(tokens == 1) numText = "1 Token"
    else numText = `${tokens} Tokens`
    member.roles.add(member.guild.roles.cache.find(role => role.name == `${numText}`))   

}