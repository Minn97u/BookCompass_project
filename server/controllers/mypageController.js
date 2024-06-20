const mypageService = require("../services/mypageService");
const path = require("path");

async function getUserProfile(req, res) {
    try {
        const user = await mypageService.getUserProfile(req.user._id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

async function updateUserProfile(req, res) {
    try {
        const { name, profileMsg } = req.body;
        const updateData = { name, profileMsg };

        if (req.file) {
            const filePath = path.join(
                __dirname,
                "..",
                "client",
                "public",
                "uploads",
                req.file.filename
            );
            updateData.profilePic = `/uploads/${req.file.filename}`;
        }

        const user = await mypageService.updateUserProfile(
            req.user._id,
            updateData
        );
        res.json(user);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

async function getUserPosts(req, res) {
    try {
        const posts = await mypageService.getUserPosts(req.user._id);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

async function deleteUserPost(req, res) {
    try {
        await mypageService.deleteUserPost(req.user._id, req.params.postId);
        res.status(200).send("글을 삭제했습니다.");
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

async function getUserComments(req, res) {
    try {
        const comments = await mypageService.getUserComments(req.user._id);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

async function deleteUserComment(req, res) {
    try {
        await mypageService.deleteUserComment(
            req.user._id,
            req.params.commentId
        );
        res.status(200).send("댓글을 삭제했습니다.");
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

async function getUserFavoriteLibraries(req, res) {
    try {
        const libraries = await mypageService.getUserFavoriteLibraries(
            req.user._id
        );
        res.json(libraries);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

async function getUserFavoriteParks(req, res) {
    try {
        const parks = await mypageService.getUserFavoriteParks(req.user._id);
        res.json(parks);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

async function deleteUserFavorite(req, res) {
    try {
        const { id, type } = req.body;
        await mypageService.deleteUserFavorite(req.user._id, id, type);
        res.status(200).send(
            `${type === "library" ? "도서관" : "공원"}을 삭제했습니다.`
        );
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

async function getUserReviews(req, res) {
    try {
        const reviews = await mypageService.getUserReviews(req.user._id);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

async function deleteUserReview(req, res) {
    try {
        await mypageService.deleteUserReview(req.user._id, req.params.reviewId);
        res.status(200).send("리뷰를 삭제했습니다.");
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserPosts,
    deleteUserPost,
    getUserComments,
    deleteUserComment,
    getUserFavoriteLibraries,
    getUserFavoriteParks,
    deleteUserFavorite,
    getUserReviews,
    deleteUserReview,
};
