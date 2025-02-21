const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    avatar: { type: String }
});

module.exports = mongoose.model("User", userSchema);
