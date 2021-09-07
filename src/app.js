// Others

const axios = require("axios");
const fs = require("fs");
const request = require("request");
const ytdl = require("ytdl-core")
const Maths = require("mathjs")
const ffmpeg = require("fluent-ffmpeg")

// Whatsapp Web JS
const { Client, Location, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Commands 
const helpMessage = require("../commands/help.js")
const group = require("../commands/group.js")
const media = require("../commands/media.js")
const weather = require("../commands/weather.js")
const anime = require("../commands/anime.js")

// Config
const package = require("../package.json");
const config = require("./config.json");

// Firestore Database 

const admin = require("firebase-admin");
const serviceAccount = require("../credentials/credentials.json");
const FieldValue = admin.firestore.FieldValue;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// IP Lookup
const url = "http://extreme-ip-lookup.com/json/"

// Crypto
let price = require('crypto-price')
let cryptoPrice = require("crypto-price");


// Session Config
const SESSION_FILE_PATH = '../credentials/session.json';
let session;
if (fs.existsSync(SESSION_FILE_PATH)) {
    session = require(SESSION_FILE_PATH);
}


// Client
let client = new Client({ 
    session: session,
    puppeteer: {
        executablePath: config.chrome,
        ffmpegPath: config.ffmpeg,
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
    }
});



client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});



client.initialize();

// Login System
client.on('authenticated', (session) => {
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    });
});

// Auth error
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

// Ready
client.on("ready", () => {
    let info = client.info;
    client.setStatus(config.status)
    client.setDisplayName(config.name)
    console.log(`
                                        Number: +${info.me.user}
                                        Status: ${config.status}
    `)
});

// Commands
client.on('message', async msg => {
    const contact = await msg.getContact();
    const get_db = await db.collection("numbers").doc(contact.number);
    const doc = await get_db.get();

    else if(doc.exists) { 
    return null;
    }

    else if (msg.body === `!groupinfo`) {
        group.info(msg);
    }

    else if (msg.body.startsWith(`!desc `)) {
        group.desc(msg);
    }

    else if (msg.body.startsWith(`!title `)) {
        group.title(msg);
    }
    
    else if (msg.body.startsWith("!stupidmeter ")){
        group.stupidmeter(msg)
    }


    // Open chats
    else if (msg.body === `!chats`) {
        const chats = await client.getChats();
        msg.reply(`Nezuko has a total of ${chats.length} chats open`);
    }   

    // Media

    else if (msg.body.startsWith("!sticker")){
        if(msg.hasMedia) {
            let media = await msg.downloadMedia();
            let chat = await msg.getChat();
            chat.sendMessage(media, { 
                stickerName: "",
                stickerAuthor: "",
                sendMediaAsSticker: true 
            });
        } else {
            msg.reply("Please, Send a Photo")
        }
    }


    else if (msg.body.startsWith("!slap ")) {
        media.mediapeople(client, msg, MessageMedia, "21", "slap");
    }

    else if (msg.body == "!cry") {
        media.cry(msg, MessageMedia)
    }

    else if (msg.body == "!sleep"){
        media.sleep(msg, MessageMedia)
    }

    else if (msg.body.startsWith("!kiss ")) {
        media.mediapeople(client, msg, MessageMedia, "15", "kiss")
    }
    else if (msg.body.startsWith("!joke ")) {
        media.mediapeople(client, msg, MessageMedia, "51", "joke")
    }

    else if (msg.body.startsWith("!kill ")){
        media.mediapeople(client, msg, MessageMedia, "4", "kill")
    }

    else if (msg.body.startsWith("!weather")){
        weather.weather(msg, request);
    }


    else if (msg.body.startsWith("!about ")) {
        let mentions = await msg.getMentions();
        for(let contact of mentions){
            let about = await contact.getAbout();
            msg.reply(`${about}`)
        }
    }

    else if (msg.body.startsWith("!avatar ")){


          function sendFileFromUrl(url,filename,options={}) {
          return axios
          .get(url, { responseType: 'arraybuffer'})
          .then((response) => {
            let mdata = {
              "data": response.data.toString('base64'),
              "mimetype": response.headers['content-type'],
              "name": response.headers['content-disposition']
            }
            if (filename) mdata["name"] = filename
            let mdata2 = new MessageMedia(mdata.mimetype, mdata.data, mdata.name)
            if (!options.quotedMessageId) options.quotedMessageId = msg.id._serialized
            return client.sendMessage(msg.from, mdata2, options)
          })
          .catch('error',error => console.log(error))
        }

        let mentions = await msg.getMentions();
        for (let contact of mentions) {
          await contact.getProfilePicUrl().then(async (avatar) => {
            if (avatar) await sendFileFromUrl(avatar)
          })
        }
    }

    else if(msg.body.startsWith("!youtube ")){
        let link = msg.body.slice(9)
        if(!link){
            msg.reply("Send a Youtube Link.")
        } else {

        ytdl(link)
        .pipe(fs.createWriteStream('../media/video.mp4')).on('finish', async () => {
                let chat = await msg.getChat();
                let media = await MessageMedia.fromFilePath("../media/video.mp4")
                client.sendMessage(msg.from, media)
            })
        }
    }

    else if(msg.body.startsWith("!youtubemp3 ")){
        let link = msg.body.slice(12)
        if(!link){
            msg.reply("Send a Youtube Link.")
        } else {
            const stream = ytdl(link, {
                quality: "highestaudio",
            })
            ffmpeg(stream)
                .audioBitrate(128)
                .save("../media/audio.mp3")
                .on('end', async () => {
                    let chat = await msg.getChat();
                    let media = await MessageMedia.fromFilePath("../media/audio.mp3")
                    client.sendMessage(msg.from, media)
                })
        }
    }

    else if(msg.body.startsWith("!math ")){
        calculation = msg.body.slice(6)
        if (typeof Maths.evaluate(calculation) !== "number"){
            msg.reply("Only Numbers.")
        } else { msg.reply(`${calculation} = ${Maths.evaluate(calculation)}`)}
    }

    else if(msg.body.startsWith("!8ball ")) {
        if(msg.body.slice(7) === null) {
            msg.reply("Put a Question :(");
        } else {
            const random_number = Math.floor(Math.random() * 11) + 0;
            const text = [  
            "Yes!", 
            "No! :(", 
            "May be", 
            "Probably", 
            "Probably not",
            "Uhh, I'm hungry, Im going to the kitchen", 
            "Everything points to yes", 
            "Everything points to no ",
            "Clearly",
            "You must trust it",
            "Very doubtful",
            "Not Very doubtful"
            ] 

            msg.reply(text[random_number])
        }
    }


    // IP Lookup
    else if (msg.body.startsWith(`!ip `)) {
        let ip = msg.body.split(" ")[1];
        let url2 = url + ip
        request({url: url2,json: true}, function (error, response, body) {
            if (!error && response.statusCode === 200) {
            
            // JSON 
                msg.reply(`

            _IP:_ ${body.query}
            _City:_ ${body.city}
            _Region:_ ${body.region}
            _ISP:_ ${body.isp}
            _ORG:_ ${body.org}
            _Lat:_ ${body.lat}
            _Lon:_ ${body.lon}
                `)
          }})
    }

    // Say
    else if (msg.body.startsWith(`!say `)) {
        msg.reply(msg.body.slice(5));
    }

    // Crypto
    // Bitcoin
        else if (msg.body == `!bitcoin`) {
        price.getCryptoPrice("usd", "btc").then(obj => {
        msg.reply(`Bitcoin ━ ${(parseInt(obj.price, 10))} USD`)
                                                })
                                        }
        // Ethereum
        else if (msg.body == `!ethereum`) {
        price.getCryptoPrice("usd", "eth").then(obj => {                  
        msg.reply(`Ethereum ━ ${(parseInt(obj.price,10))} USD`)
                                            })
                                        }
                    
        // Litecoin
                else if (msg.body == `!litecoin`) {
                price.getCryptoPrice("usd", "ltc").then(obj => {  
                msg.reply(`Litecoin ━ ${(parseInt(obj.price,10))} USD`);
                                            })
                                        }

    else if (msg.body === `!help`) {    
        helpMessage(msg);
    }

});

