const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, arguments, folder, db) => {

    let bet = Number(parseInt(arguments[0]));
    let bal = Number(db.get(message.author.id))
    let totalWorth = 0;
    let currCard;
    let cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11]
    let suites = ['♤', '♡', '♢', '♧']
    let handedCards = []
    let dealerHandedCards = []
    let result;
    let success;
    let dealerTotalWorth
    if(bet == 0) {
        return message.channel.send("Please enter the amount of nachos you want to bet.")
    } else if(Number.isNaN(bet)) { 
        return message.channel.send("Please enter the amount of nachos you want to bet.")
    } else if(bet > bal) {
        return message.channel.send("Please make sure the amount of drip you bet is smaller than your balance.")
    }
    if(arguments[0].toLowerCase() == "all") {
        bet = bal
    }
    function updateWorth() {
        totalWorth = 0;
        cardNumb = -1
        handedCards.forEach(card => {
            cardNumb++
            if(card.name == "A" && (totalWorth + 11) > 21) {card.worth = 1; handedCards[cardNumb].worth = card.worth;}
            totalWorth += card.worth
        })
        cardNumb = -1
        handedCards.forEach(card => {
            cardNumb++
            if(card.worth == 11 && (totalWorth) > 21) {
                card.worth = 1;
                handedCards[cardNumb].worth = card.worth; 
                totalWorth -= 10
            }
        })
        return totalWorth
    }
    function dealerUpdateWorth() {
        dealerTotalWorth = 0;
        cardNumb = -1
        dealerHandedCards.forEach(card => {
            cardNumb++
            if(card.name == "A" && (totalWorth + 11) > 21) {card.worth = 1; dealerHandedCards[cardNumb].worth = card.worth;}
            dealerTotalWorth += card.worth
        })
        cardNumb = -1
        dealerHandedCards.forEach(card => {
            cardNumb++
            if(card.worth == 11 && (totalWorth) > 21) {
            card.worth = 1; 
            dealerHandedCards[cardNumb].worth = card.worth; 
            totalWorth -= 10}
        })
        return dealerTotalWorth
    }

    function handCard() {
        currCard = handedCards.length;
        handedCards[currCard] = new Object();
        handedCards[currCard].worth = cards[Math.floor(Math.random()*cards.length)];
        handedCards[currCard].suite = suites[Math.floor(Math.random()*suites.length)]
        if(handedCards[currCard].worth == 10) {
            handedCards[currCard].name = ["J", "Q", "K", "10"][Math.floor(Math.random()*4)]
        }
        else if(handedCards[currCard].worth == 11 ||handedCards[currCard].worth == 1) {
            handedCards[currCard].name = "A"
        }
        else if (!handedCards[currCard].name) {
            handedCards[currCard].name = handedCards[currCard].worth
        }
        totalWorth = updateWorth()
    }

    function dealerHandCard() {
        currCard = dealerHandedCards.length;
        dealerHandedCards[currCard] = new Object();
        dealerHandedCards[currCard].worth = cards[Math.floor(Math.random()*cards.length)];
        dealerHandedCards[currCard].suite = suites[Math.floor(Math.random()*suites.length)]
        if(dealerHandedCards[currCard].worth == 10) {
            dealerHandedCards[currCard].name = ["J", "Q", "K", "10"][Math.floor(Math.random()*4)]
        }
        else if(dealerHandedCards[currCard].worth == 11 ||dealerHandedCards[currCard].worth == 1) {
            dealerHandedCards[currCard].name = "A"
        }
        else if (!dealerHandedCards[currCard].name) {
            dealerHandedCards[currCard].name = dealerHandedCards[currCard].worth
        }
        dealerTotalWorth = dealerUpdateWorth()
    }
    function convertToText(tembed, collector) {
        let handedCardsText = ""
        handedCards.forEach(card => {
            handedCardsText = handedCardsText + card.suite + card.name + " "
        })
        let dealerHandedCardsText = ""
        dealerHandedCards.forEach(card => {
            dealerHandedCardsText = dealerHandedCardsText + card.suite + card.name + " "
            if(dealerHandedCards.length == 1) dealerHandedCardsText = dealerHandedCardsText += "??"
        })
        if(!collector || collector.ended) {
            tembed.setDescription(`Your hand: ${totalWorth}\nDealer hand: ${dealerTotalWorth}`)
            tembed.addField("Your cards: ", handedCardsText)
            tembed.addField("Dealer cards: ", dealerHandedCardsText)
            return tembed
        } else if(!collector.ended) {
            if(handedCards.length > 2) {
                tembed.setDescription(`Say ` + "`hit`" +` to hit and say ` + "`stand`" + ` to stand.\n\nYour hand: ${totalWorth}\nDealer hand: ${dealerTotalWorth}`)
                tembed.addField("Your cards: ", handedCardsText)
                tembed.addField("Dealer cards: ", dealerHandedCardsText)
                return tembed
            } else {
                tembed.setDescription(`Say ` + "`hit`" +` to hit, say ` + "`stand`" + `to stand and say ` + "`double down`" + ` to double down.\n\nYour hand: ${totalWorth}\nDealer hand: ${dealerTotalWorth}`)
                tembed.addField("Your cards: ", handedCardsText)
                tembed.addField("Dealer cards: ", dealerHandedCardsText)
                return tembed
            }
            
        }
    }

    handCard()
    totalWorth = updateWorth();
    handCard()
    totalWorth = updateWorth();
    dealerHandCard()
    dealerTotalWorth = dealerUpdateWorth();
    const filter = (m) => {
        return (m.content.includes('hit') || m.content.includes('stand') || m.content.includes('double down')) && (m.author.id === message.author.id)
    }
    const collector = message.channel.createMessageCollector(filter, { time: 30000 });

    let embed = new discord.MessageEmbed()
    .setTitle("Play Blackjack!")
    .setColor('4c8639')
    .setFooter("Current bet: " + bet)
    totalWorth = updateWorth();
    if(totalWorth == 21) {
        embed.setTitle("Blackjack!")
    }
    convertToText(embed, collector)

    message.channel.send(embed).then(boardMessage => {
        totalWorth = updateWorth();
        dealerTotalWorth = dealerUpdateWorth();
        if(totalWorth == 21) {
            let earlyEmbed = new discord.MessageEmbed()
            dealerHandCard()
            dealerTotalWorth = dealerUpdateWorth();
            if(dealerTotalWorth == 21) {
                earlyEmbed.setTitle("Push, you have the same hand.\nYou didn't lose or win any nachos.")
                earlyEmbed.setColor("YELLOW")
                collector.stop()
            } else {
                dealerUpdateWorth()
                earlyEmbed.setTitle(`You win <:nacho:848167478453731338>${bet}, Blackjack!`)
                earlyEmbed.setColor("GREEN")
            }
            convertToText(earlyEmbed)
            collector.stop()
            earlyEmbed.setFooter("Current bet: " + bet)
            return boardMessage.edit(earlyEmbed)
        }
        collector.on('collect', m => {
            if(m.content === "hit") {
                let hitEmbed = new discord.MessageEmbed();
                handCard();
                totalWorth = updateWorth();
                if(totalWorth < 21) {
                    if(handedCards.length === 5) {
                        hitEmbed.setTitle(`You win, <:nacho:848167478453731338>${bet*5}, 5 Card Charlie`)
                        hitEmbed.setColor("GREEN")
                        while(dealerTotalWorth < 17) {
                            dealerHandCard();
                            dealerUpdateWorth()
                        }
                        fiveCardCharlie()
                        collector.stop()
                } else    
                    hitEmbed.setTitle("Hit! The game continues.")
                    .setColor('64648c')
                } else
                if(totalWorth > 21) {
                    result = "Bust"
                    hitEmbed.setTitle(`You lose <:nacho:848167478453731338>${bet}, Bust`)
                    hitEmbed.setColor("RED")
                    while(dealerTotalWorth < 17) {
                        dealerHandCard();
                        dealerUpdateWorth()
                    } 
                    collector.stop();
                    lost();
                }
                if(totalWorth == 21) {
                    dealerHandCard()
                    dealerTotalWorth = dealerUpdateWorth();
                    if(dealerTotalWorth == 21) {
                        hitEmbed.setTitle("Push, you have the same hand.\nYou didn't lose or win any nachos.")
                        hitEmbed.setColor("YELLOW")
                        while(dealerTotalWorth < 17) { // Deel kaarten uit aan dealer
                            dealerHandCard();
                            dealerUpdateWorth()
                        }
                        collector.stop()
                    }
                    hitEmbed.setTitle(`You win <:nacho:848167478453731338>${bet}, Blackjack`)
                    hitEmbed.setColor("GREEN")
                    while(dealerTotalWorth < 17) { // Deel kaarten uit aan dealer
                        dealerHandCard();
                        dealerUpdateWorth()
                    }
                    collector.stop();
                    won();
                }
                convertToText(hitEmbed, collector)
                hitEmbed.setFooter("Current bet: " + bet)
                boardMessage.edit(hitEmbed)
            }
            if(m.content === "stand") {
                dealerTotalWorth = dealerUpdateWorth()
                totalWorth = updateWorth();
                while(dealerTotalWorth < 17) {
                    dealerHandCard();
                    dealerUpdateWorth()
                } 
                totalWorth = updateWorth();
                if(dealerTotalWorth >= 17) {
                    let standEmbed = new discord.MessageEmbed();
                    dealerTotalWorth = dealerUpdateWorth()
                    totalWorth = updateWorth();
                    if(dealerTotalWorth > 21) {
                        standEmbed.setTitle(`You win <:nacho:848167478453731338>${bet}, Dealer Bust`)
                        standEmbed.setColor("GREEN")
                        collector.stop()
                        won()
                    } else
                    if(dealerTotalWorth == 21) {
                        standEmbed.setTitle(`You lose <:nacho:848167478453731338>${bet}, Dealer Blackjack`)
                        standEmbed.setColor("RED")
                        collector.stop();
                        lost()
                    } else
                    if(totalWorth < dealerTotalWorth) {
                        standEmbed.setTitle(`You lose <:nacho:848167478453731338>${bet}, Smaller Hand`)
                        standEmbed.setColor("RED")
                        collector.stop()
                        lost()
    
                        } else
                    if(totalWorth > dealerTotalWorth) {
                        standEmbed.setTitle(`You win <:nacho:848167478453731338>${bet}, Better Hand`)
                        standEmbed.setColor("GREEN")
                        collector.stop()
                        won()
    
                    } else
                    if(totalWorth == dealerTotalWorth) {
                        standEmbed.setTitle("Push, you have the same hand.\nYou didn't lose or win any nachos.")
                        standEmbed.setColor("YELLOW")
                        collector.stop()
                    }
                    collector.stop()
                    convertToText(standEmbed, collector)
                    standEmbed.setFooter("Current bet: " + bet)
                    boardMessage.edit(standEmbed)
                }
            }
            if(m.content === "double down") {
                if(handedCards.length > 2) return message.channel.send("You cannot double down after hitting.")
                handCard()
                let doubleDownEmbed = new discord.MessageEmbed();
                dealerTotalWorth = dealerUpdateWorth()
                totalWorth = updateWorth();
                bet *=2;
                if(totalWorth > 21) {
                    doubleDownEmbed.setTitle(`You double down and lose <:nacho:848167478453731338>${bet}, Bust`)
                    doubleDownEmbed.setColor("RED")
                    collector.stop()
                    lost()
                } else
                if(totalWorth == 21) {
                    doubleDownEmbed.setTitle(`You double down and win <:nacho:848167478453731338>${bet}, Blackjack`)
                    doubleDownEmbed.setColor("GREEN")
                    collector.stop()
                    won()
                } else {
                    while(dealerTotalWorth < 17) { // Deel kaarten uit aan dealer
                        dealerHandCard();
                        dealerUpdateWorth()
                    }
                    dealerTotalWorth = dealerUpdateWorth();
                    totalWorth = updateWorth();
                    if(dealerTotalWorth >= 17) { // Als klaar is met uitdelen kaarten dealer
                        //TODO add in code after dealer stands
                        if(dealerTotalWorth > 21) {
                            doubleDownEmbed.setTitle(`You double down and win <:nacho:848167478453731338>${bet}, Dealer Bust`)
                            doubleDownEmbed.setColor("GREEN")
                            collector.stop()
                            won()
                        } else
                        if(dealerTotalWorth == 21) {
                            doubleDownEmbed.setTitle(`You double down and lose <:nacho:848167478453731338>${bet}, Dealer Blackjack`)
                            doubleDownEmbed.setColor("RED")
                            collector.stop();
                            lost()
                        } else
                        if(totalWorth < dealerTotalWorth) {
                            doubleDownEmbed.setTitle(`You double down and lose <:nacho:848167478453731338>${bet}, Smaller Hand`)
                            doubleDownEmbed.setColor("RED")
                            collector.stop()
                            lost()
                            } else
                        if(totalWorth > dealerTotalWorth) {
                            doubleDownEmbed.setTitle(`You double down and win <:nacho:848167478453731338>${bet}, Better Hand`)
                            doubleDownEmbed.setColor("GREEN")
                            collector.stop()
                            won()
                        } else
                        if(totalWorth == dealerTotalWorth) {
                            doubleDownEmbed.setTitle("Push, you have the same hand.\nYou didn't lose or win any nachos.")
                            doubleDownEmbed.setColor("YELLOW")
                            collector.stop()
                            }
                        }
                    }
                while(dealerTotalWorth < 17) {
                    dealerHandCard();
                    dealerUpdateWorth()
                } 
                convertToText(doubleDownEmbed, collector)
                doubleDownEmbed.setFooter("Current bet: " + bet)
                boardMessage.edit(doubleDownEmbed)
            }
        })
    })
    
        collector.on('end', collected => {
            if(totalWorth == 21) return;
            if(collected.size === 0) return message.channel.send("Timed out, no message was collected.")
        });
    
        async function lost() {
            await db.set(message.author.id, Number(db.get(message.author.id)) - bet)
            db.sync()
        }
        async function won() {
            await db.set(message.author.id, Number(db.get(message.author.id)) + bet)
            db.sync()
        }
        async function fiveCardCharlie() {
            let fiveCardWin = bet * 5;
            await db.set(message.author.id, Number(db.get(message.author.id)) + fiveCardWin)
            db.sync()
    }
}
module.exports.help = {
    name: "blackjack",
    aliasses: ["bj"],
    description: "Play blackjack!"
}