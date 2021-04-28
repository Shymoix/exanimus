const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async(client, message, args) => {
    if(!message.member.roles.cache.has('825549784764383262')) return;


    const embed = new Discord.MessageEmbed()
        .setColor('#fffa00')
        .setTitle('**TARZ ROL**')
        .setDescription('**<@&825550001958682634>** *rolünü almak için 🌎 emojisine* \n**<@&825550006114189362>** *rolünü almak için 🎒 emojisine tıklayın*\n**<@&825550014436081704>** *rolünü almak için 👦 emojisine tıklayın*\n**<@&825550018647031868>** *rolünü almak için ☄️ emojisine tıklayın*\n**<@&825550022824296468>** *rolünü almak için 😂 emojisine tıklayın*\n**<@&825550026985177098>** *rolünü almak için 🌃 emojisine tıklayın*\n**<@&825550030878015509>** *rolünü almak için 🔮 emojisine tıklayın*\n**<@&825550035240222730>** *rolünü almak için 💖 emojisine tıklayın*\n**<@&825550039324688454>** *rolünü almak için ☠️ emojisine tıklayın*\n**<@&825550043548876800>** *rolünü almak için 🏀 emojisine tıklayınız.*')
        .setThumbnail('https://cdn.discordapp.com/attachments/725820682835066914/832327684544790528/pp5.gif')
        .setFooter('ᴇxᴀɴɪᴍᴜs ↯ • React Role System • Shymoix')
        .setTimestamp()
    message.channel.send(embed).then(function (message) {
        message.react("🌎")
        message.react("🎒")
        message.react("👦")
        message.react("☄️")
        message.react("😂")
        message.react("🌃")
        message.react("🔮")
        message.react("💖")
        message.react("☠️")
        message.react("🏀")
    })

};

//🌎 🎒 👦 ☄️ 😂 🌃 🔮 💖 ☠️ 🏀

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rtarz"]
};

exports.help = {
  name: 'rolaltarz',
  description: 'sikimsonik kod',
  usage: '.rolaltarz'
};