const Library = require("../models/librarySchema");
const User = require("../models/userSchema");
const Review = require("../models/reviewSchema");

async function getAllLibraries() {
    const libraries = await Library.find();
    const librariesWithRatings = await Promise.all(
        libraries.map(async (library) => {
            const reviews = await Review.find({ library: library._id });
            let averageRating = 0;
            if (reviews.length > 0) {
                const totalRating = reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                );
                averageRating = totalRating / reviews.length;
            }
            return { ...library._doc, averageRating };
        })
    );

    return librariesWithRatings;
}

async function getLibraryById(libraryId) {
    const library = await Library.findById(libraryId);
    if (!library) throw new Error("도서관을 찾을 수 없습니다.");

    const reviews = await Review.find({ library: libraryId });
    let averageRating = 0;
    if (reviews.length > 0) {
        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );
        averageRating = totalRating / reviews.length;
    }

    return { ...library._doc, averageRating, reviews };
}

async function addFavoriteLibrary(userId, libraryId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("유저를 찾을 수 없습니다.");

    if (!user.favoriteLibraries.includes(libraryId)) {
        user.favoriteLibraries.push(libraryId);
        await user.save();
    } else {
        throw new Error("이미 찜한 도서관입니다.");
    }

    return user;
}

module.exports = {
    getAllLibraries,
    getLibraryById,
    addFavoriteLibrary,
};
