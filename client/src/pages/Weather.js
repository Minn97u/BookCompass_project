import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function Weather() {
  const [weatherData, setWeatherData] = useState({
    airQuality: null,
    uvIndex: null,
    recommendation: '',
    isGoodDay: false
  });

  useEffect(() => {
    // 가상의 데이터 설정
    const fakeAirQuality = 45; // 예: 미세먼지 농도
    const fakeUvIndex = 1; // 예: 자외선 지수
    setWeatherData((prevData) => ({
      ...prevData,
      airQuality: fakeAirQuality,
      uvIndex: fakeUvIndex
    }));
  }, []);

  useEffect(() => {
    const { airQuality, uvIndex } = weatherData;
    if (airQuality !== null && uvIndex !== null) {
      if (airQuality <= 50 && uvIndex <= 2) {
        setWeatherData((prevData) => ({
          ...prevData,
          recommendation: '독서하기 좋은 날입니다.',
          isGoodDay: true
        }));
      } else {
        setWeatherData((prevData) => ({
          ...prevData,
          recommendation: '독서하기 좋지 않은 날입니다.',
          isGoodDay: false
        }));
      }
    }
  }, [weatherData.airQuality, weatherData.uvIndex]);

  return (
    <Container>
      <Title>날씨 정보</Title>
      <Info>
        미세먼지 농도:{' '}
        {weatherData.airQuality !== null
          ? weatherData.airQuality
          : '로딩 중...'}
      </Info>
      <Info>
        자외선 지수:{' '}
        {weatherData.uvIndex !== null ? weatherData.uvIndex : '로딩 중...'}
      </Info>
      <Recommendation good={weatherData.isGoodDay}>
        {weatherData.recommendation}
      </Recommendation>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #333;
`;

const Info = styled.p`
  font-size: 1.2em;
  color: #666;
`;

const Recommendation = styled.h2`
  font-size: 1.5em;
  color: ${(props) => (props.good ? 'green' : 'red')};
`;

export default Weather;
