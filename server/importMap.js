const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const dotenv = require("dotenv");
const Library = require("./models/librarySchema");
const Park = require("./models/parkSchema");

dotenv.config();

mongoose.connect(
    `mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPWD}@cluster0.wnsz2zq.mongodb.net/TEST`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// CSV 파일 필드 매핑 함수 (도서관)
const mapLibraryFields = (data) => ({
    _id: new mongoose.Types.ObjectId(),
    id: data["도서관ID"],
    name: data["도서관명"],
    district: data["구명"],
    address: data["주소"],
    phone: data["전화번호"],
    url: data["홈페이지 URL"],
    hours: data["운영시간"],
    holidays: data["정기 휴관일"],
    latitude: parseFloat(data["위도"]) || null,
    longitude: parseFloat(data["경도"]) || null,
});

// CSV 파일 필드 매핑 함수 (공원)
const mapParkFields = (data) => ({
    _id: new mongoose.Types.ObjectId(),
    name: data["공원명"],
    district: data["지역"] || "알 수 없음",
    address: data["공원주소"],
    managing_department: data["관리부서"],
    phone: data["전화번호"],
    latitude: parseFloat(data["Y좌표(WGS84)"]) || null,
    longitude: parseFloat(data["X좌표(WGS84)"]) || null,
});

// 도서관 데이터 삽입
const insertLibraryData = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream("./data/libraries.csv")
            .pipe(csv())
            .on("data", (data) => {
                const mappedData = mapLibraryFields(data);
                if (mappedData.latitude && mappedData.longitude) {
                    results.push(mappedData);
                } else {
                    console.error("잘못된 도서관 데이터:", data);
                }
            })
            .on("end", async () => {
                try {
                    // 기존 데이터 삭제
                    await Library.deleteMany({});
                    console.log("기존 도서관 데이터가 삭제되었습니다.");

                    // 새로운 데이터 삽입
                    await Library.insertMany(results);
                    console.log("도서관 데이터가 성공적으로 삽입되었습니다.");
                    resolve();
                } catch (error) {
                    console.error("도서관 데이터 삽입 중 오류 발생:", error);
                    reject(error);
                }
            });
    });
};

// 공원 데이터 삽입
const insertParkData = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream("./data/parks.csv")
            .pipe(csv())
            .on("data", (data) => {
                const mappedData = mapParkFields(data);
                if (mappedData.latitude && mappedData.longitude) {
                    results.push(mappedData);
                } else {
                    console.error("잘못된 공원 데이터:", data);
                }
            })
            .on("end", async () => {
                try {
                    // 기존 데이터 삭제
                    await Park.deleteMany({});
                    console.log("기존 공원 데이터가 삭제되었습니다.");

                    // 새로운 데이터 삽입
                    await Park.insertMany(results);
                    console.log("공원 데이터가 성공적으로 삽입되었습니다.");
                    resolve();
                } catch (error) {
                    console.error("공원 데이터 삽입 중 오류 발생:", error);
                    reject(error);
                }
            });
    });
};

// 데이터 삽입 실행
const insertData = async () => {
    try {
        await insertLibraryData();
        await insertParkData();
        mongoose.connection.close();
    } catch (error) {
        console.error("데이터 삽입 중 오류 발생:", error);
        mongoose.connection.close();
    }
};

insertData();
