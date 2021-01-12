const Command = require("../../Utils/Command.js");

class Write extends Command {
    
    constructor(Bot) {

        super(Bot, {
            enabled: true, 
            required_perm: "ADMINISTRATOR", // Required perm to use. (If you don't want to set this value, you can type "0" or delete it.)
            usages: ["write"], // Command usages with aliases.
            description: "Write something with bot.", // Command description.
            category: "General", // Command category. (If you delete this option, the category is set as the name of the folder where the command file is located.)
            options: [{
                name: "text",
                description: "write a text.",
                type: 3, // 6 is type USER
                required: true
            }] // All arguments options of command.
        });

    }

    load() {
           
        return;

    }

    async run(interaction, guild, member, args) {

        return await this.Bot.send(interaction, args[0].value);

    }

}

module.exports = Write;