client.on('message_create', async msg => {
    
    // Admin
    if (msg.body == `!admin`) {

    const contact = await msg.getContact();
        if(contact.number === config.admin) {

            msg.reply(`𝘞𝘦𝘭𝘤𝘰𝘮𝘦 𝘵𝘰 𝘈𝘥𝘮𝘪𝘯 𝘗𝘢𝘯𝘦𝘭. 
            !blacklist, Blacklist a Number. 「 💣 」
            !whitelist, Remove a Blacklist from a Number. 「 🔪 」`)

        }

        else msg.reply("You are not an admin.")
    }


            // Blacklist

    else if (msg.body.startsWith(`!blacklist `)) {
        const contact = await msg.getContact();
        const mentions = await msg.getMentions();

            if(contact.number === config.admin) {
                let number = msg.body.split(" ")[1];
                
                for(let contact of mentions) {
 
                let number = contact.number;
               
               }
                    const principal_db = db.collection("numbers").doc(number.slice(1));
                    await principal_db.set({
                        "number": number.slice(1),
                    });
                    msg.reply("Number Blacklisted.")
                }
                else msg.reply("You are not admin.")
            }




        // Blacklist Remove

        else if (msg.body.startsWith(`!whitelist `)) {
            const contact = await msg.getContact();
            const mentions = await msg.getMentions();
                if(contact.number === config.admin) {
                    let number = msg.body.split(" ")[1];
                    
                    for(let contact of mentions) {
 
                    let number = contact.number
                    }
            
                    const res = db.collection("numbers").doc(number.slice(1)).delete();
                    msg.reply("Number Whitelisted.");
        }
                else msg.reply("You are not admin.")
    }        
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});
