const {Application, Module} = require('mf-lib');
const path = require("path");

/**
 * @type GameServerModule
 */
class GameServerModule extends Module {

    async init() {
    }

    async postInit() {
        const gameServerModel = this.app.getModule('database').getModel('gameserver');
        let test = await gameServerModel.findOne({name: 'test'});
        if (!test) {
            test = new gameServerModel({name: 'test', game: 'mcserver', path: path.resolve(Application.dirname, 'server', 'mcserver')});
            await test.save();
            await test.initLGSM();
            await test.install();
        } else {
            await test.initLGSM();
        }
        test.start();
    }
}

module.exports = GameServerModule;
