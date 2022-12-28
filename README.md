# AudioDeid

## Audio De-identification

### Install

```json
{
    "dependencies": {
        "audiodeid": "https://github.com/qkdxorjs1002/AudioDeid.git",
    }
}

```

### Sample

[Original Audio](./sample/input.wav)

[De-identified Audio](./sample/output.wav)

### Usage

```javascript
const AudioDeid = require("audiodeid");

const audioDeid = new AudioDeid({
    frequency: 500,
    volume: 0.5
});

audioDeid.load("./sample/input.wav")
    .deid(0.81, 1.262)
    .deid(2.978, 3.212)
    .save("./sample/output.wav");
```

### Dependency

```json
{
    "node-wav": "^0.0.2"
}
```
