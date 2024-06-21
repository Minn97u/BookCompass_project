const axios = require("axios");
const Dust = require("../models/dustSchema");
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const BASE_URL =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";

async function fetchAndSaveDust() {
    try {
        const url = new URL(BASE_URL);
        const params = new URLSearchParams({
            serviceKey: API_KEY,
            returnType: "json",
            numOfRows: 10,
            pageNo: 1,
            sidoName: "서울",
        });
        url.search = params.toString();

        const response = await axios.get(url.toString());

        if (response.data.response.header.resultCode !== "00") {
            throw new Error(
                `API 오류: ${response.data.response.header.resultMsg}`
            );
        }

        const items = response.data.response.body.items;

        // 데이터 매핑
        const dustData = items.map((item) => ({
            dataTime: item.dataTime,
            pm10Value: item.pm10Value,
            khaiGrade: item.khaiGrade,
        }));

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
