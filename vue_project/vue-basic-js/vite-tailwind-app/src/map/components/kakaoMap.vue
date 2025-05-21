<template>
  <div id="map" style="width: 1440px; height: 500px"></div>
</template>

<script setup>
import { onMounted } from "vue";
import axios from "axios";

// 중심 좌표: 서울 시청 (위도/경도)
const centerLat = 37.5665;
const centerLng = 126.978;

const loadMap = (positions) => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(centerLat, centerLng),
    level: 6,
  };
  const map = new kakao.maps.Map(container, options);

  positions.forEach((pos) => {
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(pos.mapy, pos.mapx),
      map: map,
      title: pos.title,
    });

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px; font-size:14px;">${pos.title}</div>`,
    });

    kakao.maps.event.addListener(marker, "mouseover", () =>
      infowindow.open(map, marker)
    );
    kakao.maps.event.addListener(marker, "mouseout", () => infowindow.close());
  });
};

onMounted(async () => {
  const script = document.createElement("script");
  script.src =
    "https://dapi.kakao.com/v2/maps/sdk.js?appkey=b3deff2a6ae73b18c7d04dc8492e7123&autoload=false";
  document.head.appendChild(script);

  script.onload = async () => {
    kakao.maps.load(async () => {
      try {
        const response = await axios.get(
          "https://apis.data.go.kr/B551011/KorService2/locationBasedList2",
          {
            params: {
              serviceKey:
                "9%2BbGN61jsa1pXvvZP8Qz1imV8VDygGRf0Y5T0zEkyET9AogmnDruzSiywAMCNasTRR31%2Bx6e%2BDtfI8orbV%2FdYA%3D%3D",
              MobileOS: "ETC",
              MobileApp: "AppTest",
              mapX: centerLng,
              mapY: centerLat,
              radius: 5000, // 5km 반경
              contentTypeId: "", // 특정 카테고리 필터 없음
              _type: "json",
              numOfRows: 15,
              pageNo: 1,
            },
          }
        );

        const items = response.data.response.body.items.item;

        const positions = items
          .filter((item) => item.mapx && item.mapy)
          .map((item) => ({
            title: item.title,
            mapx: parseFloat(item.mapx),
            mapy: parseFloat(item.mapy),
          }));

        loadMap(positions);
      } catch (error) {
        console.error("API 호출 오류:", error);
      }
    });
  };
});
</script>
