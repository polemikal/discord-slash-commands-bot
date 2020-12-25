class Command {

    constructor(bot, options) {
        
        this.Bot = bot;
        this.required_perm = options.required_perm || 0;
        this.enabled = options.enabled || true;
        this.usages = options.usages || null;
        this.description = options.description || "No description for this command.";
        this.category = options.category || null;
        this.options = options.options || null;

    }
}

module.exports = Command;