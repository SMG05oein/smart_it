/* global kakao */
import React, {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";

const CurrentMap = forwardRef((props, ref) => {
    const mapDivRef = useRef(null);

    const mapRef = useRef(null);
    const myPosRef = useRef(null);
    const myMarkerRef = useRef(null);
    const hospitalMarkersRef = useRef([]);
    const markersVisibleRef = useRef(true);
    const selectedPlaceRef = useRef(null);

    // ---------------- 지도 초기화 ----------------
    useEffect(() => {
        // 이미 로드돼 있으면 바로 사용
        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(initMap);
            return;
        }

        const KAKAO_KEY = process.env.REACT_APP_KAKAO_KEY;
        if (!KAKAO_KEY) {
            console.error("REACT_APP_KAKAO_KEY 에러");
            return;
        }

        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`;
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

    // 🔹 1) 키워드로 장소 검색
    const searchHospitals = (keyword = "동물병원") => {
        const { kakao } = window;
        const map = mapRef.current;
        if (!map) return;

        if (!keyword || !keyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }

        // 이전 마커 제거
        hospitalMarkersRef.current.forEach((m) => m.setMap(null));
        hospitalMarkersRef.current = [];
        selectedPlaceRef.current = null;

        const ps = new kakao.maps.services.Places();
        const center = myPosRef.current || map.getCenter();

        ps.keywordSearch(
            keyword,
            (data, status) => {
                if (status !== kakao.maps.services.Status.OK) {
                    alert("해당 키워드로 장소를 찾지 못했습니다.");
                    return;
                }

                const bounds = new kakao.maps.LatLngBounds();

                data.forEach((place) => {
                    const pos = new kakao.maps.LatLng(place.y, place.x);

                    const marker = new kakao.maps.Marker({
                        position: pos,
                        map,
                    });

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
                radius: 5000,
            }
        );
    };

    const toggleMarkers = () => {
        const map = mapRef.current;
        if (!map) return;

        const visible = markersVisibleRef.current;
        hospitalMarkersRef.current.forEach((m) => m.setMap(visible ? null : map));
        markersVisibleRef.current = !visible;
    };

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

    const openRoute = () => {
        const place = selectedPlaceRef.current;
        if (!place) {
            alert("길 안내를 받을 장소 마커를 먼저 클릭하세요.");
            return;
        }

        // 새 창/탭으로 카카오 길찾기 열기
        const url = `https://map.kakao.com/link/to/${encodeURIComponent(
            place.place_name
        )},${place.y},${place.x}`;
        window.open(url, "_blank");
    };

    // 부모에서 쓸 수 있게 내보내기
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
