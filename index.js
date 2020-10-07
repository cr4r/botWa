const fs = require("fs"); 
const moment = require("moment");
const qrcode = require("qrcode-terminal"); 
const { Client, MessageMedia } = require("whatsapp-web.js"); 
const fetch = require("node-fetch"); 
const puppeteer = require("puppeteer"); 
const cheerio = require("cheerio");
const SESSION_FILE_PATH = "./session.json";
const request = require("request");
const urlencode = require("urlencode");
const yts = require("./lib/cmd.js");
const exec = require('child_process').exec;
var urlll = require('url');


var recentcmd = new Set();	
var fspamm=new Set();	
var sban= new Set();	
var stickerspam=new Set();	
var stp=new Set();	
var loaded=0;	
var counter=0;

// file is included here
let sessionCfg;


if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}
client = new Client({	  
    
	     puppeteer: {
        executablePath: '/usr/bin/google-chrome',
        headless: true,
		args: [
      "--log-level=3", // fatal only
   
      "--no-default-browser-check",
      "--disable-infobars",
      "--disable-web-security",
      "--disable-site-isolation-trials",
      "--no-experiments",
      "--ignore-gpu-blacklist",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
    
      "--disable-extensions",
      "--disable-default-apps",
      "--enable-features=NetworkService",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    
      "--no-first-run",
      "--no-zygote"
    ]
		
    },	      
    session: sessionCfg
});

client.initialize();

// ======================= Begin initialize WAbot

client.on("qr", qr => {
  // NOTE: This event will not be fired if a session is specified.
  qrcode.generate(qr, {
    small: true
  });
  console.log(`[ ${moment().format("HH:mm:ss")} ] Scan QR Code di whatsapp!`);
});

client.on("authenticated", session => {
  console.log(`[ ${moment().format("HH:mm:ss")} ] Login Sukses!`);
  // console.log(session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", msg => {
  // Fired if session restore was unsuccessfull
  console.log(
    `[ ${moment().format("HH:mm:ss")} ] Login Gagal \n ${msg}`
  );
  fs.unlink("./session.json", function(err) {
    if (err) return console.log(err);
    console.log(
      `[ ${moment().format("HH:mm:ss")} ] Sesi di hapus, silahkan jalankan ulang!`
    );
    process.exit(1);
  });
});

client.on("ready", () => {
  console.log(`[ ${moment().format("HH:mm:ss")} ] Whatsapp bot sudah siap!`);
});

// ======================= Begin initialize mqtt broker


// ======================= WaBot Listen on Event

client.on("message_create", msg => {
  // Fired on all message creations, including your own
  if (msg.fromMe) {
    // do stuff here
  }
});

client.on("message_revoke_everyone", async (after, before) => {
  // Fired whenever a message is deleted by anyone (including you)
  // console.log(after); // message after it was deleted.
  if (before) {
    console.log(before.body); // message before it was deleted.
  }
});

client.on("message_revoke_me", async msg => {
  // Fired whenever a message is only deleted in your own view.
  // console.log(msg.body); // message before it was deleted.
});

client.on("message_ack", (msg, ack) => {
  /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

  if (ack == 3) {
    // The message was read
  }
});


client.on("group_update", notification => {
  // Group picture, subject or description has been updated.
  console.log("update", notification);
});

client.on("disconnected", reason => {
  console.log("Client was logged out", reason);
});

// ======================= WaBot Listen on message

