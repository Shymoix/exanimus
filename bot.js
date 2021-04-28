const Discord = require('discord.js');
Discord.Constants.DefaultOptions.ws.properties.$browser = 'Discord Android'
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const Canvas = require("canvas");
const canvacord = require("canvacord");
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const db = require('quick.db');
const fs = require('fs');
const moment = require('moment');
const { white } = require('chalk');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
})

//botun seslide durması

client.on("ready", () => {
  client.channels.cache.get("835816353080016926").join();
})

//level system

client.on('message', async message =>{

  

  if(message.author.bot) return;
  xp(message)
  if(message.content.startsWith(`${prefix}rank`) || message.content.startsWith(`${prefix}level`)){
    var user = message.mentions.users.first() || message.author
    var level = db.get(`guild_${message.guild.id}_level_${user.id}`) || 0
    let xp = db.get(`guild_${message.guild.id}_xp_${user.id}`) || 0
    var xpNeeded = level * 500 + 500
    let every = db
        .all()
        .filter(i => i.ID.startsWith(`guild_${message.guild.id}_xptotal_`))
        .sort((a, b) => b.data - a.data)
    var rank = every.map(x => x.ID).indexOf(`guild_${message.guild.id}_xptotal_${user.id}`) + 1
    const card = new canvacord.Rank()
    .setUsername(user.username)
    .setDiscriminator(user.discriminator)
    .setRank(rank)
    .setLevel(level)
    .setCurrentXP(xp)
    .setRequiredXP(xpNeeded)
    .setStatus(user.presence.status)
    .setAvatar(user.displayAvatarURL({ format: "png", size: 1024 }));

  const img = await card.build();
  
  return message.channel.send(new Discord.MessageAttachment(img, "rank.png"));
  }
})

