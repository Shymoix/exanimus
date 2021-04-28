const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async(client, message, args) => {

    if (!message.member.roles.cache.has('835408643272343572')) {
        return message.reply('Yetkiniz Yok.')
    }
   
   let bankisi = message.mentions.members.first();
   let banlayan = message.author;
   
   if(bankisi.id === '292341554343837696'){
    return message.channel.send('Onu banlamaya benim bile gücüm yetmez ya')
  }
  if(banlayan.id === '292341554343837696' || banlayan.id === '610520055905648640'){
     message.guild.member(bankisi).ban()
     message.channel.send({files: ["https://cdn.discordapp.com/attachments/832311269859000370/832313375982878780/tenor.gif"]})
     return
   }
   if(bankisi.roles.cache.has('835408643272343572')){
      return message.channel.send('Bu insancıkları banyalayamam.')
   }
    message.guild.member(bankisi).ban()
    message.channel.send({files: ["https://cdn.discordapp.com/attachments/832311269859000370/832313375982878780/tenor.gif"]})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["yasakla"]
};

exports.help = {
  name: 'ban',
  description: 'sikimsonik v2',
  usage: '.ban'
};