client.on("message", async msg => {
	// console.log('MESSAGE RECEIVED', msg);
    const chat = await msg.getChat();
    const users = await msg.getContact()
    const dariGC = msg['author']
    const dariPC = msg['from']
    const misi = ['6282237416678']
    var aq = msg.from.replace("@c.us", "").split('-')

	  console.log(
      `[ ${moment().format("HH:mm:ss")} ] Message:`,
      msg.from.replace("@c.us", ""),
      `| ${msg.type}`,
      msg.body ? `| ${msg.body}` : ""
    );
const botTol = () => {
        msg.reply('[!] Maaf, fitur ini hanya orang tertentu yang bisa gunakan ini.')
        return
    }
    const botTol2 = () => {
        msg.reply(`[!] Maaf, fitur ini hanya untuk 'Group Chat'.`)
        return
    }

    if (msg.body.startsWith('judul ')) {
        if (chat.isGroup) {
            if (misi.includes(aq[0]) || aq[0] === chat.owner.user) {
                let title = msg.body.slice(8)
                chat.setSubject(title)
            } else {
                botTol()
            }
        } else {
            botTol2()
        }
    }
    
    else if (msg.body == 'info grub') {
      //let chat = await msg.getChat()
      if (chat.isGroup) {
        msg.reply(`
          *Group Details*
Name : ${chat.name}
Deskripsi : ${chat.description}

Dibuat pada : ${chat.createdAt.toString()}
Dibuat oleh : ${chat.owner.user}
Member : ${chat.participants.length}`)
      } else {
        msg.reply('Perintah ini hanya bisa di pakai di grup!')
      }
    }

    else if (msg.body == "p"||msg.body == "hai"||msg.body == "hi"||msg.body == "hello"||msg.body == "hay"||msg.body == "kak"||msg.body == "ini bot"||msg.body == "ini bot?") {
      var sapa = ['hai','hello','hai kak','siapa?','ada apa','ya?','ada apa ya?','y','ya','ada apa kak','ya ada apa','ada yang bisa saya bantu?','hmm','oh yes','oh no']
      var pp = sapa[Math.floor(Math.random() * sapa.length)];
      msg.reply(pp)
    }

    else if (msg.body == "assalamualaikum") {
      msg.reply(`Walaikumsalam`)
    }

    else if (msg.body === 'member') {
      if (chat.isGroup) {
        if (misi.includes(aq[0]) === true || aq[0] === chat.owner.user) {
          const chat = await msg.getChat();
          let text = "";
          let mentions = [];

          for(let participant of chat.participants) {
              const contact = await client.getContactById(participant.id._serialized);

              mentions.push(contact);
              text += "Hai ";
                    text += `@${participant.id.user} `;
              text += "apa kabar :)\n";
          }

          chat.sendMessage(text, { mentions });
        } else {
          botTol()
          }
      } else {
          botTol2()
      }
    } else if (msg.body.startsWith('semua ')) {
      if (chat.isGroup) {
        if (misi.includes(aq[0]) === true || aq[0] === chat.owner.user) {
          const chat = await msg.getChat();
          let tes = msg.body.split("semua ")[1]
          let text = "";
          let mentions = [];

          for(let participant of chat.participants) {
              const contact = await client.getContactById(participant.id._serialized);

              mentions.push(contact);
              text += "Hai ";
              text += `@${participant.id.user} `;
              text += `${tes}\n`;
          }

          chat.sendMessage(text, { mentions });
        }
        else {
          botTol()
        }
      }
      else {
        botTol2()
      }
    }
    
    else if (msg.body.startsWith('deskripsi ')) {
        if (chat.isGroup) {
            if (misi.includes(aq[0]) === true || aq[0] === chat.owner.user ) {
                let title = msg.body.split("deskripsi ")[1]
                chat.setDescription(title)
            } else {
                botTol()
            }
        } else {
            botTol2()
        }
    } else if (msg.body.startsWith('promote ')) {
        if (chat.isGroup) {
            if (misi.includes(aq[0]) === true || aq[0] === chat.owner.user) {
                const contact = await msg.getContact();
                const title = msg.mentionedIds[0]
                chat.promoteParticipants([`${title}`])
            } else {
                botTol()
            }
        } else {
            botTol2()
        }
    } else if (msg.body.startsWith('demote ')) {
        if (chat.isGroup) {
            if (misi.includes(aq[0]) === true || aq[0] === chat.owner.user) {
                let title = msg.mentionedIds[0]
                chat.demoteParticipants([`${title}`])
            } else {
                botTol()
            }
        } else {
            botTol2()
        }
    } else if (msg.body.startsWith('add ')) {
        if (chat.isGroup) {
            if (misi.includes(aq[0]) === true || aq[0] === chat.owner.user) {
                let title = msg.body.slice(4)
                if (title.indexOf('62') == -1) {
                    chat.addParticipants([`${title.replace('0', '62')}@c.us`])
                    msg.reply(`[:] Selamat datang @${title}! jangan lupa baca Deskripsi group yah 😎👊`)
                } else if (title.indexOf('62') != -1) {
		    chat.addParticipants([`${title}@c.us`])
                    msg.reply(`[:] Selamat datang @${title}! jangan lupa baca Deskripsi group yah 😎👊`)}
		else {
                    msg.reply('[:] Format nomor harus 0821xxxxxx')
                }
            } else {
                botTol()
            }
        } else {
            botTol2()
        }
    } else if (msg.body.startsWith('kick ')) {
        if (chat.isGroup) {
            if (misi.includes(aq[0]) === true || aq[0] === chat.owner.user) {
                let title = msg.mentionedIds
                chat.removeParticipants([...title])
                console.log([...title]);
            } else {
                botTol()
            }
        } else {
            botTol2()
        }
    } else if (msg.body == 'owner') {
        if (chat.isGroup) {
            msg.reply('Pemilik grub @'+chat.owner.user)
        } else {
            botTol2()
        }
    } 


  else if (msg.body == "!menu") {
 client.sendMessage(msg.from,  `
╭───「 *List Menu*
├≽️ tool web
├≽️ info grub
├≽️ Pesan = kirim pesan lewat bot
├≽️ !menu1 = Fun Menu 🌞
├≽️ !menu2 = Downloader Menu🎞
├≽️ !menu3 = Horoscope Menu 🎇
╰─────────
`);
}

// tool Menu 
else if (msg.body == "tool web") {
  client.sendMessage(msg.from,  `╭───「 Tool Website 」
├≽️ *wget link* = mendownload file dari link
├≽️ *nmap website.com* = Tes sebuah ip dalam jaringan
╰──────────────────`);
  }
 

// Admin Menu 
else if (msg.body == "!admin") {
 client.sendMessage(msg.from,  `
 ╭───「 Owner Only 」
 ├≽️ subject <optional> = Untuk mengganti nama group!
 ├≽️ kick @tag = Kick member group!
 ├≽️ promote @tag = Menaikkan pangkat member!
 ├≽️ demote @tag = Menurunkan pangkat admin!
 ├≽️ add 0858xxxxx = Menambahkan member group!
 ├≽️ desk optional = Ganti deskripsi group!
 ├≽️ owner = Melihat siapa owner group!
 ╰─────────

 `);
 }
 
// Pesan
else if (msg.body == "pesan"||msg.body == "Pesan") {
  client.sendMessage(msg.from,  `
  
╭───「 *Welcome To Pesan Whatsapp*」
├≽️ *kirim nomor/tag Pesan kamu* : Mengirim pesan ke tujuan
├≽️ *Contoh :* kirim 62822xxxxxx Hay kenalan dong
├≽️ *Contoh :* kirim @tagOrangdiGrub Hay kenalan dong
├≽️ ────────────────────────────
├≽️ *spam limit nomor/tag Pesan kamu* : Spam pesan ke tujuan
├≽️ *Contoh :* spam 10 62822xxxxx hay beb
├≽️ *Contoh :* spam 10 @TagOrangDiGrub hay beb
├≽️ *!translate katamu kodeNegara: mentranslate sebuah kata
├≽️ *join linkGrub* : Masuk ke sebuah grub whatsapp
╰──────────────────────────────
 `);
  }

 // Menu 1
 else if (msg.body == "!menu1") {
 client.sendMessage(msg.from,  `
 
 ╭───「 *Welcome To Fun Menu* 」
 ├≽️ *random anime* = untuk melihat gambar anime secara random
 ├≽️ ───────────────────
 ├≽️ *quotes* : Melihat quotes dari tokoh terkenal
 ├≽️ ───────────────────
 ├≽️ *kata cinta* : Kata kata cinta
 ├≽️ ───────────────────
 ├≽️ *!play nama lagu*
 ├≽️ contoh: *!play whatever it takes*
 ├≽️ ───────────────────
 ├≽️ *tts teks* : mengubah teks menjadi suara
 ├≽️ ───────────────────
 ├≽️ *!wait* : Menampilkan informasi anime dengan mengirim gambar dengan caption !wait
 ├≽️ ───────────────────
 ├≽️ *!ptl1* : Menampilkan gambar gambar cewek cantik 🤩
 ├≽️ ───────────────────
 ├≽️ *!ptl2* : Menampilkan gambar gambar cowok ganteng 😎
 ├≽️ ───────────────────
 ├≽️ *!chord nama lagu* : Menampilkan Chord Gitar
 ├≽️ 
 ├≽️ *!carifoto kata kunci* : Cari gambar berdasarkat kata
 ├≽️ contoh ( _*!sesrchimage kata bijak*_ )
 ╰─────────────────────`);
 }
else if (msg.body == "!menu2") {
 client.sendMessage(msg.from,  `
 
 ╭───「 *Welcome To Downloader Menu* 」
 ├≽️ *!ytmp3 url* : Mendownload mp3 dari youtube
 ├≽️ contoh : !ytmp3 https://youtu.be/xUVz4nRmxn4
 ├≽️ ───────────────────────────
 ├≽️ *!fb url* : Mendownload video dari facebook
 ├≽️ contoh : !fb url
 ├≽️ ───────────────────────────
 ├≽️ *!ig url* : Mendownload media foto/video dari instagram
 ├≽️ contoh : !ig url
 ├≽️ ───────────────────────────
 ├≽️ *!pin url* : Mendownload video dari pinterest
 ├≽️ contoh : !pin url
 ╰──────────────────────────────`);
}
else if (msg.body == "!menu3") {
  client.sendMessage (msg.from, `
 ╭───「 Menu Kegabutan 」
 ├≽️ *!nama* : Melihat arti dari nama kamu
 ├≽️  contoh : !nama Bondan
 ├≽️ 
 ├≽️ *!pasangan* : Check kecocokan jodoh
 ├≽️  contoh : !pasangan Dimas & Dinda
 ╰───────────────────────────`);
}	

  else if (msg.type=='sticker'){	
    if(!(msg.fromMe)){ 	
      const ur=msg.from;	
      if(msg.author!="undefined"){	
      const ur=msg.author;	
      }	
      let chat = await msg.getChat();	
      let info = client.info;	
      let aq = chat.participants.filter(x => x.id.user ==  info.me.user);	
      var contact = await msg.getContact();	
      if(chat.isGroup){	
        if(aq[0].isAdmin){	
          if(stickerspam.has(ur) && !(stp.has(ur))){	
            stp.add(ur);	
            msg.reply('You are spamming stickers! :]');	

            if(contact.number == chat.owner.user){	
                msg.reply("Owner cannot be removed!");	
            }else{	
                setTimeout(()=>{	
                chat.removeParticipants([contact.id._serialized]);},1000);}	
          }
        }
      }
      stickerspam.add(ur);	
      setTimeout(() =>{	
        stickerspam.delete(ur);	
        stp.delete(ur);	
      },400);	
    }
    else{
      msg.reply('gtw apa ini')
    }
  }


else if (msg.body.startsWith("translate ")) {
  const translatte = require('translatte');
  var codelang = msg.body.split("[")[1].split("]")[0];
  var text = msg.body.split(" ")[1];
  translatte(text, {to: codelang}).then(res => {
      msg.reply(res.text);
    }).catch(err => {
        msg.reply(err);
  });
}

else if (msg.body.startsWith('join ')) {
  const inviteCode = msg.body.split(' ')[1].replace('https://chat.whatsapp.com/', '')
  if (msg.body.split(' ')[1].match(/(https:)/gi)) {
    try {
        await client.acceptInvite(inviteCode);
        msg.reply('Otw join gan');
    } catch (e) {
        msg.reply('Sepertinya link grup bermasalah');
      }
    }
  else {
    msg.reply('Ini link? 👊🤬')
  }
}

else if (msg.body == "#codebahasa") {
  msg.reply(`
Bahasa                Code
######               #####
English         |  en
Esperanto       |  eo
Estonian        |  et
Finnish         |  fi
French          |  fr
Frisian         |  fy
Galician        |  gl
Georgian        |  ka
German          |  de
Greek           |  el
Gujarati        |  gu
Haitian Creole  |  ht
Hausa           |  ha
Hawaiian        |  haw (ISO-639-2)
Hebrew          |  he or iw
Hindi           |  hi
Hmong           |  hmn (ISO-639-2)
Hungarian       |  hu
Icelandic       |  is
Igbo            |  ig
Indonesian      |  id
Irish           |  ga
Italian         |  it
Japanese        |  ja
Javanese        |  jv
Kannada         |  kn
Kazakh          |  kk
Khmer           |  km
Kinyarwanda     |  rw
Korean          |  ko
Kurdish         |  ku
Kyrgyz          |  ky
Lao             |  lo
Latin           |  la
Latvian         |  lv
Lithuanian      |  lt
Luxembourg      |  lb
Macedonian      |  mk
Malagasy        |  mg
Malay           |  ms
Malayalam       |  ml
Maltese         |  mt
Maori           |  mi
Marathi         |  mr
Myanmar.        |  my
Nepali          |  ne
Norwegian       |  no
Nyanja.         |  ny
Odia (Oriya)    |  or
Pashto          |  ps
Persian         |  fa
Polish          |  pl
Portuguese.     |  pt
Punjabi         |  pa
Romanian        |  ro
Russian         |  ru
Samoan          |  sm
Scots Gaelic    |  gd
Serbian         |  sr
Sesotho         |  st
Shona           |  sn
Sindhi          |  sd
Slovak          |  sk
Slovenian       |  sl
Somali          |  so
Spanish         |  es
Sundanese       |  su
Swahili         |  sw
Swedish         |  sv
Tagalog.        |  tl
Tajik           |  tg
Tamil           |  ta
Tatar           |  tt
Telugu          |  te
Thai            |  th
Turkish         |  tr
Turkmen         |  tk
Ukrainian       |  uk
Urdu            |  ur
Uyghur          |  ug
Uzbek           |  uz
Vietnamese      |  vi
Welsh           |  cy
Xhosa           |  xh
Yiddish         |  yi
Yoruba          |  yo
Zulu            |  zu` );
} 

else if (msg.body.startsWith("!brainly ")) {
  function BrainlySearch(pertanyaan, amount,cb){
        brainly(pertanyaan.toString(),Number(amount)).then(res => {

          let brainlyResult=[];

          res.forEach(ask=>{
              let opt={
                pertanyaan:ask.pertanyaan,
                fotoPertanyaan:ask.questionMedia,
              }
              ask.jawaban.forEach(answer=>{
                opt.jawaban={
                  judulJawaban:answer.text,
                  fotoJawaban:answer.media
              }
            })
              brainlyResult.push(opt)
          })

          return brainlyResult

      }).then(x=>{
          cb(x)

      }).catch(err=>{
          console.log(`${err}`.error)
      })
  }
  const brainly = require('brainly-scraper')
  var mes = msg.body.split('!brainly ')[1]
  let tanya = mes.split(/\s/)
  let jum = Number(tanya[tanya.length-1].split('-')[1]) || 2
  if(Number(tanya[tanya.length-1])){
      tanya.pop()
  }
  let quest = tanya.join(' ')
  msg.reply(`*Pertanyaan : ${quest}*\n*Jumlah jawaban : ${Number(jum)}*`)

  BrainlySearch(quest,Number(jum), function(res){
    console.log(res)
    res.forEach(x=>{
      msg.reply(`*foto pertanyaan*\n${x.fotoPertanyaan.join('\n')}\n*pertanyaan :*\n${x.pertanyaan}\n\n*jawaban :*\n${x.jawaban.judulJawaban}\n*foto jawaban*\n${x.jawaban.fotoJawaban.join('\n')}`)
    })
  })
} 

else if (msg.body.startsWith("wget ")) {
  var pesan = msg.body.split(" ")[1];
  var namaFile = urlll.parse(pesan).pathname.split('/').pop();
  function os_func() {
    this.execCommand = function (cmd) {
        return new Promise((resolve, reject)=> {
           exec(cmd, (error, stdout, stderr) => {
             if (error) {
                reject(error);
                return;
            }
            resolve(stdout)
           });
       })
    }
  }
  var os = new os_func();
  os.execCommand('wget -O wget/'+ namaFile + ' ' + pesan).then(res=> {
      var media = MessageMedia.fromFilePath('wget/'+ namaFile);
  chat.sendMessage(media);
  
  }).catch(err=> {
      console.log("os >>>", err);
      msg.reply(err)
  })
}

else if (msg.body.startsWith("nmap ")) {
  var pesan = msg.body.split(" ")[1];
  exec(`nmap ${pesan}`, (error, stdout) => {
    if (error) {
      msg.reply(`ERROR => ${error.message}`);
    }
    else{
      msg.reply(`${stdout}`)
    }
  });
}

else if (msg.body.startsWith("kirim ")) {
  var number = msg.body.split(" ")[1];
  // Direct send a new message to specific id
  if (number.substring(0,1) == '@')
    var number = number.replace("@c.us", "").replace("@", "");
  else{
    var number = msg.body.split(" ")[1]
  }
    console.log(number)
    let messageIndex = msg.body.indexOf(number) + number.length;
    let message = msg.body.slice(messageIndex, msg.body.length);
    number = number.includes("@c.us") ? number : `${number}@c.us`;
    let chat = await msg.getChat();
    chat.sendSeen();
    client.sendMessage(number, '───「 ini bot CR4R 」───\n\nPesan:\n'+message+'\n\ndari :'+aq[0]);
}

else if (msg.body.startsWith("spam ")) {
  var limit = msg.body.split(" ")[1];
  var number = msg.body.split(" ")[2];
  let messageIndex = msg.body.indexOf(number) + number.length;
  let message = msg.body.slice(messageIndex, msg.body.length);
  // Direct send a new message to specific id
  if (number.substring(0,1) == '@')
    var number = number.replace("@c.us", "").replace("@", "");
  else{
    var number = msg.body.split(" ")[2]
  }
  number = number.includes("@c.us") ? number : `${number}@c.us`;
  let chat = await msg.getChat();
  console.log(misi.includes(aq[0]))
  console.log(misi)
  let info = client.info;	
  console.log(chat.participants.filter(x => x.id.user ==  info.me.user))
  console.log(number)
  console.log(message)
  if(misi.includes(aq[0]) == true){
    for(i=0;i<limit;i++){
      chat.sendSeen();
      client.sendMessage(number, '───「 ini bot CR4R 」───\n\nPesan:\n'+message);
    }  
  }
  else if(limit <=20){
    for(i=0;i<limit;i++){
      chat.sendSeen();
      client.sendMessage(number, message);
    }
  }
  else if (limit>=501){
    msg.reply(`dah lah, lu dah stress`)
  }
  else if (limit<=500){
    msg.reply(`jangan stress yak`)
  }
  else if (limit<=100){
    msg.reply(`sini aku suntik covid dulu`)
  }  else if (limit>=21){
    msg.reply(`Maaf jangan berlebihan :( limit 20 pesan)`)
  }
  else{
    msg.reply(`Bot nya error :( tanggung jawab lo)`)
  }
}



// Download Feature
else if (msg.body.startsWith("!ytmp3 ")) {
var url = msg.body.split(" ")[1];
var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

const ytdl = require("ytdl-core")
const { exec } = require("child_process");
if(videoid != null) {
   console.log("video id = ",videoid[1]);
} else {
    msg.reply("Videonya gavalid gan.");
}
ytdl.getInfo(videoid[1]).then(info => {
if (info.length_seconds > 999999){
msg.reply("terlalu panjang.. ")
}else{

console.log(info.length_seconds)

msg.reply(" Tunggu sebentar kak .. Lagi di proses ☺");
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "ffmpeg", 
    "outputPath": "./mp3",    // Where should the downloaded and en>
    "youtubeVideoQuality": "highest",       // What video quality sho>
    "queueParallelism": 100,                  // How many parallel down>
    "progressTimeout": 40                 // How long should be the>
});

YD.download(videoid[1]);


YD.on("finished", function(err, data) {


var musik = MessageMedia.fromFilePath(data.file);

msg.reply(` 
 
    Mp3 Berhasil di download
   
  ----------------------------------

Nama : *${data.title}*
Artis : *${data.artist}*

   ----------------------------------
👾                            👾
  _Ytmp3 WhatsApp By cr4r BOT_
`);
chat.sendMessage(musik);
});
YD.on("error", function(error) {
    console.log(error);
    msg.reply(`Error gan`)
});

}});
}

