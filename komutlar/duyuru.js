const Discord = require('discord.js');

exports.run = (client, message, args) => {
   
    if (message.member.roles.cache.has('835408643272343572')) {
    
        if(message.author.bot === true) {
          return;
        }
  
        if(!message.guild) {
          return message.channel.send("Lütfen özel mesajlarda bu komutu kullanamayınız.")
        }
            var metin = args.slice(0).join(" ");

            message.channel.bulkDelete(1);

            client.channels.cache.get('828308390215417916').send("@everyone")

            const embed = new Discord.MessageEmbed()
                .setTitle(':scroll: Duyuru')
                .setDescription(metin)
                .setFooter('ᴇxᴀɴɪᴍᴜs ↯ • Announce System ')
                .setTimestamp()
                .setColor(Math.floor(Math.random() * 16777214) + 1)
            client.channels.cache.get('828308390215417916').send(embed)

        }
    else{
        return message.reply('Yetkiniz yok.')
    }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ann"]
};

exports.help = {
  name: 'duyuru',
  description: 'Sunucuda duyuru yapmanızı sağlar.',
  usage: '.duyuru'
};