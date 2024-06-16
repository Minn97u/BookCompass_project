module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ msg: '권한이 없습니다. 로그인해주세요' });
  },
};
