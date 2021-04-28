const Discord = require('discord.js');

exports.run = (client, message, args) => {
  
    if(!message.guild) {
        return message.channel.send("Lütfen özel mesajlarda bu komutu kullanamayınız.")
    }
    var metin = args.slice(0).join(" ");

    message.channel.bulkDelete(1);

    const embed = new Discord.MessageEmbed()
        .setTitle(':scroll: İtiraf')
        .setDescription(metin)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
    client.channels.cache.get('826906846614519818').send(embed)

    const itiraflog = new Discord.MessageEmbed()
        .setTitle(':bangbang: **İtiraf Atıldı**')
        .addField('İtirafın Sahibi:', message.author)
        .addField('İtiraf:', metin)
        .setThumbnail('https://i.hizliresim.com/5QFCOh.png')
        .setFooter('ᴇxᴀɴɪᴍᴜs ↯ • Confession System • Shymoix')
        .setTimestamp()
    client.channels.cache.get('835414248141225994').send(itiraflog)
            
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["itf"]
};

exports.help = {
  name: 'itiraf',
  description: 'sikimsonik bir kod.',
  usage: '.itiraf'
};