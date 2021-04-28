const Discord = require('discord.js');

exports.run = (client, message, args) => {
  
    if(!message.guild) {
        return message.channel.send("Lütfen özel mesajlarda bu komutu kullanamayınız.")
    }
    var metin = args.slice(1).join(" ");
    var baslik = args[0];

    message.channel.bulkDelete(1);

    const embed = new Discord.MessageEmbed()
        .setTitle(baslik)
        .setDescription(metin)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
    message.channel.send(embed)
            
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["article"]
};

exports.help = {
  name: 'yaz',
  description: 'sikimsonik bir kod.',
  usage: '.itiraf'
};