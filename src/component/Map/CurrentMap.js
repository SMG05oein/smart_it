/* global kakao */
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const CurrentMap = forwardRef((props, ref) => {
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const myPosRef = useRef(null);
    const hospitalMarkersRef = useRef([]);
    const markersVisibleRef = useRef(true);
    const selectedPlaceRef = useRef(null);

    // ---------------- 지도 초기화 ----------------
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(initMap);
            return;
        }

        const KAKAO_KEY = process.env.REACT_APP_KAKAO_KEY;
        if (!KAKAO_KEY) return;

        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => window.kakao.maps.load(initMap);
        document.head.appendChild(script);

        return () => document.head.removeChild(script);
    }, []);

    const initMap = () => {
        if (!mapDivRef.current) return;
        const defaultCenter = new kakao.maps.LatLng(37.5665, 126.9780);
        const map = new kakao.maps.Map(mapDivRef.current, {
            center: defaultCenter,
            level: 4,
        });
        mapRef.current = map;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const loc = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                myPosRef.current = loc;
                map.setCenter(loc);

                const content = `
                    <div style="padding: 6px 12px; background-color: #4dabf7; color: white; border-radius: 20px; font-size: 12px; font-weight: bold; box-shadow: 0 3px 6px rgba(0,0,0,0.2); border: 2px solid #fff; white-space: nowrap; transform: translateY(-40px);">
                        📍 나
                    </div>
                `;
                new kakao.maps.CustomOverlay({ position: loc, content: content, map: map });
            });
        }
    };

    // ---------------- 외부 호출 함수들 ----------------
    const searchHospitals = (keyword) => {
        const map = mapRef.current;
        if (!map || !keyword) return;

        hospitalMarkersRef.current.forEach((m) => m.setMap(null));
        hospitalMarkersRef.current = [];
        selectedPlaceRef.current = null;

        const ps = new kakao.maps.services.Places();
        const center = map.getCenter();

        ps.keywordSearch(keyword, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const bounds = new kakao.maps.LatLngBounds();
                data.forEach((place) => {
                    const pos = new kakao.maps.LatLng(place.y, place.x);
                    const marker = new kakao.maps.Marker({ position: pos, map });
                    kakao.maps.event.addListener(marker, "click", () => {
                        selectedPlaceRef.current = place;
                        map.panTo(pos);
                        alert(`🏥 [${place.place_name}] 선택됨`);
                    });
                    hospitalMarkersRef.current.push(marker);
                    bounds.extend(pos);
                });
                map.setBounds(bounds);
            } else {
                alert("검색 결과가 없습니다.");
            }
        }, { location: center, radius: 5000 });
    };

    const toggleMarkers = () => {
        const map = mapRef.current;
        if (!map) return;
        const visible = !markersVisibleRef.current;
        hospitalMarkersRef.current.forEach((m) => m.setMap(visible ? map : null));
        markersVisibleRef.current = visible;
    };

    const goMyLocation = () => {
        if (mapRef.current && myPosRef.current) {
            mapRef.current.panTo(myPosRef.current);
        } else {
            alert("위치 정보를 가져올 수 없습니다.");
        }
    };

    const openRoute = () => {
        const place = selectedPlaceRef.current;
        if (!place) {
            alert("병원을 먼저 선택해주세요.");
            return;
        }
        window.open(`https://map.kakao.com/link/to/${encodeURIComponent(place.place_name)},${place.y},${place.x}`, "_blank");
    };

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
                height: "100%", // 부모 크기에 꽉 차게
                borderRadius: "16px",
            }}
        />
    );
});

export default CurrentMap;