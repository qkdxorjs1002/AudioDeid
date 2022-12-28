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

### Usage

```javascript
const AudioDeid = require("audiodeid");

const audioDeid = new AudioDeid({
    frequency: 500,
    volume: 0.5
});

audioDeid.load("./samples/input.wav")
    .deid(3.9, 4.9)
    .deid(14.1, 15.2)
    .deid(16.2, 19.441)
    .deid(22.501, 23.571)
    .deid(1044.301, 1046)
    .save("./samples/output.wav");
```

### Dependency

```json
{
    "node-wav": "^0.0.2"
}
```