function xp(message){
  if(message.content.startsWith(prefix)) return;
  let levelch = message.guild.channels.cache.get(db.fetch(`levelch_${message.guild.id}`))
  const randomNumber = Math.floor(Math.random() * 10) + 15
  db.add(`guild_${message.guild.id}_xp_${message.author.id}`, randomNumber)
  db.add(`guild_${message.guild.id}_xptotal_${message.author.id}`, randomNumber)
  var level = db.get(`guild_${message.guild.id}_level_${message.author.id}`)
  var xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`)
  var xpNeeded = level * 500
  if(xpNeeded < xp){
    var newLevel = db.add(`guild_${message.guild.id}_level_${message.author.id}`, 1)
    db.subtract(`guild_${message.guild.id}_xp_${message.author.id}`, xpNeeded)
    levelch.send(`${message.author} level atladın, ${newLevel} level oldun!`)
  }
  let seviye = db.fetch(`guild_${message.guild.id}_level_${message.author.id}`)

  if(seviye === 10){
    message.member.roles.add('825549846110273589').catch(console.error) 
  }else if(seviye === 20){
    message.member.roles.add('825549850090799135').catch(console.error) 
  }else if(seviye === 30){
    message.member.roles.add('825549854453399552').catch(console.error) 
  }else if(seviye === 40){
    message.member.roles.add('825549841987141672').catch(console.error) 
  }

}

//react

client.on('messageReactionAdd', async(reaction, user) =>{
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    if(user.bot) return;
    if(!reaction.message.guild) return;

    let messageid = "835810593876475995";
    let messageidTwo = "835810605759463464";
    let messageidThree = "835810635715182612";
    let messageFourth = "835810649912770561";

    if(reaction.message.id === messageid){
        if(reaction.emoji.name === '🔥'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549887382618142')
        }
        else if(reaction.emoji.name === '⚔️'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549895498465320')
        }
        else if(reaction.emoji.name === '👊'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549920638468117')
        }
        else if(reaction.emoji.name === '❤️'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549924686233631')
        }
        else if(reaction.emoji.name === '🦊'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549929081470986')
        }
        else if(reaction.emoji.name === '💚'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549937186046032')
        }
        else if(reaction.emoji.name === '🏃'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549941110865962')
        }
        else if(reaction.emoji.name === '👹'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549975831838800')
        }
        else if(reaction.emoji.name === '🤎'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549971540410380')
        }
        else if(reaction.emoji.name === '⚡'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549984400801863')
        }
        else if(reaction.emoji.name === '👻'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825549962607460362')
        }
    }

    if(reaction.message.id === messageidTwo){
        if(reaction.emoji.name === '🌎'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550001958682634')
        }
        else if(reaction.emoji.name === '🎒'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550006114189362')
        }
        else if(reaction.emoji.name === '👦'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550009901776927')
        }
        else if(reaction.emoji.name === '☄️'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550009901776927')
        }
        else if(reaction.emoji.name === '😂'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550014436081704')
        }
        else if(reaction.emoji.name === '🌃'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550026985177098')
        }
        else if(reaction.emoji.name === '🔮'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550030878015509')
        }
        else if(reaction.emoji.name === '💖'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550035240222730')
        }
        else if(reaction.emoji.name === '☠️'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550039324688454')
        }
        else if(reaction.emoji.name === '🏀'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('825550043548876800')
        }
    }

    if(reaction.message.id === messageidThree){
        if(reaction.emoji.name === '🧙‍♂️'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('831648757208580188')
        }
        else if(reaction.emoji.name === '🧙‍♀️'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('831648912098983967')
        }
    }

    if(reaction.message.id === messageFourth){
      if(reaction.emoji.name === '💙'){
          await reaction.message.guild.members.cache.get(user.id).roles.add('835808813968785458')
      }
      else if(reaction.emoji.name === '❤️'){
          await reaction.message.guild.members.cache.get(user.id).roles.add('835808809196716032')
      }
      else if(reaction.emoji.name === '💛'){
        await reaction.message.guild.members.cache.get(user.id).roles.add('835808811029757962')
      }
    }

})

client.on('messageReactionRemove', async(reaction, user) =>{
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    if(user.bot) return;
    if(!reaction.message.guild) return;

    let messageid = "835810593876475995";
    let messageidTwo = "835810605759463464";
    let messageidThree = "835810635715182612";
    let messageFourth = "835810649912770561";

    if(reaction.message.id === messageid){
        if(reaction.emoji.name === '🔥'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549887382618142')
        }
        else if(reaction.emoji.name === '⚔️'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549895498465320')
        }
        else if(reaction.emoji.name === '👊'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549920638468117')
        }
        else if(reaction.emoji.name === '❤️'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549924686233631')
        }
        else if(reaction.emoji.name === '🦊'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549929081470986')
        }
        else if(reaction.emoji.name === '💚'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549937186046032')
        }
        else if(reaction.emoji.name === '🏃'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549941110865962')
        }
        else if(reaction.emoji.name === '👹'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549975831838800')
        }
        else if(reaction.emoji.name === '🤎'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549971540410380')
        }
        else if(reaction.emoji.name === '⚡'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549984400801863')
        }
        else if(reaction.emoji.name === '👻'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825549962607460362')
        }
    }

    if(reaction.message.id === messageidTwo){
        if(reaction.emoji.name === '🌎'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550001958682634')
        }
        else if(reaction.emoji.name === '🎒'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550006114189362')
        }
        else if(reaction.emoji.name === '👦'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550009901776927')
        }
        else if(reaction.emoji.name === '☄️'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550009901776927')
        }
        else if(reaction.emoji.name === '😂'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550014436081704')
        }
        else if(reaction.emoji.name === '🌃'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550026985177098')
        }
        else if(reaction.emoji.name === '🔮'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550030878015509')
        }
        else if(reaction.emoji.name === '💖'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550035240222730')
        }
        else if(reaction.emoji.name === '☠️'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550039324688454')
        }
        else if(reaction.emoji.name === '🏀'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('825550043548876800')
        }
    }

    if(reaction.message.id === messageidThree){
        if(reaction.emoji.name === '🧙‍♂️'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('831648757208580188')
        }
        else if(reaction.emoji.name === '🧙‍♀️'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('831648912098983967')
        }
    }

    if(reaction.message.id === messageFourth){
      if(reaction.emoji.name === '💙'){
          await reaction.message.guild.members.cache.get(user.id).roles.remove('835808813968785458')
      }
      else if(reaction.emoji.name === '❤️'){
          await reaction.message.guild.members.cache.get(user.id).roles.remove('835808809196716032')
      }
      else if(reaction.emoji.name === '💛'){
        await reaction.message.guild.members.cache.get(user.id).roles.remove('835808811029757962')
      }
    }

})

//mod log
const botadi = "ᴇxᴀɴɪᴍᴜs ↯"

client.on('guildBanAdd', async (guild, user) => {
  let modlogs = db.get(`modlog_${guild.id}`)
  const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir kişi sunucudan yasaklandı")
    .setThumbnail(user.avatarURL()||user.defaultAvatarURL)
    .addField(`Yasaklanan kişi`, `\`\`\` ${user.tag} \`\`\` `)
    .setFooter(`${botadi} • Mod-Log Sistemi • Shymoix`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});


