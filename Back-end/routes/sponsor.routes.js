const express = require('express');
let router = express.Router();
const SponsorController = require('../controllers/sponsor.controller');
const {
    body,
    param,
    sanitizeBody
} = require('express-validator');
const CONFIG = require("../config/config");
const AuthController = require("../controllers/auth.controller");

router.route('/')
    .post([body('name').isString(),
        body('birth_date').isISO8601(),
        body('description').isString(),
        body('location.city').isString(),
        body('location.district').optional({ checkFalsy: true }).isString(),
        body('location.country').isString(),
        body('auth.username').optional({ checkFalsy: true }).isAlphanumeric(),
        body('auth.password').optional({ checkFalsy: true }).isString(),
        sanitizeBody('name').whitelist(CONFIG.sanitize.alphabet),
        sanitizeBody('description').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical),
        sanitizeBody('location.city').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical),
        sanitizeBody('location.district').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical),
        sanitizeBody('location.country').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical)
    ], SponsorController.create)
    .get(AuthController.checkAuth, SponsorController.get);

router.route("/deactivate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.deactivate);

router.route("/activate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.activate);

router.route('/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.getOne)
    .put(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.update)
    .delete(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.delete);

module.exports = router;
