const axios = require("axios");
const Dust = require("../models/dustSchema");
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const API_URL = `https://api.odcloud.kr/api/MinuDustFrcstDspthSvrc/v1/getMinuDustWeekFrcstDspth?serviceKey=${API_KEY}&returnType=json&numOfRows=10&pageNo=1`;

async function fetchAndSaveDust() {
    try {
        const response = await axios.get(API_URL);
        console.log("API 응답 데이터:", response.data);

        if (response.data.response.header.resultCode !== "00") {
            throw new Error(
                `API 오류: ${response.data.response.header.resultMsg}`
            );
        }

        const items = response.data.response.body.items;
        console.log("API 응답 아이템:", items);

        const dustData = items.map((item) => ({
            presnatnDt: item.presnatnDt,
            frcstOneCn: item.frcstOneCn,
            frcstTwoCn: item.frcstTwoCn,
            frcstThreeCn: item.frcstThreeCn,
            frcstFourCn: item.frcstFourCn,
            frcstOneDt: item.frcstOneDt,
            frcstTwoDt: item.frcstTwoDt,
            frcstThreeDt: item.frcstThreeDt,
            frcstFourDt: item.frcstFourDt,
        }));
        console.log(dustData);

        await Dust.deleteMany();
        await Dust.insertMany(dustData);
    } catch (error) {
        console.error(
            "미세먼지 데이터 업데이트 실패",
            error.response ? error.response.data : error.message
        );
    }
}

module.exports = { fetchAndSaveDust };
