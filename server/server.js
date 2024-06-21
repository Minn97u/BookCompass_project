require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors"); // CORS 미들웨어 추가
const session = require("express-session");
const passport = require("./passport");
const { swaggerUi, swaggerSpec } = require("./swagger");
const MongoStore = require("connect-mongo");
require("./utils/scheduler"); // 스케줄러 추가

const app = express();
//라우트
const parkRoutes = require("./routes/parkRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const mypageRoutes = require("./routes/mypageRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const dustRoutes = require("./routes/dustRoutes");
const errorHandler = require("./middlewares/errorHandler");

// MongoDB Atlas 연결 설정
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPWD}@cluster0.wnsz2zq.mongodb.net/${process.env.DB_NAME}`
    )
    .then(() => {
        console.log("MongoDB에 성공적으로 연결되었습니다.");
    })
    .catch((err) => {
        console.error("MongoDB 연결 실패 :", err);
    });

// CORS 설정 추가
const corsOptions = {
    origin:
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.CORS_ORIGIN,

    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // withCredentials 지원
    allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(
    "/uploads",
    express.static(path.join(__dirname, "../client/public/uploads"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 세션 설정
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPWD}@cluster0.wnsz2zq.mongodb.net/${process.env.DB_NAME}`,
            collectionName: "sessions",
        }),
        cookie: {
            maxAge: 300 * 60 * 1000,
            secure: false,
            httpOnly: true,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Swagger 설정
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 클라이언트 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../client/public")));

// 라우트 설정

app.use("/api/parks", parkRoutes);
app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/mypage", mypageRoutes);
app.use("/api/libraries", libraryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dust", dustRoutes);

// 모든 요청에 대해 index.html 파일을 반환
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public", "index.html"));
});

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 서버 시작
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
