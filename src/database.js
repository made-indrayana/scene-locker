const { Sequelize, Model, DataTypes } = require('sequelize');

const instance = new Sequelize(
    {
        dialect: 'sqlite',
        storage: 'database.sqlite',
    },
);

class Entry extends Model {}
Entry.init(
    {
        serverID: { type: DataTypes.STRING, allowNull: false },
        channelID: { type: DataTypes.STRING, allowNull: false },
        userID: { type: DataTypes.STRING, allowNull: false },
        lockedObject: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize: instance,
        modelName: 'Entry',
    },
);

async function validateDatabase(database) {
    try {
        await instance.authenticate(database);
        await database.sync();
        console.log('Database connection has been established successfully.');
    }
    catch (error) {
        console.error(`Unable to connect to the database: ${error}`);
    }
}

async function createEntry(serverID, channelID, userID, objectName) {
    try {
        await Entry.create({
            serverID: serverID,
            channelID: channelID,
            userID: userID,
            lockedObject: objectName,
        });
    }
    catch (error) {
        console.error(`Unable to create entry: ${error}`);
    }
}

async function destroyEntry(serverID, channelID, objectName) {
    try {
        await Entry.destroy({
            where: {
                serverID: serverID,
                channelID: channelID,
                lockedObject: objectName,
            },
        });
    }
    catch (error) {
        console.error(`Unable to destroy entry: ${error}`);
    }
}
module.exports = { instance, Entry, validateDatabase, createEntry, destroyEntry };
