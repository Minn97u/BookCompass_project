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

const app = express();
//라우트
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

// MongoDB Atlas 연결 설정
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPWD}@cluster0.wnsz2zq.mongodb.net/TEST`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("MongoDB에 성공적으로 연결되었습니다.");
    })
    .catch((err) => {
        console.error("MongoDB 연결 실패 :", err);
    });

// CORS 설정 추가
app.use(cors());

// 미들웨어 설정
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 세션 설정
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPWD}@cluster0.wnsz2zq.mongodb.net/TEST`,
            collectionName: "sessions",
        }),
        cookie: { maxAge: 180 * 60 * 1000 }, // 3시간
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Swagger 설정
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 클라이언트 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../client/public")));

// 라우트 설정

app.use("/api", routes);

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
