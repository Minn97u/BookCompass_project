const passport = require("passport");
const authService = require("../services/authService");
const User = require("../models/userSchema");
const { ensureAuthenticated } = require("../middlewares/checklogin");
const baseURL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.CORS_ORIGIN;

async function register(req, res, next) {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ msg: "회원가입이 완료되었습니다", code: 0 });
    } catch (err) {
        res.status(400).json({ msg: err.message, code: 1 });
    }
}

function login(req, res, next) {
    passport.authenticate("local", (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ msg: "로그인 실패", code: 1 });
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                msg: "로그인 성공",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    region: user.region,
                    favoriteAuthor: user.favoriteAuthor,
                },
                code: 0,
            });
        });
    })(req, res, next);
}

function logout(req, res) {
    req.logout((err) => {
        if (err) {
            return res
                .status(500)
                .json({ msg: "로그아웃 실패했습니다", code: 1 });
        }
        req.session.destroy((err) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        msg: "세션 삭제에 실패했습니다",
                        error: err,
                        code: 2,
                    });
            }
            res.clearCookie("connect.sid"); // 세션 쿠키 삭제
            return res
                .status(200)
                .json({ msg: "로그아웃 되었습니다", code: 0 });
        });
    });
}

async function resetPassword(req, res) {
    try {
        const user = await authService.resetPassword(req.body.email);
        res.status(200).json({
            msg: "비밀번호가 초기화 되었습니다. 이메일 주소로 전송된 메일을 확인해 주세요",
            code: 0,
        });
    } catch (err) {
        res.status(400).json({ msg: err.message, code: 1 });
    }
}

async function changePassword(req, res) {
    try {
        const user = await authService.changePassword(req.user.id, req.body);
        res.status(200).json({ msg: "비밀번호가 변경되었습니다", code: 0 });
    } catch (err) {
        res.status(400).json({ msg: err.message, code: 1 });
    }
}

async function deleteUser(req, res) {
    try {
        await authService.deleteUser(req.user._id);
        res.status(200).json({ msg: "회원탈퇴 완료되었습니다." });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
}

async function userInfo(req, res) {
    try {
        if (req.user) {
            res.status(200).json({
                msg: "유저정보를 불러왔습니다",
                user: req.user,
                code: 0,
            });
        } else {
            res.status(201).json({ msg: "로그인을 해주세요", code: 1 });
        }
    } catch (err) {
        res.status(500).json({ msg: "server error" });
    }
}

function googleCallback(req, res) {
    if (req.user.favoriteAuthor === null || req.user.region === null) {
        res.redirect(`${baseURL}/additionalinfo`);
    } else {
        res.redirect(baseURL);
    }
}

async function addAdditionalInfo(req, res) {
    try {
        const user = await User.findById(req.user.id);
        user.region = req.body.region;
        user.favoriteAuthor = req.body.favoriteAuthor;
        await user.save();

        res.status(200).json({
            msg: "정보가 추가되었습니다",
            submit: true,
            code: 0,
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
}

async function findEmail(req, res) {
    try {
        const { name, region, favoriteAuthor } = req.body;
        const users = await User.find({ name, region, favoriteAuthor });
        if (users.length === 0) {
            return res.status(404).json({ msg: "User not found", code: 1 });
        }

        const results = users.map((user) => {
            const email = user.email;
            const [localPart, domain] = email.split("@");
            const maskedLocalPart = localPart
                .split("")
                .map((char, index) => (index % 2 === 0 ? char : "*"))
                .join("");
            const maskedEmail = `${maskedLocalPart}@${domain}`;

            return {
                email: maskedEmail,
                createdAt: user.createdAt,
            };
        });

        res.status(200).json({ results, code: 0 });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
}

function status(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).json({ loggedIn: true });
    } else {
        res.status(401).json({ loggedIn: false });
    }
}

module.exports = {
    register,
    login,
    logout,
    resetPassword,
    changePassword,
    deleteUser,
    userInfo,
    googleCallback,
    addAdditionalInfo,
    findEmail,
    status,
};
