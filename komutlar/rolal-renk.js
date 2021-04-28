const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has('825549784764383262')) return;


    const embed = new Discord.MessageEmbed()
    .setColor('#fffa00')
    .setTitle('**RENK ROL**')
    .setDescription('**<@&835808813968785458>** *rolünü almak için 💙 emojisine* \n**<@&835808809196716032>** *rolünü almak için ❤️ emojisine tıklayın* \n**<@&835808811029757962>** *rolünü almak için 💛 emojisine tıklayın*')
    .setThumbnail('https://cdn.discordapp.com/attachments/725820682835066914/832327684544790528/pp5.gif')
    .setFooter('ᴇxᴀɴɪᴍᴜs ↯ • React Role System • Shymoix')
    .setTimestamp()
    message.channel.send(embed).then(function (message) {
        message.react("💙")
        message.react("❤️")
        message.react("💛")
    })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rrenk"]
};

exports.help = {
  name: 'rolalrenk',
  description: 'sikimsonik v2',
  usage: '.rolalrenk'
};