const path = require('path');
const fs = require('fs');
const {registerModel, Schema, Types} = require('../../database');
const LGSMWrapper = require('../LGSMWrapper');

const schema = new Schema({
    name: {
        type: String
    },
    game: {
        type: String
    },
    path: {
        type: String
    }
});
schema.methods.initLGSM = async function () {
    this.lgsm = new LGSMWrapper({
        basePath: path.resolve(this.path)
    });
    return this.lgsm.bootstrap();
};

schema.methods.install = async function () {
    return this.lgsm.install(this.game);
};

schema.methods.start = async function () {
    return this.lgsm.start(this.game);
};

const model = registerModel("gameserver", schema);
module.exports = {
    model: model,
    schema: schema
};
