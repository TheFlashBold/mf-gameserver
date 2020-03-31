const {model: GameServerModel} = require('./models/GameServer');
const {Application, Module} = require('mf-lib');
const path = require("path");

/**
 * @type GameServerModule
 */
class GameServerModule extends Module {

    async init() {
        let test = await GameServerModel.findOne({name: 'test'});
        if (!test) {
            test = new GameServerModel({name: 'test', game: 'mcserver', path: path.resolve(Application.dirname, 'server', 'mcserver')});
            await test.save();
            await test.initLGSM();
            await test.install();
        } else {
            await test.initLGSM();
        }
        test.start();
    }

    async postInit() {

    }
}

module.exports = new GameServerModule();
