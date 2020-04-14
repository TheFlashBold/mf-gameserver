const GameServerModule = require('./lib/GameServerModule');

module.exports = {
    module: GameServerModule,
    models: {
        gameserver: require('./models/GameServer')
    }
};
