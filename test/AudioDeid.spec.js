const Assert = require('assert');

const AudioDeid = require("../index");

const audioDeid = new AudioDeid({
    frequency: 500,
    volume: 0.5
});

describe('AudioDeid Test', () => {
    it('Deid File', deidFile);
});

function deidFile() {
    audioDeid.load("./sample/input.wav")
        .deid(0.81, 1.262)
        .deid(2.978, 3.212)
        .save("./sample/output.wav");
}