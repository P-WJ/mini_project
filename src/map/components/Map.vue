<template>
  <div
    class="relative w-full h-[700px] flex flex-col rounded-3xl overflow-hidden border border-gray-200 bg-gradient-to-br from-white/90 via-white/70 to-white/30 backdrop-blur-lg shadow-[0_15px_60px_-15px_rgba(0,0,0,0.2)]"
  >
    <h1 class="text-2xl font-bold text-center mt-4 mb-2 drop-shadow">
      🧳관광지 지도
    </h1>

    <!-- 지도 영역 -->
    <div
      id="map"
      class="flex-1 rounded-t-3xl border-b border-gray-300 shadow-inner"
      style="filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.05))"
    ></div>

    <!-- 관광지 정보 오버레이 카드 -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-in-out"
      leave-active-class="transition-opacity duration-300 ease-in-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedPlace"
        class="absolute top-10 right-10 w-[370px] max-h-[85%] overflow-auto bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-6 z-30 flex flex-col"
      >
        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-2xl font-extrabold bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 bg-clip-text text-transparent truncate"
          >
            {{ selectedPlace.title }}
          </h3>
          <button
            @click="selectedPlace = null"
            class="text-gray-400 hover:text-indigo-600 hover:scale-110 transition-all"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p class="mb-3 text-gray-700 font-semibold text-sm tracking-tight">
          📍 {{ selectedPlace.addr1 || "주소 정보 없음" }}
        </p>
        <img
          v-if="selectedPlace.firstimage"
          :src="selectedPlace.firstimage"
          :alt="selectedPlace.title"
          class="rounded-2xl shadow-xl object-cover max-h-56 w-full border-4 border-indigo-200"
          loading="lazy"
        />
      </div>
    </transition>

    <!-- 관광지 슬라이더 -->
    <p class="text-lg font-semibold px-6 mt-6 mb-2">🔥 근처 인기 관광지</p>
    <div
      class="rounded-b-3xl px-6 pb-4 flex gap-5 overflow-x-auto scrollbar-none"
    >
      <div
        v-for="spot in popularSpots"
        :key="spot.contentid"
        @click="selectSpot(spot)"
        class="min-w-[150px] cursor-pointer rounded-3xl bg-white/60 backdrop-blur-sm shadow-md hover:shadow-xl transition-transform hover:scale-105 border border-transparent hover:border-indigo-500 flex flex-col items-center"
        :class="{
          'border-indigo-600 shadow-2xl scale-110':
            selectedPlace?.contentid === spot.contentid,
        }"
      >
        <img
          v-if="spot.firstimage"
          :src="spot.firstimage"
          :alt="spot.title"
          class="w-full h-28 object-cover rounded-t-3xl border-b border-indigo-200"
          loading="lazy"
        />
        <p
          class="text-indigo-900 font-semibold text-center p-3 truncate text-sm select-none"
          :title="spot.title"
        >
          {{ spot.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const map = ref(null);
const markers = ref([]);
const labels = ref([]);
const selectedPlace = ref(null);

const centerLat = ref(37.5665);
const centerLng = ref(126.978);
const popularSpots = ref([]);

// 관광지 목록 API
const fetchTourSpots = async (lat, lng) => {
  const url = `https://apis.data.go.kr/B551011/KorService2/locationBasedList2?serviceKey=spw1Vir3%2B8jkw3IEPMY7fmFPFRkFA4YsSp2GIFUhFmCeW5VOUd3pvTgqwr7jXU97kP81xwt46%2FvbhiflS095VA%3D%3D&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&arrange=C&mapX=${lng}&mapY=${lat}&radius=20000&contentTypeId=12`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.response.body.items.item || [];
  } catch (err) {
    console.error("API 호출 실패", err);
    return [];
  }
};

// 마커 렌더링
const renderMarkers = async (mapInstance, spots) => {
  markers.value.forEach((m) => m.setMap(null));
  labels.value.forEach((l) => l.setMap(null));
  markers.value = [];
  labels.value = [];

  for (const spot of spots) {
    const position = new kakao.maps.LatLng(spot.mapy, spot.mapx);

    const markerImage = new kakao.maps.MarkerImage(
      "https://cdn-icons-png.flaticon.com/512/252/252025.png",
      new kakao.maps.Size(40, 40),
      { offset: new kakao.maps.Point(20, 40) }
    );

    const marker = new kakao.maps.Marker({
      position,
      map: mapInstance,
      image: markerImage,
    });

    const label = new kakao.maps.CustomOverlay({
      position,
      content: `<div style="background:white;border:1px solid #ccc;padding:3px 6px;font-size:12px;border-radius:6px;white-space: nowrap; font-weight:600; color:#4f46e5;">${spot.title}</div>`,
      yAnchor: 0,
      zIndex: 3,
      map: mapInstance,
    });

    kakao.maps.event.addListener(marker, "click", () => {
      selectedPlace.value = spot;
    });

    markers.value.push(marker);
    labels.value.push(label);
  }
};

// 지도 초기화
const initMap = async () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(centerLat.value, centerLng.value),
    level: 4,
    draggable: true,
    scrollwheel: true,
    disableDoubleClick: false,
  };
  map.value = new kakao.maps.Map(container, options);

  const initialSpots = await fetchTourSpots(centerLat.value, centerLng.value);
  popularSpots.value = initialSpots.slice(0, 10);
  await renderMarkers(map.value, initialSpots);

  kakao.maps.event.addListener(map.value, "idle", async () => {
    markers.value.forEach((m) => m.setMap(null));
    labels.value.forEach((l) => l.setMap(null));

    const center = map.value.getCenter();
    const lat = center.getLat();
    const lng = center.getLng();

    const spots = await fetchTourSpots(lat, lng);
    popularSpots.value = spots.slice(0, 10);
    await renderMarkers(map.value, spots);
  });
};

// 카카오 지도 스크립트 로드
const loadKakaoMapScript = () =>
  new Promise((resolve) => {
    if (typeof kakao !== "undefined") {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=b3deff2a6ae73b18c7d04dc8492e7123&autoload=false`;
    script.async = true;
    script.onload = () => {
      kakao.maps.load(() => resolve());
    };
    document.head.appendChild(script);
  });

// 관광지 선택
const selectSpot = async (spot) => {
  selectedPlace.value = spot;
  if (map.value) {
    map.value.setCenter(new kakao.maps.LatLng(spot.mapy, spot.mapx));
  }
};

// 마운트
onMounted(async () => {
  await loadKakaoMapScript();
  await initMap();
});
</script>
