import React, { useEffect, useState, useRef } from 'react';

const { kakao } = window;

const LibraryParkMap = ({
  libraries,
  parks,
  searchTerm,
  onLibraryClick,
  onParkClick,
  selectedButton,
  center,
  mapLevel
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
      level: mapLevel
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

    const clearMarkers = () => {
      libraryMarkers.current.forEach((marker) => marker.setMap(null));
      parkMarkers.current.forEach((marker) => marker.setMap(null));
      libraryMarkers.current = [];
      parkMarkers.current = [];
    };

    const displayLibraryMarkers = (locations) => {
      clearMarkers();
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
        kakao.maps.event.addListener(marker, 'click', () => {
          onLibraryClick(location);
        });
        marker.setMap(map);
        libraryMarkers.current.push(marker);
      });
    };

    const displayParkMarkers = (locations) => {
      clearMarkers();
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
        kakao.maps.event.addListener(marker, 'click', () => {
          onParkClick(location);
        });
        marker.setMap(map);
        parkMarkers.current.push(marker);
      });
    };

    const fetchAndDisplayLibraries = () => {
      displayLibraryMarkers(
        libraries.filter((library) => library.name.includes(searchTerm))
      );
    };

    const fetchAndDisplayParks = () => {
      displayParkMarkers(
        parks.filter((park) => park.name.includes(searchTerm))
      );
    };

    if (selectedButton === 'library') {
      fetchAndDisplayLibraries();
    } else if (selectedButton === 'park') {
      fetchAndDisplayParks();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [libraries, parks, searchTerm, selectedButton]);

  useEffect(() => {
    if (mapRef.current && center) {
      const newCenter = new kakao.maps.LatLng(center.lat, center.lng);
      mapRef.current.setCenter(newCenter);
    }
  }, [center]);

  return (
    <div>
      <div id='map' style={{ width: '100%', height: '100vh' }}></div>
    </div>
  );
};

export default LibraryParkMap;
