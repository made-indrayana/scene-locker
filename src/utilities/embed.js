const Discord = require('discord.js');
const config = require('../../config.json');

function getColor(identifier) {
    switch(identifier) {
    case 'default':
        return config.defaultColor;
    case 'warning':
        return config.warningColor;
    case 'error':
        return config.errorColor;
    default:
        return identifier;
    }
}

function createEmbedObject(title, content, color = 'default') {
    const finalColor = getColor(color);
    const object = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(finalColor)
        .setDescription(content);
    return object;
}

module.exports.create = createEmbedObject;