/* global kakao */
import React, {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";

const CurrentMap = forwardRef((props, ref) => {
    const mapDivRef = useRef(null);

    // 지도/위치/마커 정보들
    const mapRef = useRef(null);
    const myPosRef = useRef(null);          // 내 위치 LatLng
    const myMarkerRef = useRef(null);       // 내 위치 마커
    const hospitalMarkersRef = useRef([]);  // 동물병원 마커들
    const markersVisibleRef = useRef(true); // 마커 표시 상태
    const selectedPlaceRef = useRef(null);  // 마지막으로 클릭한 병원 정보

    // ---------------- 지도 초기화 ----------------
    useEffect(() => {
        // 이미 kakao 로드됐으면 바로 초기화
        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(initMap);
            return;
        }

        const script = document.createElement("script");
        script.src =
            "https://dapi.kakao.com/v2/maps/sdk.js?appkey=4efdb00e4415ec712f3c444730b6c634&autoload=false&libraries=services";
        script.async = true;

        script.onload = () => {
            console.log("Kakao map SDK loaded");
            window.kakao.maps.load(initMap);
        };
        script.onerror = (e) => {
            console.error("Kakao SDK 로드 실패", e);
        };

        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const initMap = () => {
        if (!mapDivRef.current) return;
        const { kakao } = window;

        const defaultCenter = new kakao.maps.LatLng(37.5665, 126.9780);

        const map = new kakao.maps.Map(mapDivRef.current, {
            center: defaultCenter,
            level: 3,
        });
        mapRef.current = map;

        // 내 위치 찾기
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    const loc = new kakao.maps.LatLng(lat, lng);

                    myPosRef.current = loc;
                    map.setCenter(loc);

                    const marker = new kakao.maps.Marker({ position: loc });
                    marker.setMap(map);
                    myMarkerRef.current = marker;

                    const info = new kakao.maps.InfoWindow({
                        content:
                            '<div style="padding:5px;font-size:12px;">현재 위치</div>',
                    });
                    info.open(map, marker);
                },
                (err) => {
                    console.error("위치 정보를 가져올 수 없습니다.", err);
                }
            );
        }
    };

    // ---------------- 버튼에서 쓸 함수들 ----------------

    // 1) 동물병원 검색 + 마커 생성
    const searchHospitals = () => {
        const { kakao } = window;
        const map = mapRef.current;
        if (!map) return;

        // 이전 마커들 제거
        hospitalMarkersRef.current.forEach((m) => m.setMap(null));
        hospitalMarkersRef.current = [];
        selectedPlaceRef.current = null;

        const ps = new kakao.maps.services.Places();

        const center = myPosRef.current || map.getCenter();

        ps.keywordSearch(
            "동물병원",
            (data, status) => {
                if (status !== kakao.maps.services.Status.OK) {
                    alert("근처 동물병원을 찾지 못했습니다.");
                    return;
                }

                const bounds = new kakao.maps.LatLngBounds();

                data.forEach((place) => {
                    const pos = new kakao.maps.LatLng(place.y, place.x);

                    const marker = new kakao.maps.Marker({
                        position: pos,
                        map,
                    });

                    // 마커 클릭 시 선택된 병원 저장
                    kakao.maps.event.addListener(marker, "click", () => {
                        selectedPlaceRef.current = place;
                        alert(`[선택됨] ${place.place_name}`);
                    });

                    hospitalMarkersRef.current.push(marker);
                    bounds.extend(pos);
                });

                map.setBounds(bounds);
                markersVisibleRef.current = true;
            },
            {
                location: center,
                radius: 5000, // 5km
            }
        );
    };

    // 2) 마커 표시/숨기기
    const toggleMarkers = () => {
        const map = mapRef.current;
        if (!map) return;

        const visible = markersVisibleRef.current;
        hospitalMarkersRef.current.forEach((m) => m.setMap(visible ? null : map));
        markersVisibleRef.current = !visible;
    };

    // 3) 내 위치로 돌아가기
    const goMyLocation = () => {
        const map = mapRef.current;
        if (!map) return;

        const pos = myPosRef.current;
        if (!pos) {
            alert("내 위치 정보를 불러오지 못했습니다.");
            return;
        }
        map.panTo(pos);
    };

    // 4) 길 찾기 (선택된 병원 기준으로 카카오맵 새창 열기)
    const openRoute = () => {
        const place = selectedPlaceRef.current;
        if (!place) {
            alert("길 안내를 받을 동물병원을 먼저 클릭하세요.");
            return;
        }

        const url = `https://map.kakao.com/link/to/${encodeURIComponent(
            place.place_name
        )},${place.y},${place.x}`;
        window.open(url, "_blank");
    };

    // 부모(HospitalSearch)에서 사용할 수 있게 노출
    useImperativeHandle(ref, () => ({
        searchHospitals,
        toggleMarkers,
        goMyLocation,
        openRoute,
    }));

    return (
        <div
            ref={mapDivRef}
            style={{
                width: "100%",
                height: "400px",
                border: "1px solid #ddd",
                borderRadius: "8px",
            }}
        />
    );
});

export default CurrentMap;
