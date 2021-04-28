const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has('825549784764383262')) return;


    const embed = new Discord.MessageEmbed()
    .setColor('#fffa00')
    .setTitle('**CİNSİYET ROL**')
    .setDescription('**<@&831648757208580188>** *rolünü almak için 🧙‍♂️ emojisine* \n**<@&831648912098983967>** *rolünü almak için 🧙‍♀️ emojisine tıklayın*')
    .setThumbnail('https://cdn.discordapp.com/attachments/725820682835066914/832327684544790528/pp5.gif')
    .setFooter('ᴇxᴀɴɪᴍᴜs ↯ • React Role System • Shymoix')
    .setTimestamp()
    message.channel.send(embed).then(function (message) {
        message.react("🧙‍♂️")
        message.react("🧙‍♀️")
    })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rcin"]
};

exports.help = {
  name: 'rolalcinsiyet',
  description: 'sikimsonik v2',
  usage: '.rolalcinsiyet'
};