const Discord = require('discord.js');
const botsettings = require('./botsettings.json');
const scrape = require('website-scraper');
const fs = require('fs')
const path = require('path')

const bot = new Discord.Client({disableEveryone: true});

const embedColour = "#00FF00"

//Remove a directory
const removeDir = function(path) {
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path)
  
      if (files.length > 0) {
        files.forEach(function(filename) {
          if (fs.statSync(path + "/" + filename).isDirectory()) {
            removeDir(path + "/" + filename)
          } else {
            fs.unlinkSync(path + "/" + filename)
          }
        })
        fs.rmdirSync(path)
      } else {
        fs.rmdirSync(path)
      }
    } else {
      console.log("Directory path not found.")
    }
  }

const sleep = function(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

//Login
bot.login(process.env.token)

//Status
bot.on("ready", function() {
    bot.user.setActivity("something I shouldn't be", { type: "WATCHING", url: "https://www.youtube.com/watch?v=HIPQQ4qnl6Q" })
    console.log(`${bot.user.tag} is active`);
});

bot.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;
    let prefix = botsettings.prefix;

    //Auto responder


    //Commands
    if(!message.content.startsWith(prefix)) return;
    
    var args = message.content.slice(prefix.length).split(" ");
    var command = args[0].toLowerCase();

    //Help
    if((command == "help" && args[1] == "1") || (command == "help" && args.length == 1)){
        const embed = new Discord.MessageEmbed()
          .setColor(embedColour)
          .setTitle("DVPN's commands")
          //.setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .addField('ping', 'PONG', true)
            .addField('scrape', 'returns an html file when specified a url')
          .setTimestamp()  
        message.channel.send(embed)
    }

    //Ping
    if(command == "ping") {
        message.channel.send("PONG :ping_pong:");
        message.channel.send('Ping is ***' + `${Date.now() - message.createdTimestamp}` + ' MS***')
    }

    //Scrape
    if(command == "scrape") {
        if(args.length == 1){
            message.channel.send("Incorrect command usage: `-scrape <url>`")
        }
        else{
            let options = {
                urls: [args[1]],
                directory: './scraped-page',
            };
            message.channel.send('Downloading...')
            scrape(options).then((result) => {
                message.channel.send("Website succesfully downloaded.");
                message.channel.send({
                    files: [{
                        attachment: './scraped-page/index.html',
                        name: 'index.html'
                    }]
                })
            }).catch((err) => {
                message.channel.send("An error ocurred", err);
            });
            removeDir('./scraped-page')
        }
    }
});