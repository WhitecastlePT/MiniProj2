const Sponsor = require('../models/sponsor.model');
const {
    validationResult
} = require('express-validator');
const SponsorMessages = require("../messages/sponsor.messages");
const JWT = require("jsonwebtoken");
const CONFIG = require("../config/config");
const Animal = require("../models/animal.model");

exports.get = (req, res) => {
    Sponsor.find(req.query, (error, users) => {
        if (error) throw error;

        let message = SponsorMessages.success.s2;

        if (users.length < 0)
            message = SponsorMessages.success.s5;

        message.body = users;
        return res.status(message.http).send(message);
    });
}

exports.getOne = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.findOne({
        _id: req.params.id
    }, (error, user) => {
        if (error) throw error;
        if (!user) return res.status(SponsorMessages.error.e1.http).send(SponsorMessages.error.e1);
        let message = SponsorMessages.success.s2;
        message.body = user;
        return res.status(message.http).send(message);
    });
}

exports.create = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.findOne({
        "auth.username": req.body.auth.username
    }, (error, user) => {
        if (error) throw error;
        if (user) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0)

        new Sponsor({
            name: req.body.name,
            birth_date: req.body.birth_date,
            description: req.body.description,
            location: {
                city: req.body.location.city,
                district: req.body.location.district,
                country: req.body.location.country
            },
            auth: {
                username: req.body.auth.username,
                password: req.body.auth.password
            }
        }).save((error, user) => {
            if (error) throw error;

            let payload = {
                pk: user.auth.public_key
            }

            let options = {
                expiresIn: CONFIG.auth.expiration_time,
                issuer: CONFIG.auth.issuer
            };

            let token = JWT.sign(payload, user.auth.private_key, options);

            let message = SponsorMessages.success.s0;
            message.body = user;
            return res.header("location", "/sponsors/" + user._id).header("Authorization", token).status(message.http).send(message);
        })
    });
}

exports.update = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        new: true
    }, (error, user) => {
        if (error) throw error;
        if (!user) return res.status(SponsorMessages.error.e1.http).send(SponsorMessages.error.e1);

        let message = SponsorMessages.success.s1;
        message.body = user;
        return res.status(message.http).send(message);
    });
}

exports.delete = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.deleteOne({
        _id: req.params.id
    }, (error, result) => {
        if (error) throw error;
        if (result.deletedCount <= 0) return res.status(SponsorMessages.error.e1.http).send(SponsorMessages.error.e1);

        Animal.updateMany({}, {
            $pull: {
                comments: {
                    user: req.params.id
                }
            }
        }, (error) => {
            if (error) throw error;
            return res.status(SponsorMessages.success.s3.http).send(SponsorMessages.success.s3);
        });
    });
}

exports.activate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: true
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s6.http).send(SponsorMessages.success.s6);
    });
}

exports.deactivate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: false
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s4.http).send(SponsorMessages.success.s4);
    });
}
