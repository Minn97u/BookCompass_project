const Dust = require("../models/dustSchema");

async function getDust(req, res, next) {
    try {
        const dustData = await Dust.find();
        res.status(200).json(dustData);
    } catch (error) {
        next(error);
    }
}

module.exports = { getDust };
