const Park = require("../models/parkSchema");
const User = require("../models/userSchema");
const Review = require("../models/reviewSchema");

async function getAllParks() {
    const parks = await Park.find();
    return parks;
}

async function getParkById(parkId) {
    const park = await Park.findById(parkId);
    if (!park) throw new Error("공원을 찾을 수 없습니다.");

    const reviews = await Review.find({ park: parkId });
    return { ...park._doc, reviews };
}

async function addFavoritePark(userId, parkId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("유저를 찾을 수 없습니다.");

    if (!user.favoriteParks.includes(parkId)) {
        user.favoriteParks.push(parkId);
        await user.save();
    } else {
        throw new Error("이미 찜한 공원입니다.");
    }

    return user;
}

module.exports = {
    getAllParks,
    getParkById,
    addFavoritePark,
};