// Youtube Play 
  else if (msg.body.startsWith("!play ")) {
try{
var ytdl = require("ytdl-core");
var hh = msg.body.split("!play ")[1];
var keyword = hh.replace(/ /g, "+");
function foreach(arr, func){
  for(var i in arr){
    func(i, arr[i]);
  }
}
//////////Calling Async Function//////////
const id= "";

(async () => {
var id = await yts.searchYoutube(keyword);
let result ="";

var teks = ` 
New Request Song 

Title 
${result} `;
console.log( "New Request Play Song " +id[0])
 
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "ffmpeg", 
    "outputPath": "./mp3",    // Where should the downloaded and en>
    "youtubeVideoQuality": "highest",       // What video quality sho>
    "queueParallelism": 100,                  // How many parallel down>
    "progressTimeout": 2000                 // How long should be the>
});

//Download video and save as MP3 file
YD.download(id[0]);

YD.on("finished", function(err, data) {


const musik = MessageMedia.fromFilePath(data.file);
var ehe = ` 
 

 🎶 Now Playing 🎶

🔉  *${data.videoTitle}* 

Youtube Play Songs By cr4r :)
`;
let media = MessageMedia.fromFilePath('./zerotwo.jpg');
	client.sendMessage(msg.from, media, {
	caption: ehe });
	chat.sendMessage(musik);
});
YD.on("progress", function(data) {
});
})();
}
catch (err){
  msg.reply('botnya error, jangan gak ada akhlak ya')
}
  }

