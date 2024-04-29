import React, { useState, useEffect } from 'react';

const KakaoMapLatLng = ({ searchPlace }) => {
  const [latLng, setLatLng] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    const { kakao } = window;

    if (!kakao || !searchPlace) return;

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(searchPlace, function (results, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        var result = results[0]; //첫번째 결과의 값을 활용
        setLatLng((prevValues) => ({
          ...prevValues,
          lat: result.y,
          lng: result.x,
        }));
      }
    });
  }, [searchPlace]);

  return latLng;
};

export default KakaoMapLatLng;
