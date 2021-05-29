const discord = require("discord.js");

module.exports.run = async (bot, message, arguments, folder) => {

    async function fetchMore(channel, limit = 250) {
        if (!channel) {
          throw new Error(`Expected channel, got ${typeof channel}.`);
        }
        if (limit <= 100) {
          return channel.messages.fetch({ limit });
        }
      
        let collection = new discord.Collection();
        let lastId = null;
        let options = {};
        let remaining = limit;
      
        while (remaining > 0) {
          options.limit = remaining > 100 ? 100 : remaining;
          remaining = remaining > 100 ? remaining - 100 : 0;
      
          if (lastId) {
            options.before = lastId;
          }
      
          let messages = await channel.messages.fetch(options);
      
          if (!messages.last()) {
            break;
          }
      
          collection = collection.concat(messages);
          lastId = messages.last().id;
        }
      
        return collection;
      }

    function start() {
    startTime = new Date();
    };
    
    function end() {
    endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    return timeDiff
    }

    let memeChannel = bot.channels.cache.get('829768131701506168') 
    /*memeChannel.fetchManyMessages(20).then(msgs => {
        console.log(msgs.size)
    })*/
    let found = false;
    message.channel.send("Searching for meme...").then(async (msg) => {
        start()
        let messages = await fetchMore(memeChannel, 500)
        while(found == false) {
            function getRandomItem(iterable) {
                let randomNum = [Math.floor(Math.random() * iterable.size)]
                let randomOther = [...iterable.keys()][Math.floor(Math.random() * iterable.size)]
                console.log(randomNum);
                return iterable.get(randomOther)
            }
            let item = getRandomItem(messages)
            if(item.attachments.size > 0) {
                let attachment = item.attachments.first().attachment
                let time = end()
                msg.edit(`Found a meme in ${time}ms!\n${attachment}\nOriginal message: https://discord.com/channels/623461277921968128/829768131701506168/${item.id}`)
                found = true;
            }
        }
    })
}

module.exports.help = {
    name: "meme",
    description: "Funny meme?"
}