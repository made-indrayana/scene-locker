const { prefix, errorTitle, helpTitle, defaultColor, autoDeleteDelay } = require('../../../config.json');
const embed = require('../../utility/embed');
const Discord = require('discord.js');
const ignoreCommands = ['cls', 'help', 'ping', 'jolott'];
const delayMultiplier = 1;


module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: ['[command name]'],
    guildOnly: false,
    execute(message, args) {
        const { commands } = message.client;
        const helpEmbed = new Discord.MessageEmbed();

        if (!args.length) {
            commands.forEach((command) => {
                if (ignoreCommands.includes(command.name))
                    return;

                const commandDesc = [];

                if (command.aliases)
                    commandDesc.push(`Alias: \`${command.aliases}\``);

                commandDesc.push(command.description);

                if (command.usage) {
                    command.usage.forEach((usage) =>
                        commandDesc.push(`> ${usage}`),
                    );
                }
                helpEmbed.addField(`\`${prefix}${command.name}\``, commandDesc);
            });

            helpEmbed.setTitle(helpTitle);
            helpEmbed.setDescription('Here\'s a list of what I can help you with:');
            helpEmbed.setColor(defaultColor);
            helpEmbed.setFooter(`You can send ${prefix}help [command name] to get info on a specific command!`);

            if(message.channel.type === 'dm')
                message.channel.send(helpEmbed);
            else {
                message.channel.send(helpEmbed)
                    .then((msg) => msg.delete({ timeout: autoDeleteDelay * delayMultiplier }).catch(() => {}));
                message.delete({ timeout: autoDeleteDelay }).catch(() => {});
            }
            return;

        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            message.reply(embed(errorTitle, 'That\'s not a valid command!', 'error'))
                .then((msg) => msg.delete({ timeout: autoDeleteDelay }).catch(() => {}));
            if(message.channel.type === 'dm')
                message.channel.send(helpEmbed);
            else {
                message.channel.send(helpEmbed)
                    .then((msg) => msg.delete({ timeout: autoDeleteDelay * delayMultiplier }).catch(() => {}));
                message.delete({ timeout: autoDeleteDelay }).catch(() => {});
            }
            return;

        }

        let description = `\`${prefix}${command.name}\``;
        if(command.aliases)
            description += `\nAlias: \`${command.aliases}\``;
        description += `\n${command.description}`;

        if(command.usage) {
            command.usage.forEach((usage) =>
                description += `\n> ${usage}`,
            );
        }
        helpEmbed.setTitle(helpTitle);
        helpEmbed.setDescription(description);
        helpEmbed.setColor(defaultColor);

        if(message.channel.type === 'dm')
            message.channel.send(helpEmbed);
        else {
            message.channel.send(helpEmbed)
                .then((msg) => msg.delete({ timeout: autoDeleteDelay * delayMultiplier }));
            message.delete({ timeout: autoDeleteDelay });
        }
    },
};