// Facebook Downloaderelse if (msg.body.startsWith("!fb ")) {
	else if (msg.body.startsWith("!fb ")) {
var teks = msg.body.split("!fb ")[1];
const { exec } = require("child_process");
var url = "http://api.fdci.se/sosmed/fb.php?url="+ teks;

request.get({
  headers: {'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'},
  url:     url,
},function(error, response, body){
    let $ = cheerio.load(body);
  var b = JSON.parse(body);

 var teks = `
 Berhasil Mendownload 
 
 Judul = ${b.judul}
 
 Facebook Downloader By cr4r (*´∇｀*)
 `;
 
exec('wget "' + b.link + '" -O mp4/fbvid.mp4', (error, stdout, stderr) => {
  let media = MessageMedia.fromFilePath('mp4/fbvid.mp4');
	client.sendMessage(msg.from, media, {
	caption: teks });
	if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});

});
}

// random fakta unik
// pajaar - 2020
else if (msg.body == "!fakta") {
const fetch = require("node-fetch"); 
fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-fakta-unik.txt')
    .then(res => res.text())
    .then(body => {
	let tod = body.split("\n");
	let pjr = tod[Math.floor(Math.random() * tod.length)];
	msg.reply(pjr);
	});
}

else if (msg.body.startsWith("!yt ")) {
  const url = msg.body.split(" ")[1];
  
  var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
  
  const ytdl = require("ytdl-core")
  if(videoid != null) {
     console.log("video id = ",videoid[1]);
  } else {
      msg.reply("Videonya gavalid gan.");
  }
  msg.reply(" Tunggu sebentar kak .. Lagi di proses ☺");
  ytdl.getInfo(videoid[1]).then(info => {
  if (info.length_seconds > 1000){
  msg.reply("terlalu panjang.. \n sebagai gantinya \n kamu bisa klik link dibawah ini \π \n "+ info.formats[0].url)
  }else{
  
  console.log(info.length_seconds)
  
  function os_func() {
      this.execCommand = function (cmd) {
          return new Promise((resolve, reject)=> {
             exec(cmd, (error, stdout, stderr) => {
               if (error) {
                  reject(error);
                  return;
              }
              resolve(stdout)
             });
         })
     }
  }
  var os = new os_func();
  
  os.execCommand('youtube-dl ' + url + ' --output ./mp4/'+ videoid[1] +' --format \'bestvideo[height<=480]+bestaudio/best[height<=480]\'').then(res=> {
      var media = MessageMedia.fromFilePath('mp4/'+ videoid[1] +'.mp4');
  chat.sendMessage(media);
  }).catch(err=> {
      console.log("os >>>", err);
      os.execCommand('mv ./mp4/'+ videoid[1] +' ./mp4/'+ videoid[1]+'.mp4').then(res=> {
      var media = MessageMedia.fromFilePath('mp4/'+ videoid[1]+'.mp4');
      chat.sendMessage(media);
    })
  })
  
  }
  });
  
}

  // Download Instagram
