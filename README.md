# :books: 서재 나침반

**도서관**과 **책 읽을 수 있는 공간**을 **쉽고 편리하게** 찾고 싶으신가요?
<br/>
우리 동네 책 읽기 좋은 공간, 지금 바로 찾아보세요!

-   우리 동네 책 읽기 좋은 공간을 쉽고 편리하게 찾을 수 있는

## 프로젝트 구성 안내

## 1. 프로젝트 소개

-   개발기간: 2024.06.03~ 2024.06.21
-   언어: JavaScript, HTML, CSS
-   FE: React, Axios, Prettier, Chart.js, Styled-components
-   BE: Node.js, Express, Mongoose, Passport, Bcrypt, Nodemailer, Multer
-   DataBase: MongoDB
-   배포: Nginx
-   개발 도구 및 기타: VS Code, Git, Swagger, dotenv

-   서울 구별 인구대비 도서관 수 및 이용률
-   **서비스 개요**
    -   시간 절약: 원하는 도서관 및 공간을 빠르고 쉽게 찾아 시간 절약
    -   정보 획득 용이: 필요한 정보를 한 곳에서 손쉽게 확인
    -   문화 접근성 향상: 다양한 문화 공간에 대한 정보를 제공하여 문화 접근성 향상
    -   독서 습관 개선: 편리한 도서관 및 공간 이용을 통해 독서 습관 개선

## 2. 프로젝트 팀원 역할 분담

| 이름   | 담당 업무               |
| ------ | ----------------------- |
| 김민규 | 팀장 / BE / 데이터 분석 |
| 김민석 | BE / 데이터 분석        |
| 김해강 | BE / 데이터 분석        |
| 나경윤 | FE / 데이터 분석        |
| 이정안 | FE / 데이터 분석        |
| 서승범 | FE / 데이터 분석        |

**멤버별 responsibility**

1. 팀장

-   기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
-   개발 단계: 팀원간의 일정 등 조율 + 프론트 or 백엔드 개발
-   수정 단계: 기획, 스크럼 진행, 코치님 피드백 반영해서 수정, 발표 준비

2. 프론트엔드

-   기획 단계: 큰 주제에서 문제 해결 아이디어 도출, 데이터 수집, 와이어프레임 작성
-   개발 단계: 와이어프레임을 기반으로 구현, 데이터 처리 및 시각화 담당, UI 디자인 완성
-   수정 단계: 피드백 반영해서 프론트 디자인 수정

3.  백엔드 & 데이터 담당

-   기획 단계: 기획 데이터 분석을 통해 해결하고자 하는 문제를 정의
-   개발 단계: 웹 서버 사용자가 직접 백엔드에 저장할수 있는 기능 구현, 데이터 베이스 구축 및 API 활용, 데이터 분석 개념 총동원하기
-   수정 단계: 코치님 피드백 반영해서 분석/ 시각화 방식 수정

## 3. 프로젝트 목표

**데이터 분석 결과로 도출되는 인사이트와 웹서비스의 해결과제에 대한 논의 (50자 이상)**

-   프로젝트 기획 의도
    -   2020년 코로나를 기점으로 공공도서관의 이용객이 크게 감소
    -   코로나가 끝난 지금, 도서관 이용자의 수는 회복세에 있지만 아직 코로나 전에는 크게 미치지 못함
    -   코로나 기간 중, 이용자들은 근처에 도서관이 존재하는 지조차 모르거나, 알더라도 관련된 정보를 얻기 쉽지 않음
    -   자연스레 이용자들은 도서관으로 발을 옮기기 어렵게 됐고, 이러한 문제를 해결하고자 본 서비스를 기획
    -   가까운 도서관 정보, 해당 도서관에 대한 이용자들의 리뷰를 제공함을 통해 도서관 정보에 대한 갈증을 해소하고, 이것이 공공도서관 이용의 진작에 이바지 하기 위해 서비스를 기획

## 4. 프로젝트 기능 설명

