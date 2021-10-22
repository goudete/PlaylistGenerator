
class Track {

    id: String
    tempo: Number
    danceability: Number
    energy: Number
    liveness: Number

    constructor (id: String, tempo: Number, danceability: Number, energy: Number, liveness: Number) {
        this.tempo = tempo;
        this.danceability = danceability;
        this.energy = energy;
        this.liveness = liveness;
    }
}

module.exports = {
    Track
}