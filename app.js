const { Client, Collection, APIMessage, Permissions } = require("discord.js");

const fs = require("fs");
const Config = (global.Config = JSON.parse(fs.readFileSync("./config.json", { encoding: "utf-8" })));

const Bot = (global.Bot = new Client({ fetchAllMembers: true, disableMentions: "none" }));
const Commands = (global.Commands = new Collection());

const AsciiTable = require("ascii-table");
const CommandTable = new AsciiTable("List of Commands");

Bot.once("ready", async() => {

    await new Promise(function(resolve, reject) {
        
        const Dirs = fs.readdirSync("./Commands");
        for(const commandDir of Dirs) {
            const Files = fs.readdirSync("./Commands/" + commandDir).filter(e => e.endsWith(".js")); 
            for(const commandFile of Files) {
                const Command = new (require("./Commands/" + commandDir + "/" + commandFile))(Bot);
                if(!Command.usages || !Command.usages.length) { 
                    reject("ERROR! Cannot load \'" + commandFile + "\' command file: Command usages not found!");
                }
                if(!Command.options || !Array.isArray(Command.options)) {
                    reject("ERROR! Cannot load \'" + commandFile + "\' command file: Command options is not set!");
                }

                CommandTable.addRow(commandFile, `Command: ${Command.usages[0]} | Aliases: ${Command.usages.slice(1).join(", ")} | Category: ${Command.category || dir}`, "✅");
                Commands.set(Command.usages[0], Command)
                Command.usages.forEach(usage => Bot.api.applications(Bot.user.id).commands.post({
                    data: {
                        name: usage,
                        description: Command.description,
                        options: Command.options
                    }
                }));
                
                Command.load();
            }
        }
    
        if(CommandTable.getRows().length < 1) CommandTable.addRow("❌", "❌", `❌ -> No commands found.`);
        console.log(CommandTable.toString());
        resolve();
    });
    
    Bot.ws.on("INTERACTION_CREATE", async(interaction) => {
        const Command = Commands.get(interaction.data.name) || Commands.find(e => e.usages.some(a => a === interaction.data.name));
        if(!Command && (!Command.enabled || Command.enabled != true)) return;
        if(Command.required_perm != 0 && Command.required_perm.length && !Bot.hasPermission(interaction.member, Command.required_perm)) return await Bot.say(interaction, `You must have a \`${Command.required_perm.toUpperCase()}\` permission to use this command!`)
        const Guild = Bot.guilds.cache.get(interaction.guild_id);
        const Member = Guild.member(interaction.member.user.id);
        return Command.run(interaction, Guild, Member, interaction.data.options);
    });
    
    Bot.user.setPresence({
        status: "dnd",
        activity: {
            name: Config.DEFAULTS.ACTIVITY_TEXT,
            type: "WATCHING"
        }
    });

    console.log(`[BOT] \'${Bot.user.username}\' client has been activated!`);

});

Bot.login(Config.DEFAULTS.TOKEN).catch(err => {
    console.error("ERROR! An occured error while connectiong to client: " + err.message);
    Bot.destroy();
});

const AllPermissions = new Permissions(Permissions.ALL).toArray();
Bot.hasPermission = function(member, permission) {
    if(!AllPermissions.includes(permission.toUpperCase())) return true;
    const Perms = new Permissions(Number(member.permissions));
    if(Perms.has(permission.toUpperCase())) return true;
    return false;
}

Bot.send = async function(interaction, content) {
	return Bot.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: await createAPIMessage(interaction, content)
		}
	});
};

async function createAPIMessage(interaction, content) {
	const apiMessage = await APIMessage.create(Bot.channels.resolve(interaction.channel_id), content).resolveData().resolveFiles();
	return { ...apiMessage.data, files: apiMessage.files };
};
