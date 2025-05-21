<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-center">📍 관광지 지도</h2>

    <div id="map" class="w-full h-[600px]"></div>

    <div
      v-if="selectedPlace"
      class="mt-4 p-4 border rounded bg-gray-100 max-w-xl mx-auto"
    >
      <h3 class="text-lg font-bold mb-2">{{ selectedPlace.title }}</h3>
      <p class="mb-2">{{ selectedPlace.addr1 || "주소 정보 없음" }}</p>
      <p class="mb-2 whitespace-pre-line">
        {{ selectedPlace.overview || "설명 없음" }}
      </p>
      <img
        v-if="selectedPlace.firstimage"
        :src="selectedPlace.firstimage"
        :alt="selectedPlace.title"
        class="w-full rounded"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const map = ref(null);
const markers = ref([]);
const labels = ref([]);
const selectedPlace = ref(null);

// 기본 초기 위치 (서울 시청)
const centerLat = ref(37.5665);
const centerLng = ref(126.978);

// 공공 관광지 API: 위치 기반 관광지 검색
const fetchTourSpots = async (lat, lng) => {
  const url = `https://apis.data.go.kr/B551011/KorService2/locationBasedList2?serviceKey=9%2BbGN61jsa1pXvvZP8Qz1imV8VDygGRf0Y5T0zEkyET9AogmnDruzSiywAMCNasTRR31%2Bx6e%2BDtfI8orbV%2FdYA%3D%3D&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&arrange=C&mapX=${lng}&mapY=${lat}&radius=20000&contentTypeId=12`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.response.body.items.item || [];
  } catch (err) {
    console.error("API 호출 실패", err);
    return [];
  }
};

// 상세 설명 조회 API
const fetchDetailIntro = async (contentId, contentTypeId) => {
  const url = `https://apis.data.go.kr/B551011/KorService2/detailIntro2?serviceKey=9%2BbGN61jsa1pXvvZP8Qz1imV8VDygGRf0Y5T0zEkyET9AogmnDruzSiywAMCNasTRR31%2Bx6e%2BDtfI8orbV%2FdYA%3D%3D&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&contentTypeId=${contentTypeId}&numOfRows=10&pageNo=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const items = data.response.body.items.item;
    if (items && items.length > 0) {
      const overviewItem =
        items.find((i) => i.contenttypeid === contentTypeId) || items[0];
      return overviewItem.overview || "";
    }
    return "";
  } catch (err) {
    console.error("상세정보 API 실패", err);
    return "";
  }
};

const renderMarkers = async (mapInstance, spots) => {
  markers.value.forEach((m) => m.setMap(null));
  markers.value = [];
  labels.value.forEach((l) => l.setMap(null));
  labels.value = [];

  for (const spot of spots) {
    const position = new kakao.maps.LatLng(spot.mapy, spot.mapx);

    const marker = new kakao.maps.Marker({
      position,
      map: mapInstance,
    });

    const label = new kakao.maps.CustomOverlay({
      position,
      content: `<div style="background:white;border:1px solid #ccc;padding:2px 5px;font-size:12px;border-radius:4px;white-space: nowrap;">${spot.title}</div>`,
      yAnchor: 0,
      zIndex: 3,
      map: mapInstance,
    });

    kakao.maps.event.addListener(marker, "click", async () => {
      const overview = await fetchDetailIntro(
        spot.contentid,
        spot.contenttypeid
      );
      selectedPlace.value = { ...spot, overview };
    });

    markers.value.push(marker);
    labels.value.push(label);
  }
};

const initMap = async () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(centerLat.value, centerLng.value),
    level: 4,
  };
  map.value = new kakao.maps.Map(container, options);

  // 처음 주변 관광지 표시
  const initialSpots = await fetchTourSpots(centerLat.value, centerLng.value);
  await renderMarkers(map.value, initialSpots);

  kakao.maps.event.addListener(map.value, "idle", async () => {
    markers.value.forEach((m) => m.setMap(null));
    markers.value = [];
    labels.value.forEach((l) => l.setMap(null));
    labels.value = [];

    selectedPlace.value = null;

    const center = map.value.getCenter();
    const lat = center.getLat();
    const lng = center.getLng();

    const spots = await fetchTourSpots(lat, lng);
    await renderMarkers(map.value, spots);
  });
};

const loadKakaoMapScript = () => {
  return new Promise((resolve) => {
    if (typeof kakao !== "undefined") {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=b3deff2a6ae73b18c7d04dc8492e7123&autoload=false";
    script.onload = () => {
      kakao.maps.load(() => {
        resolve();
      });
    };
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  await loadKakaoMapScript();
  await initMap();
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 600px;
}
</style>