client.on('guildBanRemove', async (guild, user) => {
  let modlogs = db.get(`modlog_${guild.id}`)
   const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     let embed = new Discord.MessageEmbed()
     .setColor("#fffa00")
     .setAuthor("Bir kişinin yasağı kaldırıldı")
     .setThumbnail(user.avatarURL()||user.defaultAvatarURL)
     .addField(`Yasağı kaldırılan kişi`, `\`\`\` ${user.tag} \`\`\` `)
     .setFooter(`${botadi} • Mod-Log Sistemi • Shymoix`)
     .setTimestamp()
     modlogkanal.send(embed)
   }
 });


 client.on('channelCreate', async channel => {
  let modlogs = db.get(`modlog_${channel.guild.id}`)
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
   const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     if (channel.type === "text") {
       let embed = new Discord.MessageEmbed()
       .setColor("#fffa00")
       .setAuthor("Bir Kanal Oluşturuldu")
       .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
       .addField(`Oluşturulan Kanalın Türü : `, `Yazı`)
       .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
       .setFooter(`${botadi} • Mod-Log Sistemi • Shymoix`)
       .setTimestamp()
       modlogkanal.send(embed)
     }
       if (channel.type === "voice") {
       
         let embed = new Discord.MessageEmbed()
         .setColor("#fffa00")
         .setAuthor("Bir Kanal Oluşturuldu")
         .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
         .addField(`Oluşturulan Kanalın Türü : `, `Ses`)
         .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
         .setFooter(`${botadi} • Mod-Log Sistemi • Shymoix`)
         .setTimestamp()
         modlogkanal.send(embed)
 
 
     }
 }});

 client.on('channelDelete', async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first())
let user = client.users.cache.get(entry.executor.id)
let modlogs = db.get(`modlog_${channel.guild.id}`)
const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
if(!modlogs) return;
if(modlogs) {
if (channel.type === "text") {
let embed = new Discord.MessageEmbed()
.setColor("#fffa00")
.setAuthor("Bir Kanal Silindi")
.addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
.addField(`Silinen Kanalın Türü : `, `Yazı`)
.addField(`Kanalı Silen : `, `<@${user.id}>`)
.setFooter(`${botadi} • Mod-Log Sistemi • Shymoix`)
.setTimestamp()
modlogkanal.send(embed)
}
  if (channel.type === "voice") {

    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir Kanal Silindi")
    .addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
    .addField(`Silinen Kanalın Türü : `, `Ses`)
    .addField(`Kanalı Silen : `, `<@${user.id}>`)
    .setFooter(`${botadi} • Mod-Log Sistemi • Shymoix`)
    .setTimestamp()
    modlogkanal.send(embed)
   }
  }
});