else if (msg.body.startsWith("!ig ")) {
const imageToBase64 = require('image-to-base64');
var link = msg.body.split("!ig ")[1];
var url = "https://api.fdci.se/sosmed/insta.php?url="+ link;
const { exec } = require("child_process");
request.get({
  headers: {'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'},
  url:     url,
},function(error, response, body){
    let $ = cheerio.load(body);
  var b = JSON.parse(body);
  
  var teks = ` Download Berhasil 
  
  Instagram Downloader By cr4r`;
  if(b.link == false){
	  msg.reply(" maaf Kak link nya gaada :P ");
  }else if( b.link.indexOf(".jpg") >= 0){
imageToBase64(b.link) // Path to the image
    .then(
        (response) => {
            ; // "cGF0aC90by9maWxlLmpwZw=="

const media = new MessageMedia('image/jpeg', response);
client.sendMessage(msg.from, media, {
	caption: teks });
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    )
    }else if( b.link.indexOf(".mp4") >= 0){
    	exec('wget "' + b.link + '" -O mp4/insta.mp4', (error, stdout, stderr) => {

let media = MessageMedia.fromFilePath('mp4/insta.mp4');
	client.sendMessage(msg.from, media, {
	caption: teks });
	if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
}
  
});
}
  
  /// Fun Menu

  // Glow text maker 
  else if (msg.body.startsWith("!glowtext ")) {
    msg.reply("sebentarr.. kita proses dulu")
     var h = msg.body.split("!glowtext ")[1];
 
      const { exec } = require("child_process");
      try{
        (async () => {
          const browser = await puppeteer.launch({
            headless: false,
          });
          const page = await browser.newPage();
          await page
          .goto("https://en.ephoto360.com/advanced-glow-effects-74.html", {
            waitUntil: "networkidle2",
          })
         .then(async () => {
          await page.type("#text-0", h);
          await page.click("#submit");
          await new Promise(resolve => setTimeout(resolve, 10000));
          try {
            await page.waitForSelector("#link-image");
            const element = await page.$("div.thumbnail > img");
            const text = await (await element.getProperty("src")).jsonValue();
            console.log(text);
   
            exec('wget "' + text + '" -O mp4/glow.jpg', (error, stdout, stderr) => {
            const media = MessageMedia.fromFilePath('mp4/glow.jpg');
   
            chat.sendMessage(media);
            if (error) {
                  console.log(`error: ${error.message}`);
                  return;
              }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
   
             console.log(`stdout: ${stdout}`);
            });
            browser.close();
          } catch (error) {
             console.log(error);
             msg.reply(`Aku gk mau buatin, jangan paksa aku mas`)
           }
          })
          .catch((err) => {
            console.log(error);
            msg.reply(`Aku gk mau buatin, jangan paksa aku mas`)
          });
        })();
      } catch(err) {
        msg.reply(`Aku gk mau buatin, jangan paksa aku mas`);
      }
    }

// Text to mp3
  else if (msg.body.startsWith("!tts")) {
	
    var texttomp3 = require("text-to-mp3");
      var fs = require("fs");
  
  var suara = msg.body.split("!tts ")[1];
  var text = suara;
  var fn = "tts/suara.mp3";
  
  
  
  
  if(process.argv.indexOf("-?")!== -1){
    
    return;
  }
  
  
  if(process.argv.indexOf("-t")!== -1)
    text=suara;
  
  if(process.argv.indexOf("-f")!== -1)
    fn=suara;
  
  text = text.replace(/ +(?= )/g,'');//remove all multiple space
  
  if(typeof text ===  "undefined" || text === ""
    || typeof fn === "undefined" || fn === "") { // just if I have a text I'm gona parse
    
  }
  
  //HERE WE GO
  texttomp3.getMp3(text, function(err, data){
    if(err){
      console.log(err);
      return;
    }
  
    if(fn.substring(fn.length-4, fn.length) !== ".mp3"){ // if name is not well formatted, I add the mp3 extention
      fn+=".mp3";
    }
    var file = fs.createWriteStream(fn); // write it down the file
    file.write(data);
   
    console.log("MP3 SAVED!");
    
  });
  await new Promise(resolve => setTimeout(resolve, 500));
  
    if(text.length > 200){ // check longness of text, because otherways google translate will give me a empty file
    msg.reply("Text to long, split in text of 200 characters")
  }else{
    const media = MessageMedia.fromFilePath(fn);
  
    chat.sendMessage(media);
  
  }
  
  
  }

  // Penyegar TimeLine
  else if (msg.body == "!ptl2" ){
    const imageToBase64 = require('image-to-base64');
    var items = ["ullzang boy", "cowo ganteng", "cogan", "korean boy"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "http://api.fdci.se/rep.php?gambar=" + cewe;
    
    request.get({
      headers: {'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'},
      url:     url,
    },function(error, response, body){
        
      var b = JSON.parse(body);
    var cewek =  b[Math.floor(Math.random() * b.length)];
    imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
 
    const media = new MessageMedia('image/jpeg', response);
    client.sendMessage(msg.from, media, {
      caption: `
Hai Manis 😊` });
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
  
   else if (msg.body == "!ptl1" ){
    const imageToBase64 = require('image-to-base64');
    var items = ["ullzang girl", "cewe cantik", "hijab cantik", "korean girl","cewe hijab"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    request.get({
      headers: {'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'},
      url:     url,
    },function(error, response, body){
        
      var b = JSON.parse(body);
    var cewek =  b[Math.floor(Math.random() * b.length)];
    imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
 
    const media = new MessageMedia('image/jpeg', response);
    client.sendMessage(msg.from, media, {
      caption: `
Hai Kak 😊` });
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
	
	// Search Image
	
else if (msg.body.startsWith("carifoto ")) {

var nama = msg.body.split("!carifoto ")[1];
var req = urlencode(nama.replace(/ /g,"+"));
    const imageToBase64 = require('image-to-base64');

    var url = "http://api.fdci.se/rep.php?gambar=" + req;
    
    request.get({
      headers: {'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'},
      url:     url,
    },function(error, response, body){
        
      var b = JSON.parse(body);
    var cewek =  b[Math.floor(Math.random() * b.length)];
    imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
 
    const media = new MessageMedia('image/jpeg', response);
    client.sendMessage(msg.from, media, {
      caption: `
Whoaaaa gambar di temukan 😲`  });
            }
        )
        .catch(
            (error) => {
               msg.reply(`Yaahhhh gambar tidak ditemukan 🤧`); // Logs an error if there was one
            }
        )
    
    });
    }
  
  
  else if (msg.body == "random anime" ){
    const imageToBase64 = require('image-to-base64');
    var anime = `naruto
anime aesthetic
anime cute
anime
kawaii anime
one piece
boruto
Shingeki no Kyoujin
Nanatsu no Taizai
Akame ga Kill!
Itsudatte Bokura no Koi wa 10-Centimeters Datta
Tsuki ga Kirei`
    var items = anime.split('\n')
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "http://api.fdci.se/rep.php?gambar=" + cewe;
    
    request.get({
      headers: {'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'},
      url:     url,
    },function(error, response, body){
        
      var b = JSON.parse(body);
    var cewek =  b[Math.floor(Math.random() * b.length)];
    imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
 
    const media = new MessageMedia('image/jpeg', response);
    client.sendMessage(msg.from, media, {
      caption: `
Whoaaaa gambar di temukan 😲` });
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

    else if (msg.body.startsWith("kata cinta")) {
      const request = require('request');
      request.get({
          headers: {
        'user-agent' : 'Mozilla/5.0 (Linux; Android 8.1.0; vivo 1820) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36'
        },
          url: 'https://jagokata.com/kata-bijak/kata-cinta.html',
        },function(error, response, body){
            let $ = cheerio.load(body);
            var author = $('a[class="auteurfbnaam"]').contents().first().text();
            var kata = $('q[class="fbquote"]').contents().first().text();
  
          client.sendMessage(
                msg.from,
          `
       _${kata}_
    *~${author}*
           `
            );
  
    });
    } 

	// Quotes Terkenal
	else if (msg.body == "quotes") {
const request = require('request');
request.get({
  headers: {
'user-agent' : 'Mozilla/5.0 (Linux; Android 8.1.0; vivo 1820) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36'
},
  url: 'https://jagokata.com/kata-bijak/acak.html',
},function(error, response, body){
    let $ = cheerio.load(body);
    var author = $('a[class="auteurfbnaam"]').contents().first().text();
   var kata = $('q[class="fbquote"]').contents().first().text();

client.sendMessage(
        msg.from,
        `
     _${kata}_
        
    

	*~${author}*
         `
      );

});
}


// Horoscope Menu

// Arti Nama

else if (msg.body.startsWith("!nama ")) {

var nama = msg.body.split("!nama ")[1];
var req = urlencode(nama.replace(/ /g,"+"));
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/arti_nama.php?nama1='+ req +'&proses=+Submit%21+',
},function(error, response, body){
    let $ = cheerio.load(body);
    var y = $.html().split('arti:')[1];
    var t = y.split('method="get">')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
console.log(""+ h);
msg.reply(
            `
      *Arti Dari Namamu*

  ----------------------------------
         Nama _*${nama}*_ ${h}
  ----------------------------------

        *_Arti Nama By cr4r_*
`
        );
});
}

// Cek Kecocokan Pasangan
else if (msg.body.startsWith("!pasangan ")) {
var req = msg.body;
var gh = req.split("!pasangan ")[1];

var namamu = urlencode(gh.split("&")[0]);
var pasangan = urlencode(gh.split("&")[1]);
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/kecocokan_nama_pasangan.php?nama1='+ namamu +'&nama2='+ pasangan +'&proses=+Submit%21+',
 
},function(error, response, body){
    let $ = cheerio.load(body);
var y = $.html().split('<b>KECOCOKAN JODOH BERDASARKAN NAMA PASANGAN</b><br><br>')[1];
    var t = y.split('.<br><br>')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
    var d = h.replace("&amp;", '&')
console.log(""+ d);
msg.reply(` 

-----------------------------------

 *Cek Kecocokan Jodoh Berdasarkan Nama ~*
 
 
 ${d}
 
 
 ----------------------------------
  _Cek Kecocokan Pasangan mu_
 
 `); 
});
}
  
else if (msg.body.startsWith("!chord ")) {

function foreach(arr, func){
  for(var i in arr){
    func(i, arr[i]);
  }
}
var hal = msg.body.split("!chord ")[1];
var url = "http://app.chordindonesia.com/?json=get_search_results&exclude=date,modified,attachments,comment_count,comment_status,thumbnail,thumbnail_images,author,excerpt,content,categories,tags,comments,custom_fields&search="+ hal;
request.get({
  headers: {'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'},
  url:     url,
},function(error, response, body){
    let $ = cheerio.load(body);
var d = JSON.parse(body);
if (d.count == "0"){
msg.reply("maaf lirik tidak ditemukan");
}else{

console.log(d)
var result =[];
var y = 0;
var nomor ="";

foreach(d.posts, function(i, v){
var no = d.posts[i].id;
nomor += y++;
result += " ID *["+ no + "]*  Judul : "+ d.posts[i].title +"\n\n";
});

var g = result.replace(/&#8211;/g, " - ");
client.sendMessage(
      msg.from, `
	  *Hasil Pencarian Yang Ditemukan*
	  
${g}

Silahkan pilih lagu , lalu ketik 

*!getchord ID nya*
`);

}
})
}

// Get Chord
   else if (msg.body.startsWith("!getchord ")) {

const htmlToText = require('html-to-text');

var id = msg.body.split("!chord ")[1];
  var chord = "http://app.chordindonesia.com/?json=get_post&id="+ id;
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
 url: chord
},function(error, response, body){
    let $ = cheerio.load(body);
var post = JSON.parse(body);
var html = post.post.content;
const text = htmlToText.fromString(html, {
noLinkBrackets: true,
ignoreHref: true,
ignoreImage:true
});
client.sendMessage(
      msg.from, `
	  ${text}
	  `);

});
}


// Berita Indonesia
	  else if (msg.body.startsWith("!berita ")) {
	   const keyword = msg.body.split("!berita ")[1];
const { Detik } = require('indo-news-scraper');
const imageToBase64 = require('image-to-base64');
var nomorlink = Math.floor(Math.random() * 5);
Detik.scrap(keyword).then(res => {
 console.log(res);
 var gambar = res[0].img;
 var judul = res[0].title;
 var url = res[0].url;
 
   imageToBase64(gambar) // Path to the image
        .then(
            (response) => {
 
    const media = new MessageMedia('image/jpeg', response);
    client.sendMessage(msg.from, media, {
      caption: `
Judul Berita :
 *${judul}*

Baca Berita Disini:
${url}
` });
            }
			
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
});
   }



  
// Chat Bot SimSimi
// FITUR PREMIUM INI HEHE
	
	// Soalnya pake API PREMIUM >:(
  
});
  
