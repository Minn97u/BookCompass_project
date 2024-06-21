import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const { kakao } = window;

const BookMarkMap = ({
  libraries,
  parks,
  onLibraryClick,
  onParkClick,
  center
}) => {
  const mapRef = useRef(null);
  const libraryMarkers = useRef([]);
  const parkMarkers = useRef([]);

  useEffect(() => {
    if (!kakao || !kakao.maps) {
      console.error('카카오 맵 로딩 실패');
      return;
    }

    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 9
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    mapRef.current = map;

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

    // 변경된 부분: CustomOverlay를 생성하는 함수
    const createCustomOverlay = (position, content) => {
      const overlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1.9
      });
      return overlay;
    };

    const displayLibraryMarkers = (locations) => {
      locations.forEach((location) => {
        const markerPosition = new kakao.maps.LatLng(
          location.latitude,
          location.longitude
        );
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: libraryMarkerImage,
          name: location.name
        });

        const content = `
          <div style="
            padding: 10px;
            font-size: 0.9rem;
            text-align: center;
            display: flex;
            background: white;
            border: 1px solid black;
          ">
            ${location.name}
          </div>
        `;

        // 변경된 부분: CustomOverlay 생성 및 이벤트 설정
        const overlay = createCustomOverlay(markerPosition, content);

        kakao.maps.event.addListener(marker, 'click', () => {
          onLibraryClick(location);
        });

        kakao.maps.event.addListener(marker, 'mouseover', () => {
          overlay.setMap(map);
        });

        kakao.maps.event.addListener(marker, 'mouseout', () => {
          overlay.setMap(null);
        });

        marker.setMap(map);
        libraryMarkers.current.push({ marker, overlay }); // 변경된 부분: infowindow -> overlay
      });
    };

    const displayParkMarkers = (locations) => {
      locations.forEach((location) => {
        const markerPosition = new kakao.maps.LatLng(
          location.latitude,
          location.longitude
        );
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: parkMarkerImage,
          name: location.name
        });

        const content = `
          <div style="
            padding: 10px;
            font-size: 0.9rem;
            text-align: center;
            display: flex;
            background: white;
            border: 1px solid black;
          ">
            ${location.name}
          </div>
        `;

        // 변경된 부분: CustomOverlay 생성 및 이벤트 설정
        const overlay = createCustomOverlay(markerPosition, content);

        kakao.maps.event.addListener(marker, 'click', () => {
          onParkClick(location);
        });

        kakao.maps.event.addListener(marker, 'mouseover', () => {
          overlay.setMap(map);
        });

        kakao.maps.event.addListener(marker, 'mouseout', () => {
          overlay.setMap(null);
        });

        marker.setMap(map);
        parkMarkers.current.push({ marker, overlay }); // 변경된 부분: infowindow -> overlay
      });
    };

    displayParkMarkers(parks);
    displayLibraryMarkers(libraries);

    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [libraries, parks]);

  useEffect(() => {
    if (mapRef.current && center) {
      const newCenter = new kakao.maps.LatLng(center.lat, center.lng);
      mapRef.current.setCenter(newCenter);
    }
  }, [center]);

  return (
    <MapContainer>
      <Map id='map'></Map>
    </MapContainer>
  );
};

export default BookMarkMap;

const MapContainer = styled.div`
  width: 38rem;
  height: 100%;
  margin-top: 30px;
`;
const Map = styled.div`
  width: 100%;
  height: 100vh;
`;
