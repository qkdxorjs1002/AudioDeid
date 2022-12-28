const NodeWav = require("node-wav");
const Fs = require("fs");

class AudioDeid {

    /**
     * Frequency of Beep wave
     * @type {number}
     */
    #FREQUENCY_OF_BEEP

    /**
     * Volume of Beep wave
     * @type {number}
     */
    #VOLUME_OF_BEEP

    /**
     * Loaded Buffer from audio file
     * @type {Buffer}
     */
    #audioFileBuffer;

    /**
     * SampleRate of Loaded Audio Data
     * @type {number}
     */
    #sampleRate;

    /**
     * Processed Channel Data
     * @type {Float32Array[]}
     */
    #channelData

    /**
     * AudioDeid
     * @typedef {Object} Config
     * @property {number} Config.frequency 1~ / Default 500
     * @property {number} Config.volume 0.0 ~ 1.0 / Default 1.0
     * @param {Config} config 
     */
    constructor(config) {
        this.setFreqOfBeep(config.frequency || 500);
        this.setVolumeOfBeep(config.volume || 1.0);
    }

    /**
     * Set Frequency Of Beep
     * @param {number} freq 
     */
    setFreqOfBeep(freq) {
        this.#FREQUENCY_OF_BEEP = freq;
    }

    /**
     * Set Volume Of Beep
     * @param {number} vol 
     */
    setVolumeOfBeep(vol) {
        this.#VOLUME_OF_BEEP = vol;
    }

    /**
     * Load audio file
     * @param {string} path Audio File Path
     * @returns {AudioDeid} this
     */
    load(path) {
        this.#audioFileBuffer = Fs.readFileSync(path);

        const decoded = NodeWav.decode(this.#audioFileBuffer);

        this.#sampleRate = decoded.sampleRate;
        this.#channelData = decoded.channelData.slice();

        return this;
    }

    /**
     * Save audio file
     * @param {string} path 
     */
    save(path) {
        this.#audioFileBuffer = NodeWav.encode(this.#channelData, { sampleRate: this.#sampleRate });
        Fs.writeFileSync(path, this.#audioFileBuffer);

        this.#audioFileBuffer = null;
        this.#channelData = null;
        this.#sampleRate = null;
    }

    /**
     * De-identify Audio
     * @param {Buffer} buffer 
     * @param {number} start 
     * @param {number} end 
     * @returns {AudioDeid}
     */
    deid(start, end) {
        const startSamplePosition = this.#sampleRate * start;
        const endSamplePosition = this.#sampleRate * end;
        const beep = this.generateBeep({
            sampleRate: this.#sampleRate, 
            size: endSamplePosition - startSamplePosition, 
            tone: this.#FREQUENCY_OF_BEEP
        });

        this.#channelData.forEach((value, index, array) => {
            value.set(beep, startSamplePosition);
        });

        return this;
    }

    /**
     * Generate Beep Wave
     * @typedef {Object} BeepConfig
     * @property {number} BeepConfig.sampleRate SampleRate of Beep
     * @property {number} BeepConfig.size SampleSize of Beep
     * @property {number} BeepConfig.tone Frequency of Beep
     * @param {BeepConfig} config Config
     * @returns 
     */
    generateBeep(config) {
        const sampleFreq = config.sampleRate / config.tone;
        
        let beep = new Float32Array(config.size);
        beep.forEach((value, index, array) => {
            array[index] = Math.sin(index / (sampleFreq / (Math.PI * 2))) * this.#VOLUME_OF_BEEP;
        });

        return beep;
    }

}

module.exports = AudioDeid;