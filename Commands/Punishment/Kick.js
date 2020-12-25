const Command = require("../../Utils/Command.js");

class Kick extends Command {
    
    constructor(Bot) {

        super(Bot, {
            enabled: true,
            required_perm: "KICK_MEMBERS",
            usages: ["kick"],
            description: "Kick members from guild.",
            category: "Punishment",
            options: [{
                name: "user",
                description: "Enter target user.",
                type: 6, // 6 is type USER
                required: true
            }]
        });

    }

    load() {
            
        return;

    }

    async run(interaction, guild, member, args) {

        const Target = guild.members.cache.get(args[0].value);
        if(!Target) return await this.Bot.say(`User not found!`);
        if(!Target.kickable) return await this.Bot.say(`❌ You do not have a permission to kick this user!`);

        await Target.kick();

        return await this.Bot.say(`${Target} successfully kicked from the server. ✅`);

    }

}

module.exports = Kick;