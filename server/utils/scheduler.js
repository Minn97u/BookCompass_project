const cron = require("node-cron");
const { fetchAndSaveDust } = require("../services/dustService");

//매일 오후 12시 설정
cron.schedule("0 06 * * *", async () => {
    await fetchAndSaveDust();
    console.log("미세먼지 데이터가 업데이트 됨");
});

// const { fetchAndSaveDust } = require("../services/dustService");

// // 강제 실행
// fetchAndSaveDust();
