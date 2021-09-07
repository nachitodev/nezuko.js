module.exports = {

	info: async function(msg){

        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                _*Group Details*_
                _*Name:*_ _${chat.name}_
                _*Description:*_ _${chat.description}_
                _*Created At:*_ _${chat.createdAt.toString()}_
                _*Created By:*_ _+${chat.owner.user}_
                _*Participant count:*_ _${chat.participants.length}_
            `);
        } else {
               msg.reply("This can only be done in a group.");
        	}
	},

	desc: async function(msg){
        let chat = await msg.getChat();
        if (chat.isGroup) {
           let newDescription = msg.body.slice(6);;
           chat.setDescription(newDescription);
        } else {
            msg.reply("This can only be done in a group.");
        }
	},

	title: async function(msg){
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newSubject = msg.body.slice(7);
            chat.setSubject(newSubject);
        }else {
            msg.reply("This can only be done in a group.");
    	}
	},
    stupidmeter: async function(msg){
        let chat = await msg.getChat();
        let user = await msg.getContact();
        let mentions = await msg.getMentions();
        let random_number = Math.floor(Math.random() * 100) + 1;

            if(!mentions){
                chat.sendMessage(`Today you are ${random_number}% more Stupid than normal!`)
            } else {

            for(let contact of mentions){
                if (contact.pushname == null){
                chat.sendMessage(`Today A Stranger is ${random_number}% more Stupid than normal!`);
                } else {
                chat.sendMessage(`Today ${contact.pushname} is ${random_number}% more Stupid than normal!`);
                }
            }
        }
    }
}