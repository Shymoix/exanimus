const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async(client, message, args) => {
    if(!message.member.roles.cache.has('825549784764383262')) return;


    const embed = new Discord.MessageEmbed()
        .setColor('#fffa00')
        .setTitle('**ANİME ROL**')
        .setDescription('**<@&825549887382618142>** *rolünü almak için 🔥 emojisine* \n**<@&825549895498465320>** *rolünü almak için ⚔️ emojisine tıklayın*\n**<@&825549920638468117>** *rolünü almak için 👊 emojisine tıklayın*\n**<@&825549924686233631>** *rolünü almak için ❤️ emojisine tıklayın*\n**<@&825549929081470986>** *rolünü almak için 🦊 emojisine tıklayın*\n**<@&825549937186046032>** *rolünü almak için 💚 emojisine tıklayın*\n**<@&825549941110865962>** *rolünü almak için 🏃 emojisine tıklayın*\n**<@&825549975831838800>** *rolünü almak için 👹 emojisine tıklayın*\n**<@&825549971540410380>** *rolünü almak için 🤎 emojisine tıklayın*\n**<@&825549984400801863>** *rolünü almak için ⚡ emojisine tıklayın*\n**<@&825549962607460362>** *rolünü almak için 👻 emojisine tıklayın*')
        .setThumbnail('https://cdn.discordapp.com/attachments/725820682835066914/832327684544790528/pp5.gif')
        .setFooter('ᴇxᴀɴɪᴍᴜs ↯ • React Role System • Shymoix')
        .setTimestamp()
    message.channel.send(embed).then(function (message) {
        message.react("🔥")
        message.react("⚔️")
        message.react("👊")
        message.react("❤️")
        message.react("🦊")
        message.react("💚")
        message.react("🏃")
        message.react("👹")
        message.react("🤎")
        message.react("⚡")
        message.react("👻")
    })
};

//🔥 ⚔️ 👊 ❤️ 🦊 💚  🏃   👹 🤎 ⚡  👻

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ranime"]
};

exports.help = {
  name: 'rolalanime',
  description: 'sikimsonik kod',
  usage: '.rolalanime'
};