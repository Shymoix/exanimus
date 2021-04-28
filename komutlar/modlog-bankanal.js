const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async(client, message, args) => {
   
    if(!message.member.roles.cache.has('825549784764383262')){
        const embed = new Discord.MessageEmbed()
            .setColor('#fffa00')
            .setTitle('**HATA**')
            .setDescription('**Bu Komutu Kullanabilmek İçin Yetkili Olman Gerekli!**')
            .setThumbnail('https://i.hizliresim.com/5QFCOh.png')
            .setFooter('ᴇxᴀɴɪᴍᴜs ↯ • Mod Log System • Shymoix')
            .setTimestamp()
        message.channel.send(embed)
        return
    }

    let kanal = message.mentions.channels.first();
    if(!kanal){
        const embed2 = new Discord.MessageEmbed()
            .setColor('#fffa00')
            .setTitle('**HATA**')
            .setDescription('**Mod Log kanalını ayarlamam için bir kanal etiketlemeniz gerekli!**')
            .setThumbnail('https://i.hizliresim.com/5QFCOh.png')
            .setFooter('ᴇxᴀɴɪᴍᴜs ↯ • Mod Log System • Shymoix')
            .setTimestamp()
        message.channel.send(embed2)
        return
    } 
    else {
        await db.set(`banlog_${message.guild.id}`, kanal.id);
        const embed3 = new Discord.MessageEmbed()
        .setColor('#66ff00')
        .setTitle('**GIRIS CIKIS LOG KANALI AYARLANDI!**')
        .setThumbnail('https://i.hizliresim.com/5QFCOh.png')
        .setDescription(`**Giriş-Çıkış Log kanalı başarıyla ${kanal} olarak ayarlandı!**`)
        .setFooter('ᴇxᴀɴɪᴍᴜs ↯ • Mod Log System • Shymoix')
        .setTimestamp()
    message.channel.send(embed3)
    }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["banch"]
};

exports.help = {
  name: 'bankanal',
  description: 'ban log kanal',
  usage: '.bankanal'
};