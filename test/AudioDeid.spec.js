const Assert = require('assert');

const AudioDeid = require("../index");

const audioDeid = new AudioDeid({ frequency: 500 });

describe('AudioDeid Test', () => {
    it('Generate Beep', generateBeep);
    it('Deid File', deidFile);
});


function deidFile() {
    const loaded = AudioDeid.load("../../../samples/input.wav");

    const deided = AudioDeid.deid(loaded, 4, 5);
    
    AudioDeid.save("../../../samples/output.wav", deided);
}