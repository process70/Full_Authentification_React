const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    roles: {
        type: [Number],
        default: [2001]  // Set default as an array with 2001
    }
}, {timestamps: true})

const userModal = model('User', userSchema)

module.exports = userModal