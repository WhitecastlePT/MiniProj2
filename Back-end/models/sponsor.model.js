const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');
const bcrypt = require("bcryptjs");

const sponsorSchema = new Schema({
    name: String,
    type: {
        type: String,
        default: 'sponsor'
    },
    birth_date: Date,
    description: String,
    location: {
        city: String,
        district: String,
        country: String
    },
    auth: {
        username: String,
        password: String,
        public_key: String,
        private_key: String
    },
    registration_date: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    }
});

sponsorSchema
    .pre("save", function (callback) {
        this.auth.public_key = Math.random().toString(36).substring(2) + this._id;
        this.auth.private_key = Math.random().toString(36).substring(2) + this._id;
        this.auth.password = bcrypt.hashSync(escape(this.auth.password), bcrypt.genSaltSync(2));
        callback();
    })

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.sponsor, sponsorSchema);