-   **주요 기능**
    -   지도 기반 검색: 현재 위치 기반으로 주변 도서관 및 공간을 쉽게 검색
    -   마이페이지 : 내 정보, 내가 쓴 글, 리뷰, 댓글
    -   커뮤니티 페이지 : 이용자들이 독서모임 모집이나 독서관련 이야기들을 나눌 수 있게 함
-   **서브 기능**
    -   도서관 정보: 이름, 주소, 운영 시간, 휴관일, 전화번호, 홈페이지 주소 등
    -   사용자 후기: 도서관 및 공간 이용 후기 확인 가능
    -   도서관 및 공간 이용 후기 작성
    -   후기 평점 및 정렬 기능 제공
    -   도서관 시간대별 이용률을 그래프로 제공
    -   도서관 혼잡도 제공
-   기대 효과
    -   풍부한 정보 제공
    -   사용자가 혼잡한 시간을 피해 여유롭게 이용할 수 있도록 함

## 5. 프로젝트 구성도

-   [Figma 링크](https://www.figma.com/design/TvYfVPgD88WEqyyeMtMC7B/%EC%84%9C%EC%9E%AC-%EB%82%98%EC%B9%A8%EB%B0%98?node-id=0-1&t=CBwbMY2H977cPQQ8-0)

-   [ERD] (https://dbdiagram.io/d/%EC%84%9C%EC%9E%AC-%EB%82%98%EC%B9%A8%EB%B0%98-6667d3616bc9d447b15b3c47)

-   [API] (http://kdt-ai-10-team04.elicecoding.com/api-docs
    )

```
- 파일 트리
📦bookcompass
 ┣ 📂client
 ┃ ┣ 📂public
 ┃ ┃ ┣ 📂uploads
 ┃ ┃ ┗ 📜books_per_person_by_age.html
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┗ 📜Auth.js
 ┃ ┃ ┣ 📂assets
 ┃ ┃ ┃ ┣ 📂fonts
 ┃ ┃ ┃ ┗ 📂icons
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┃ ┗ 📜AuthModal.js
 ┃ ┃ ┃ ┣ 📂board
 ┃ ┃ ┃ ┃ ┗ 📜CommentSection.js
 ┃ ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┃ ┗ 📜DefaultModal.js
 ┃ ┃ ┃ ┣ 📂edit
 ┃ ┃ ┃ ┃ ┗ 📜EditInfo.js
 ┃ ┃ ┃ ┣ 📂main
 ┃ ┃ ┃ ┃ ┗ 📜ClickStar.js
 ┃ ┃ ┃ ┣ 📂mypage
 ┃ ┃ ┃ ┃ ┗ 📜BookMarkList.js
 ┃ ┃ ┣ 📂pages
 ┃ ┃ ┃ ┗ 📜AddInfo.js
 ┃ ┃ ┗ 📜App.js
 ┃ ┣ 📜.eslintrc.json
 ┃ ┗ 📜.prettierrc
 ┗ 📂server
 ┃ ┣ 📂controllers
 ┃ ┃ ┗ 📜authController.js
 ┃ ┣ 📂data
 ┃ ┃ ┗ 📜libraries.csv
 ┃ ┣ 📂middlewares
 ┃ ┃ ┗ 📜checklogin.js
 ┃ ┣ 📂models
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┗ 📜short-id.js
 ┃ ┃ ┗ 📜commentSchema.js
 ┃ ┣ 📂passport
 ┃ ┃ ┣ 📂strategies
 ┃ ┃ ┃ ┗ 📜google.js
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂routes
 ┃ ┃ ┗ 📜authRoutes.js
 ┃ ┣ 📂services
 ┃ ┃ ┗ 📜authService.js
 ┃ ┣ 📂utils
 ┃ ┃ ┗ 📜revokeToken.js
 ┃ ┣ 📜.env
 ┃ ┣ 📜importMap.js
 ┃ ┣ 📜swagger.js
 ┃ ┗ 📜server.js
 ┣ 📜.gitignore
 ┗ 📜README.md
```
