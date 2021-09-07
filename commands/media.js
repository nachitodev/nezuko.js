module.exports = {
		
	mediapeople: async function (client, msg, MessageMedia, number, name){

			async function send(client, msg, MessageMedia, number, name, message){

				let media = await MessageMedia.fromFilePath(`../media/${name + random_number}.mp4`);
				client.sendMessage(msg.from, media, { sendVideoAsGif: true, caption: message })
			}

			let chat = await msg.getChat();
			let user = await msg.getContact();
			let mentions = await msg.getMentions();
			let random_number = Math.floor(Math.random() * number) + 1;
			if(chat.isGroup){
				for(let contact of mentions){

					if(name == "kiss"){
						if(contact.pushname == null){
						let message = `${user.pushname} Has kissed a stranger`;
						send(client, msg, MessageMedia, number, name, message)
						} else {
						let message = `${user.pushname} Has kissed ${contact.pushname}`;
						send(client, msg, MessageMedia, number, name, message)
						}
					}

					if(name == "joke"){
						if(contact.pushname == null){
						let message = `${user.pushname} He is making fun of a stranger`;
						send(client, msg, MessageMedia, number, name, message)
						} else {
						let message = `${user.pushname} Is making fun of ${contact.pushname}`;
						send(client, msg, MessageMedia, number, name, message)
						}
					}

					if(name == "slap"){
						if(contact.pushname == null){
						let message = `${user.pushname} I Slap A Stranger.`;
						send(client, msg, MessageMedia, number, name, message)
						} else {
						let message = `${user.pushname} I slap ${contact.pushname}`;
						send(client, msg, MessageMedia, number, name, message)
						}
					}

					if(name == "kill"){
						if(contact.pushname == null){
						let message = `${user.pushname} Has murdered a stranger`;
						send(client, msg, MessageMedia, number, name, message)
						} else {
						let message = `${user.pushname} Has murdered ${contact.pushname}`;
						send(client, msg, MessageMedia, number, name, message)
						}				
					}
				}
			} else {msg.reply("This can only be done in a group.")}
		},


	sleep: async function (msg, MessageMedia){
		    let chat = await msg.getChat();
            let user = await msg.getContact();
            let random_number = Math.floor(Math.random() * 3) + 1;
            let media = MessageMedia.fromFilePath(`../media/sleep${random_number}.mp4`)

            if(chat.isGroup){
            if(user.pushname == null){
                chat.sendMessage(media, { sendVideoAsGif: true, caption: "A Stranger is Sleeping..."})
            } else {
                chat.sendMessage(media, { sendVideoAsGif: true, caption: `${user.pushname} Is sleeping...`})
            }
        } else {msg.reply("This can only be done in a group.")}
	},

	cry: async function (msg, MessageMedia){

		let chat = await msg.getChat();
        let user = await msg.getContact();
        let random_number = Math.floor(Math.random() * 5) + 1;
        let media = await MessageMedia.fromFilePath(`../media/cry${random_number}.mp4`);
        
        if(chat.isGroup){
        if(user.pushname == null){
            chat.sendMessage(media, { sendVideoAsGif: true, caption: "A Stranger Is Crying."})
        } else {
        chat.sendMessage(media, { sendVideoAsGif: true, caption: `${user.pushname} Is crying.`});
            }
        } else {msg.reply("This can only be done in a group.")}
	},
}