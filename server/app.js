require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./passport');
const authRoutes = require('./routes/authRoutes');
const MongoStore = require('connect-mongo');
const path = require('path');
const { swaggerUi, swaggerSpec } = require('./swagger');


const app = express();
// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/bookcompass');

mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected');
});

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 세션 설정
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/bookcompass',
        collectionName: 'sessions'
    }),
    cookie: { maxAge: 180 * 60 * 1000 } // 3시간
}));
app.use(passport.initialize());
app.use(passport.session());

// Swagger 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// 라우트 설정
app.use('/auth', authRoutes);

//구글로그인 확인
// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
// 뷰 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));