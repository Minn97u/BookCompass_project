const fs = require("fs");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

// MongoDB Atlas 연결 설정
const client = new MongoClient(
  `mongodb+srv://KimMIngyu:30PeEHk4ZN3JYlil@cluster0.wnsz2zq.mongodb.net/?retryWrites=true&w=majority`
);

async function importLibraryData() {
  const db = client.db("library_db");
  const collection = db.collection("library_info");

  // 기존 데이터 삭제 (옵션, 중복 삽입 방지)
  await collection.deleteMany({});

  // CSV 파일 읽기
  const results = [];
  fs.createReadStream("./data/library.csv") // 올바른 파일 경로를 지정합니다.
    .pipe(csv({ headers: true }))
    .on("data", (data) => {
      // 필요없는 열 제거
      const filteredData = {
        도서관명: data["도서관명"],
        구명: data["구명"],
        주소: data["주소"],
        전화번호: data["전화번호"],
        운영시간: data["운영시간"],
        "정기 휴관일": data["정기 휴관일"],
        "홈페이지 URL": data["홈페이지 URL"],
        위도: parseFloat(data["위도"]),
        경도: parseFloat(data["경도"])
      };
      results.push(filteredData);
    })
    .on("end", async () => {
      // 데이터 삽입
      await collection.insertMany(results);
      console.log("도서관 데이터가 MongoDB에 성공적으로 담겼습니다!");
      importParkData(); // 도서관 데이터가 성공적으로 삽입된 후 공원 데이터를 삽입합니다.
    })
    .on("error", (err) => {
      console.error("CSV 파일 읽기 중 오류 발생:", err);
    });
}

async function importParkData() {
  const db = client.db("park_db");
  const collection = db.collection("park_info");

  // 기존 데이터 삭제 (옵션, 중복 삽입 방지)
  await collection.deleteMany({});

  // CSV 파일 읽기
  const results = [];
  fs.createReadStream("./data/park.csv") // 올바른 파일 경로를 지정합니다.
    .pipe(csv({ headers: true }))
    .on("data", (data) => {
      // 필요없는 열 선택 및 결측치 처리
      const filteredData = {
        공원명: data["공원명"] || "정보 없음",
        공원개요: data["공원개요"] || "정보 없음",
        지역: data["지역"] || "정보 없음",
        공원주소: data["공원주소"] || "정보 없음",
        전화번호: data["전화번호"] || "정보 없음",
        "X좌표(WGS84)": parseFloat(data["X좌표(WGS84)"]) || null,
        "Y좌표(WGS84)": parseFloat(data["Y좌표(WGS84)"]) || null
      };
      results.push(filteredData);
    })
    .on("end", async () => {
      // 데이터 삽입
      await collection.insertMany(results);
      console.log("공원 데이터가 MongoDB에 성공적으로 담겼습니다!");
      client.close(); // 모든 작업이 끝난 후 클라이언트를 닫습니다.
    })
    .on("error", (err) => {
      console.error("CSV 파일 읽기 중 오류 발생:", err);
    });
}

// 데이터 가져오기 함수 호출
client.connect().then(importLibraryData).catch(console.error);
