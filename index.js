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
     * @param {number} freq hz 0~
     */
    setFreqOfBeep(freq) {
        if (freq < 0) {
            throw new Error("Parameter 'freq' must be equal and over than 0.");
        }

        this.#FREQUENCY_OF_BEEP = freq;
    }

    /**
     * Set Volume Of Beep
     * @param {number} vol percent 0.0~1.0
     */
    setVolumeOfBeep(vol) {
        if (vol < 0) {
            throw new Error("Parameter 'vol' must be equal and over than 0.");
        }

        if (vol > 1.0) {
            throw new Error("Parameter 'vol' must be equal and less than 1.");
        }

        this.#VOLUME_OF_BEEP = vol;
    }

    /**
     * Load audio file
     * @param {string} path Audio File Path
     * @returns {AudioDeid} this
     */
    load(path) {
        try {
            this.#audioFileBuffer = Fs.readFileSync(path);

            const decoded = NodeWav.decode(this.#audioFileBuffer);

            if (decoded.channelData.length == 0) {
                throw new Error("Decoded audio file has no channel data.");
            }
    
            this.#sampleRate = decoded.sampleRate;
            this.#channelData = decoded.channelData.slice();
        } catch (e) {
            this.#audioFileBuffer = null;
            this.#sampleRate = null;
            this.#channelData = null;

            throw new Error("Failed to load audio data from file.", e);
        }
        
        return this;
    }

    /**
     * Save audio file
     * @param {string} path 
     */
    save(path) {
        try {
            this.#audioFileBuffer = NodeWav.encode(this.#channelData, { sampleRate: this.#sampleRate });
            Fs.writeFileSync(path, this.#audioFileBuffer);
        } catch (e) {
            throw new Error("Failed to save audio data into file.", e);
        } finally {
            this.#audioFileBuffer = null;
            this.#channelData = null;
            this.#sampleRate = null;
        }
    }

    /**
     * De-identify Audio
     * @param {Buffer} buffer 
     * @param {number} start 
     * @param {number} end 
     * @returns {AudioDeid}
     */
    deid(start, end) {
        if (!this.#channelData) {
            throw new Error("Load audio data from file using function 'load' first.");
        }

        if (start < 0 || end < 0) {
            throw new Error("Parameter 'start' and 'end' must be equal and over than 0.");
        }

        const sampleSize = this.#channelData[0].length;
        if (start >= sampleSize || end >= sampleSize) {
            throw new Error(`Parameter 'start' and 'end' must be less than ${sampleSize}`);
        }

        if (start >= end) {
            throw new Error("Parameter 'start' must be less than Parameter 'end'.");
        }

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