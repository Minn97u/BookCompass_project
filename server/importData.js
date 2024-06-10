// const fs = require("fs");
// const csv = require("csv-parser");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();

// // MongoDB Atlas 연결 설정
// mongoose.connect(
//     `mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPWD}@cluster0.wnsz2zq.mongodb.net/TEST1`,
//     { useNewUrlParser: true, useUnifiedTopology: true }
// );

// // 스키마 가져오기
// const Library = require("./models/librarySchema");
// const Park = require("./models/parkSchema");

// async function importLibraryData() {
//     try {
//         // 기존 데이터 삭제 (옵션, 중복 삽입 방지)
//         await Library.deleteMany({});

//         // CSV 파일 읽기
//         const results = [];
//         const headers = [
//             "번호",
//             "도서관명",
//             "도서관유형",
//             "구명",
//             "주소",
//             "전화번호",
//             "홈페이지 URL",
//             "운영시간",
//             "정기 휴관일",
//             "평가",
//             "유형",
//             "위도",
//             "경도",
//         ];
//         fs.createReadStream("./data/library.csv") // 올바른 파일 경로를 지정합니다.
//             .pipe(csv({ headers: headers, skipLines: 1 }))
//             .on("data", (data) => {
//                 // 필요없는 열 제거
//                 const filteredData = {
//                     name: data["도서관명"],
//                     district: data["구명"],
//                     address: data["주소"],
//                     phone: data["전화번호"],
//                     url: data["홈페이지 URL"],
//                     hours: data["운영시간"],
//                     holidays: data["정기 휴관일"],
//                     latitude: parseFloat(data["위도"]),
//                     longitude: parseFloat(data["경도"]),
//                 };
//                 results.push(filteredData);
//             })
//             .on("end", async () => {
//                 // 데이터 삽입
//                 await Library.insertMany(results);
//                 console.log("도서관 데이터가 MongoDB에 성공적으로 담겼습니다!");
//                 importParkData(); // 도서관 데이터가 성공적으로 삽입된 후 공원 데이터를 삽입합니다.
//             })
//             .on("error", (err) => {
//                 console.error("CSV 파일 읽기 중 오류 발생:", err);
//             });
//     } catch (err) {
//         console.error("도서관 데이터 처리 중 오류 발생:", err);
//     }
// }

// async function importParkData() {
//     try {
//         // 기존 데이터 삭제 (옵션, 중복 삽입 방지)
//         await Park.deleteMany({});

//         // CSV 파일 읽기
//         const results = [];
//         const headers = [
//             "번호",
//             "공원명",
//             "공원개요",
//             "지역",
//             "공원주소",
//             "전화번호",
//             "관리부서",
//             "X좌표(WGS84)",
//             "Y좌표(WGS84)",
//         ];
//         fs.createReadStream("./data/parks.csv") // 올바른 파일 경로를 지정합니다.
//             .pipe(csv({ headers: headers, skipLines: 1 }))
//             .on("data", (data) => {
//                 console.log("읽은 데이터: ", data); // 각 데이터 항목 로그 출력
//                 // 필요없는 열 선택 및 결측치 처리
//                 const filteredData = {
//                     name: data["공원명"] || "정보 없음",
//                     district: data["지역"] || "정보 없음",
//                     address: data["공원주소"] || "정보 없음",
//                     managing_department: data["관리부서"] || "정보 없음",
//                     phone: data["전화번호"] || "정보 없음",
//                     latitude: parseFloat(data["X좌표(WGS84)"]) || null,
//                     longitude: parseFloat(data["Y좌표(WGS84)"]) || null,
//                 };
//                 console.log("필터링된 데이터: ", filteredData); // 필터링된 데이터 로그 출력
//                 results.push(filteredData);
//             })
//             .on("end", async () => {
//                 // 데이터 삽입
//                 await Park.insertMany(results);
//                 console.log("공원 데이터가 MongoDB에 성공적으로 담겼습니다!");
//                 mongoose.connection.close(); // 모든 작업이 끝난 후 클라이언트를 닫습니다.
//             })
//             .on("error", (err) => {
//                 console.error("CSV 파일 읽기 중 오류 발생:", err);
//             });
//     } catch (err) {
//         console.error("공원 데이터 처리 중 오류 발생:", err);
//     }
// }

// // 데이터 가져오기 함수 호출
// mongoose.connection.once("open", importLibraryData).on("error", console.error);

// const fs = require("fs");
// const path = require("path");
// const csv = require("csv-parser");
// const mongoose = require("mongoose");
// const Library = require("./models/librarySchema");
// const Park = require("./models/parkSchema");
// require("dotenv").config();

// // MongoDB 연결 설정
// mongoose
//     .connect(
//         `mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPWD}@cluster0.wnsz2zq.mongodb.net/TEST1`,
//         {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         }
//     )
//     .then(() => {
//         console.log("MongoDB에 성공적으로 연결되었습니다.");
//     })
//     .catch((err) => {
//         console.error("MongoDB 연결 실패 :", err);
//     });

// // CSV 파일 경로 설정
// const librariesCSV = path.join(__dirname, "data", "libraries.csv");
// const parksCSV = path.join(__dirname, "data", "parks.csv");

// // CSV 파일 데이터를 읽고 데이터베이스에 삽입하는 함수
// async function importCSV(filePath, Model) {
//     const records = [];

//     return new Promise((resolve, reject) => {
//         fs.createReadStream(filePath)
//             .pipe(csv())
//             .on("data", (row) => {
//                 records.push(row);
//             })
//             .on("end", async () => {
//                 try {
//                     // 기존 데이터와 중복되는 레코드 삭제
//                     for (const record of records) {
//                         await Model.deleteOne({ id: record.id });
//                     }

//                     // 새로운 데이터 삽입
//                     await Model.insertMany(records);
//                     resolve();
//                 } catch (error) {
//                     reject(error);
//                 }
//             });
//     });
// }

// // 데이터베이스 동기화 및 데이터 삽입
// async function main() {
//     try {
//         await importCSV(librariesCSV, Library);
//         console.log("Libraries data imported successfully.");

//         await importCSV(parksCSV, Park);
//         console.log("Parks data imported successfully.");

//         await mongoose.connection.close();
//         console.log("Database connection closed.");
//     } catch (error) {
//         console.error("Error importing data:", error);
//     }
// }

// main();
