const Discord = require('discord.js');

exports.run = (client, message, args) => {
   
    if(!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) 
    return message.channel.send("Lütfen rol oluşturmam için bana `Rolleri yönet` yetkisini veriniz.")
    let member = message.mentions.members.first();
    if(member.roles.cache.has('835808416113885225')){
        member.roles.remove('835808416113885225').catch(console.error)
        return
    }
  
 if (message.member.roles.cache.has('835408643272343572')) {
   
    message.channel.bulkDelete(1) 
    
    let reason = args.slice(1).join(" ")
    member.roles.add('835808416113885225').catch(console.error)
    
    const embed = new Discord.MessageEmbed()
    .setTitle('Uyarı Sistemi')
    .addField("Uyaran Yetkili: ", message.author)
    .addField("Uyarılan Kişi: ", member)
    .addField("Uyarı Sayısı: ", "<@&835808416113885225>")
    .addField("Sebep: ", reason)
    .setColor(Math.floor(Math.random() * 16777214) + 1)
    client.channels.cache.get('835808703038095362').send(embed)
  }else{
    return message.reply('yetkiniz yok.')
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["uyar", "warn"]
};

exports.help = {
  name: 'uyarı',
  description: 'Etiketlenen kişiyi uyarır.',
  usage: '.uyarı'
};