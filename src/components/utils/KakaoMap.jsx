import React, { useEffect, useState } from 'react';

const KakaoMap = ({ searchPlace }) => {
  const [values, setValues] = useState({
    address: null,
    buildingName: null,
    map: null,
    mapContainer: null,
    mapOption: null,
    geocoder: null,
    marker: null,
    infowindow: null,
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JS_API_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      const { kakao } = window;

      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map'); // 지도를 표시할 div
        const mapOption = {
          center: new kakao.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        //주소-좌표 변환 객체를 생성
        const geocoder = new kakao.maps.services.Geocoder();
        //마커를 미리 생성
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(37.537187, 127.005476),
          map: map,
        });
        const infowindow = new kakao.maps.InfoWindow({
          position: new kakao.maps.LatLng(37.537187, 127.005476),
          map: map,
          content: '',
        });

        setValues({
          ...values,
          map: map,
          mapContainer: mapContainer,
          mapOption: mapOption,
          geocoder: geocoder,
          marker: marker,
          infowindow: infowindow,
        });
      });
    });
  }, []);

  useEffect(() => {
    const { kakao } = window;

    if (!values || !kakao || !searchPlace.location) return;

    setValues((prevValues) => ({
      ...prevValues,
      address: searchPlace.address,
      buildingName: searchPlace.buildingName,
    }));
    values.geocoder.addressSearch(
      searchPlace.location,
      function (results, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          var result = results[0]; //첫번째 결과의 값을 활용

          // 해당 주소에 대한 좌표를 받아서
          var coords = new kakao.maps.LatLng(result.y, result.x);
          // 지도를 보여준다.
          values.mapContainer.style.display = 'block';
          values.map.relayout();
          // 지도 중심을 변경한다.
          values.map.setCenter(coords);
          // 마커를 결과값으로 받은 위치로 옮긴다.
          values.marker.setPosition(coords);
          values.infowindow.setPosition(coords);
          values.infowindow.setContent(
            `<span style="padding:3px;">${searchPlace.buildingName}</span>`
          );
          values.infowindow.open(values.map, values.marker);
        }
      }
    );
  }, [searchPlace]);

  return (
    <>
      <div
        id="map"
        style={{
          display: 'none',
        }}
      ></div>
    </>
  );
};

export default KakaoMap;
