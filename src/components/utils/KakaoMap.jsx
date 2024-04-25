import React, { useEffect, useState } from "react";

const KakaoMap = ({ searchPlace }) => {
  const [map, setMap] = useState(null);
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JS_API_KEY}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      const { kakao } = window;

      kakao.maps.load(() => {
        const container = document.getElementById("myMap");
        const options = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        };
        const defaultMap = new kakao.maps.Map(container, options);
        setMap(defaultMap);
      });
    });
  }, []);

  useEffect(() => {
    const { kakao } = window;
    if (!map || !kakao) return;

    const ps = new kakao.maps.services.Places();

    let infowindow = new kakao.maps.InfoWindow({ zindex: 1 });

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        map.setBounds(bounds);
      }
    }

    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            "</div>"
        );
        infowindow.open(map, marker);
      });
    }
    ps.keywordSearch(searchPlace, placesSearchCB);
  }, [searchPlace, map]);

  return (
    <div
      id="myMap"
      style={{
        margin: "0 auto",
        width: "400px",
        height: "400px",
      }}
    ></div>
  );
};

export default KakaoMap;
