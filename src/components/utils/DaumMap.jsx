import React, { useEffect, useState } from "react";

const DaumMap = ({ searchPlace }) => {
  const [values, setValues] = useState({
    address: null,
    map: null,
    mapContainer: null,
    mapOption: null,
    geocoder: null,
    marker: null,
  });

  useEffect(() => {
    const { daum } = window;

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JS_API_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      const { kakao } = window;

      kakao.maps.load(() => {
        const mapContainer = document.getElementById("map"); // 지도를 표시할 div
        const mapOption = {
          center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };
        const map = new daum.maps.Map(mapContainer, mapOption);
        //주소-좌표 변환 객체를 생성
        const geocoder = new daum.maps.services.Geocoder();
        //마커를 미리 생성
        const marker = new daum.maps.Marker({
          position: new daum.maps.LatLng(37.537187, 127.005476),
          map: map,
        });

        setValues({
          ...values,
          map: map,
          mapContainer: mapContainer,
          mapOption: mapOption,
          geocoder: geocoder,
          marker: marker,
        });
      });
    });
  }, []);

  useEffect(() => {
    const { daum } = window;

    if (!values || !daum || !searchPlace) return;

    setValues((prevValues) => ({
      ...prevValues,
      address: searchPlace,
    }));
    values.geocoder.addressSearch(searchPlace, function (results, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === daum.maps.services.Status.OK) {
        var result = results[0]; //첫번째 결과의 값을 활용

        // 해당 주소에 대한 좌표를 받아서
        var coords = new daum.maps.LatLng(result.y, result.x);
        // 지도를 보여준다.
        values.mapContainer.style.display = "block";
        values.map.relayout();
        // 지도 중심을 변경한다.
        values.map.setCenter(coords);
        // 마커를 결과값으로 받은 위치로 옮긴다.
        values.marker.setPosition(coords);
      }
    });
  }, [searchPlace]);

  return (
    <>
      <div
        id="map"
        style={{
          margin: "0 auto",
          width: "400px",
          height: "400px",
          display: "none",
        }}
      ></div>
    </>
  );
};

export default DaumMap;
