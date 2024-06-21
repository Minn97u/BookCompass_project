const libraryService = require("../services/libraryService");

async function getAllLibraries(req, res) {
    try {
        const libraries = await libraryService.getAllLibraries();
        res.json(libraries);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

async function getLibraryById(req, res) {
    try {
        const { libraryId } = req.params;
        const library = await libraryService.getLibraryById(libraryId);
        res.json(library);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

async function addFavoriteLibrary(req, res) {
    try {
        const userId = req.user._id;
        const { libraryId } = req.body;
        await libraryService.addFavoriteLibrary(userId, libraryId);
        res.status(200).send("도서관을 추가했습니다.");
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

module.exports = {
    getAllLibraries,
    getLibraryById,
    addFavoriteLibrary,
};
