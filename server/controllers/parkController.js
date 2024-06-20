const parkService = require("../services/parkService");

async function getAllParks(req, res) {
    try {
        const parks = await parkService.getAllParks();
        res.json(parks);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

async function getParkById(req, res) {
    try {
        const { parkId } = req.params;
        const park = await parkService.getParkById(parkId);
        res.json(park);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

async function addFavoritePark(req, res) {
    try {
        const userId = req.user._id;
        const { parkId } = req.body;
        await parkService.addFavoritePark(userId, parkId);
        res.status(200).send("공원을 찜했습니다.");
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

module.exports = {
    getAllParks,
    getParkById,
    addFavoritePark,
};
