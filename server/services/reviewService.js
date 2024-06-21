const Review = require("../models/reviewSchema");
const Library = require("../models/librarySchema");
const Park = require("../models/parkSchema");

async function getReviews(placeId) {
    const libraryExists = await Library.exists({ _id: placeId });
    const parkExists = await Park.exists({ _id: placeId });

    let reviews;

    if (libraryExists) {
        reviews = await Review.find({ library: placeId })
            .populate("user")
            .populate("library")
            .populate("park");
    } else if (parkExists) {
        reviews = await Review.find({ park: placeId })
            .populate("user")
            .populate("library")
            .populate("park");
    } else {
        throw new Error("해당 장소를 찾을 수 없습니다.");
    }

    const formattedReviews = reviews.map((review) => ({
        _id: review._id,
        user: {
            _id: review.user._id,
            name: review.user.name,
        },
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt,
        library: review.library ? review.library.name : null,
        park: review.park ? review.park.name : null,
    }));

    return formattedReviews;
}

async function createReview(data) {
    const { userId, libraryId, parkId, rating, comment } = data;

    const review = new Review({
        user: userId,
        library: libraryId,
        park: parkId,
        rating,
        comment,
    });

    await review.save();

    if (libraryId) {
        const reviews = await Review.find({ library: libraryId });
        const averageRating =
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length;

        await Library.findByIdAndUpdate(libraryId, { averageRating });
    } else if (parkId) {
        const reviews = await Review.find({ park: parkId });
        const averageRating =
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length;

        await Park.findByIdAndUpdate(parkId, { averageRating });
    }

    return review;
}

async function updateReview(reviewId, data) {
    const { rating, comment } = data;

    const review = await Review.findById(reviewId);
    if (!review) throw new Error("리뷰를 찾을 수 없습니다.");

    review.rating = rating;
    review.comment = comment;
    await review.save();

    if (review.library) {
        const reviews = await Review.find({ library: review.library });
        const averageRating =
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length;

        await Library.findByIdAndUpdate(review.library, { averageRating });
    } else if (review.park) {
        const reviews = await Review.find({ park: review.park });
        const averageRating =
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length;

        await Park.findByIdAndUpdate(review.park, { averageRating });
    }

    return review;
}

module.exports = {
    getReviews,
    createReview,
    updateReview,
};
