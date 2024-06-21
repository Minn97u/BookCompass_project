const reviewService = require("../services/reviewService");

async function getReviews(req, res) {
    try {
        const { placeId } = req.query;
        const reviews = await reviewService.getReviews(placeId);
        res.json(reviews);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

async function createReview(req, res) {
    try {
        const review = await reviewService.createReview(req.body);
        res.json(review);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

async function updateReview(req, res) {
    try {
        const review = await reviewService.updateReview(
            req.params.reviewId,
            req.body
        );
        res.json(review);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

module.exports = {
    getReviews,
    createReview,
    updateReview,
};
