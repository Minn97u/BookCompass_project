import React, { useEffect } from 'react';

const { kakao } = window;

const LibraryParkMap = () => {
  useEffect(() => {
    if (!kakao || !kakao.maps) {
      console.error('카카오 맵 로딩 실패');
      return;
    }

    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 4
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    const libraryImageSrc = '/LocationIcon.svg';
    const libraryImageSize = new kakao.maps.Size(24, 35);
    const libraryImageOption = { offset: new kakao.maps.Point(12, 35) };

    const parkImageSrc = '/ParkIcon.svg';
    const parkImageSize = new kakao.maps.Size(24, 35);
    const parkImageOption = { offset: new kakao.maps.Point(12, 35) };

    const libraryMarkerImage = new kakao.maps.MarkerImage(
      libraryImageSrc,
      libraryImageSize,
      libraryImageOption
    );
    const parkMarkerImage = new kakao.maps.MarkerImage(
      parkImageSrc,
      parkImageSize,
      parkImageOption
    );

    let markers = [];
    let infoWindows = [];

    const clearMarkers = () => {
      markers.forEach((marker) => marker.setMap(null));
      markers = [];
      infoWindows = [];
    };

    const displayMarkers = (locations, image, type) => {
      locations.forEach((location) => {
        const latitude = location.latitude || 0;
        const longitude = location.longitude || 0;

        const markerPosition = new kakao.maps.LatLng(latitude, longitude);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: image
        });

        const infoContent = `
          <div class="kakao-info-window">
            <h4>${location.name || '정보 없음'}</h4>
            <p>주소: ${location.address || '정보 없음'}</p>
            <p>전화번호: ${location.phone || '정보 없음'}</p>
            ${
              type === 'library'
                ? `
            <p>운영시간: ${location.hours || '정보 없음'}</p>
            <p>정기 휴관일: ${location.holidays || '정보 없음'}</p>
            ${location.url ? `<a href="${location.url}" target="_blank">홈페이지</a>` : ''}
            `
                : ''
            }
          </div>
        `;

        const infoWindow = new kakao.maps.InfoWindow({
          content: infoContent,
          removable: true
        });

        kakao.maps.event.addListener(marker, 'click', () => {
          infoWindows.forEach((infoWindow) => infoWindow.close());
          infoWindow.open(map, marker);
        });

        marker.setMap(map);
        markers.push(marker);
        infoWindows.push(infoWindow);
      });
    };

    const fetchAndDisplayData = (url, image, type, filter = {}) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            let filteredData = data;

            if (filter.district) {
              filteredData = filteredData.filter(
                (item) => item.district === filter.district
              );
            }

            if (filter.searchTerm) {
              filteredData = filteredData.filter(
                (item) => item.name && item.name.includes(filter.searchTerm)
              );
            }

            displayMarkers(filteredData, image, type);
          } else {
            console.error('Error: Expected array but got', data);
          }
        })
        .catch((error) => console.error('Error fetching data:', error));
    };

    const fetchAndDisplayLibraries = (filter = {}) => {
      fetchAndDisplayData(
        '/api/libraries',
        libraryMarkerImage,
        'library',
        filter
      );
    };

    const fetchAndDisplayParks = (filter = {}) => {
      fetchAndDisplayData('/api/parks', parkMarkerImage, 'park', filter);
    };

    document
      .getElementById('district-select')
      .addEventListener('change', function () {
        const district = this.value;
        clearMarkers();
        fetchAndDisplayLibraries({ district });
        fetchAndDisplayParks({ district });
      });

    document
      .getElementById('search-button')
      .addEventListener('click', function () {
        const searchTerm = document.getElementById('library-search').value;
        clearMarkers();
        fetchAndDisplayLibraries({ searchTerm });
        fetchAndDisplayParks({ searchTerm });
      });

    fetchAndDisplayLibraries();
    fetchAndDisplayParks();
  }, []);

  return (
    <div>
      <div>
        <label htmlFor='district-select'>지역구 선택:</label>
        <select id='district-select'>
          <option value=''>전체</option>
          <option value='강남구'>강남구</option>
          <option value='강동구'>강동구</option>
          <option value='강북구'>강북구</option>
          <option value='강서구'>강서구</option>
          <option value='관악구'>관악구</option>
          <option value='광진구'>광진구</option>
          <option value='구로구'>구로구</option>
          <option value='금천구'>금천구</option>
          <option value='노원구'>노원구</option>
          <option value='도봉구'>도봉구</option>
          <option value='동대문구'>동대문구</option>
          <option value='동작구'>동작구</option>
          <option value='마포구'>마포구</option>
          <option value='서대문구'>서대문구</option>
          <option value='서초구'>서초구</option>
          <option value='성동구'>성동구</option>
          <option value='성북구'>성북구</option>
          <option value='송파구'>송파구</option>
          <option value='양천구'>양천구</option>
          <option value='영등포구'>영등포구</option>
          <option value='용산구'>용산구</option>
          <option value='은평구'>은평구</option>
          <option value='종로구'>종로구</option>
          <option value='중구'>중구</option>
          <option value='중랑구'>중랑구</option>
        </select>

        <label htmlFor='library-search'>이름 검색하기:</label>
        <input
          type='text'
          id='library-search'
          placeholder='도서관 혹은 공원 이름 입력'
        />
        <button id='search-button'>검색</button>
      </div>
      <div id='map' style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default LibraryParkMap;
