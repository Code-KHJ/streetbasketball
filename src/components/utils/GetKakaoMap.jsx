import React, { useEffect, useState } from 'react';

const GetKakaoMap = ({ searchPlace }) => {
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
      if (!values || !kakao || !searchPlace.location) return;

      console.log(searchPlace);
      setValues((prevValues) => ({
        ...prevValues,
        address: searchPlace.location,
        buildingName: searchPlace.buildingName,
      }));

      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map'); // 지도를 표시할 div
        //주소-좌표 변환 객체를 생성
        const geocoder = new kakao.maps.services.Geocoder();

        if (!geocoder) return;

        geocoder.addressSearch(
          searchPlace.location,
          function (results, status) {
            if (status === kakao.maps.services.Status.OK) {
              var result = results[0]; //첫번째 결과의 값을 활용
              // 해당 주소에 대한 좌표를 받아서
              var coords = new kakao.maps.LatLng(result.y, result.x);
              const mapOption = {
                center: coords, // 지도의 중심좌표
                level: 3, // 지도의 확대 레벨
              };
              const map = new kakao.maps.Map(mapContainer, mapOption);
              mapContainer.style.display = 'block';
              map.relayout();
              // 지도 중심을 변경한다.
              map.setCenter(coords);

              const marker = new kakao.maps.Marker({
                position: coords,
                map: map,
              });

              const infowindow = new kakao.maps.InfoWindow({
                position: coords,
                map: map,
                content: `<span style="padding:3px;">${searchPlace.buildingName}</span>`,
              });

              infowindow.open(map, marker);

              setValues((prevValues) => ({
                ...prevValues,
                map: map,
                mapContainer: mapContainer,
                mapOption: mapOption,
                geocoder: geocoder,
                marker: marker,
                infowindow: infowindow,
              }));
            }
          }
        );
      });
    });
  }, []);

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

export default GetKakaoMap;
