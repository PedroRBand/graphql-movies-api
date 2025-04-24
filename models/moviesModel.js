import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    runtime: Number,
    mainSong: String,
    genres: { type: [String], required: true }
});
movieSchema.methods.singAlong = function () {
    const karaoke = this.mainSong
        ? `Starting ${this.mainSong} sing along in 3... 2... 1...`
        : `Karaoke is not enabled for ${this.title} for now.`;
    console.log(karaoke);
};
const MovieModel = mongoose.model('Movie', movieSchema);
export default MovieModel;
