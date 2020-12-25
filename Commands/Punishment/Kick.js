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

        await Target.kick();

        return await this.Bot.send(`${Target} successfully kicked from the server. ✅`);
        
    }

}

module.exports = Kick;