client.on('roleDelete', async role => {
  let modlogs =  db.get(`modlog_${role.guild.id}`)
   let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first())
   let user = client.users.cache.get(entry.executor.id)
  const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     let embed = new Discord.MessageEmbed()
     .setColor("#fffa00")
     .setAuthor("Bir Rol Silindi")
     .addField(`Silinen Rolün İsmi : `, `${role.name}`)
     .addField(`Rolü Silen : `, `<@${user.id}>`)
     .setFooter(`${botadi} • Mod-Log Sistemi • Shymoix`)
     .setTimestamp()
     modlogkanal.send(embed)
   }
 });
 
 client.on('emojiDelete', async emoji => {
  let modlogs = db.get(`modlog_${emoji.guild.id}`)
  let entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
   const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     let embed = new Discord.MessageEmbed()
     .setColor("#fffa00")
     .setAuthor("Bir Emoji Silindi")
     .addField(`Silinen Emojinin İsmi : `, `${emoji.name}`)
     .addField(`Emojiyi Silen : `, `<@${user.id}>`)
     .setFooter(`${botadi} • Mod-Log Sistemi • Shymoix`)
     .setTimestamp()
     modlogkanal.send(embed)
   }
 });
  

 client.on('roleCreate', async role => {
  let modlogs =  db.get(`modlog_${role.guild.id}`)
  let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
    const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
    if(!modlogs) return;
    if(modlogs) {
      let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Rol Oluşturuldu")
      .addField(`Oluşturulan Rolün İsmi : `, `${role.name}`)
      .addField(`Rolü Oluşturan : `, `<@${user.id}>`)
      .setFooter(`${botadi} • Mod-Log System • Shymoix`)
      .setTimestamp()
      modlogkanal.send(embed)
    }
  });
  
  
  client.on('emojiCreate', async emoji => {
   let modlogs = db.get(`modlog_${emoji.guild.id}`)
   let entry = await role.guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first())
   let user = client.users.cache.get(entry.executor.id)
    const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
    if(!modlogs) return;
    if(modlogs) {
      let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Emoji Oluşturuldu")
      .addField(`Oluşturulan Emojinin İsmi : `, `${emoji.name}`)
      .addField(`Emoji Silen : `, `<@${user.id}>`)
      .setFooter(`${botadi} • Mod-Log System • Shymoix`)
      .setTimestamp()
      modlogkanal.send(embed)
    }
  });

//MESAJ LOG
client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.channel.type === "dm") return;
  if (newMessage.content.startsWith(prefix)) return;
  let sc = await db.fetch(`msjlog_${newMessage.guild.id}`);
  let scbul = newMessage.guild.channels.cache.get(sc)
  if(!scbul) {
    
  }
  if (oldMessage.content == newMessage.content) return;
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL())
    .addField("Kullanıcı", newMessage.author)
    .addField("Eski Mesaj", "```" + oldMessage.content + "```")
    .addField("Yeni Mesaj", "```" + newMessage.content + "```")
    .addField("Kanal Adı", newMessage.channel.name)
    .addField("Mesaj ID", newMessage.id)
    .addField("Kullanıcı ID", newMessage.author.id)
    .setFooter(`${botadi} • Mesaj Log System • Shymoix • bügün saat ${newMessage.createdAt.getHours()}:${newMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});

client.on("messageDelete", async deletedMessage => {
  if (deletedMessage.channel.type === "dm") return;
  if (deletedMessage.content.startsWith(prefix)) return;
  let sc = await db.fetch(`msjlog_${deletedMessage.guild.id}`);
  let scbul = deletedMessage.guild.channels.cache.get(sc)
  if(!scbul) {
    
  }
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Silindi`, deletedMessage.author.avatarURL())
    .addField("Kullanıcı", deletedMessage.author)
    .addField("Silinen Mesaj", "```" + deletedMessage.content + "```")
    .addField("Kanal Adı", deletedMessage.channel.name)
    .addField("Mesaj ID", deletedMessage.id)
    .addField("Kullanıcı ID", deletedMessage.author.id)
    .setFooter(`${botadi} • Mesaj Log System  • Shymoix • bügün saat ${deletedMessage.createdAt.getHours()}:${deletedMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});

client.on("guildMemberAdd", async member => {
   
    var gckanal = member.guild.channels.cache.get(db.fetch(`gclog_${member.guild.id}`))
    
    let embed = new Discord.MessageEmbed()
       .setColor("GREEN")
       .setAuthor('Sunucuya Yeni Birisi Geldi!', member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
       .addField('Sunucuya gelen kişi:', member)
       .setFooter(`${botadi} • Mod-Log System`)
       .setTimestamp()
    gckanal.send(embed);
   
   
   });
   
   client.on("guildMemberRemove", async member => {
   
     var gckanal = member.guild.channels.cache.get(db.fetch(`gclog_${member.guild.id}`))
    
    let embed = new Discord.MessageEmbed()
       .setColor("RED")
       .setAuthor('Sunucudan Birisi Çıkışı!', member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
       .addField('Sunucudan Ayrılan Kişi:', member)
       .setFooter(`${botadi} • Mod-Log System`)
       .setTimestamp()
    gckanal.send(embed);
   
   })


client.login(ayarlar.token);
