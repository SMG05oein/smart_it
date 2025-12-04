import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DailyList from "./DailyList"; // 경로 확인 필요
import axios from "axios";
import { Container } from "react-bootstrap";

function Homepage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeStartDate, setActiveStartDate] = useState(new Date());

    const [monthTodos, setMonthTodos] = useState([]); // 리스트용
    const [diaryDateKeys, setDiaryDateKeys] = useState([]); // 캘린더 색칠용

    const getDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const currentYear = activeStartDate.getFullYear();
    const currentMonth = activeStartDate.getMonth() + 1; // 1~12

    // 서버에서 해당 월의 일지 목록 가져오기
    const fetchMonthlyDiaries = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/daily/${currentYear}/${currentMonth}`,
                { withCredentials: true }
            );

            console.log("fetchMonthlyDiaries response:", res.data);
            let diaryList = res.data.data;

            if (!Array.isArray(diaryList)) diaryList = [];
            // 캘린더에 표시할 날짜들 및 리스트 아이템 준비
            const dateSet = new Set();
            const items = [];
            diaryList.forEach((item) => {
                const dateStr = item.use_date || item.date || item.useDate || null;
                if (!dateStr) return;

                const parts = String(dateStr).split("-").map(Number);
                if (parts.length < 3) return;

                const [y, m, d] = parts;
                const dateObj = new Date(y, m - 1, d);

                dateSet.add(`${String(y).padStart(4,"0")}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`);

                items.push({
                    date: dateObj,
                    text: item.title || item.name || "",
                    key: `${String(y).padStart(4,"0")}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`,
                    idxInDay: 0,
                    raw: item
                });
            });

            items.sort((a, b) => a.date - b.date);

            setDiaryDateKeys(diaryList);
            setMonthTodos(diaryList);

        } catch (err) {
            console.error("📛 월간 일지 조회 실패:", err);
            setDiaryDateKeys([]);
            setMonthTodos([]);
        }
    };

    useEffect(() => {
        fetchMonthlyDiaries();
    }, [currentYear, currentMonth]);

    return (
        <Container
            fluid
            style={{
                height: "100%",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                overflow: "hidden"
            }}
        >
      

            {/* 2. 중간 콘텐츠 영역 (스크롤 가능) */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#f8f9fa", // 배경색 연한 회색으로 변경 (카드 부각)
                    minHeight: 0
                }}
            >
                {/* 캘린더 스타일 커스텀 */}
                <style>
                    {`
                        .react-calendar {
                            width: 100%;
                            border: none;
                            font-family: inherit;
                        }
                        .react-calendar__navigation button {
                            font-size: 1.1rem;
                            font-weight: 700;
                            color: #343a40;
                        }
                        .react-calendar__month-view__weekdays {
                            font-size: 0.9rem;
                            font-weight: 600;
                            color: #868e96;
                            text-decoration: none;
                        }
                        .react-calendar__tile {
                            padding: 14px 6px;
                            font-size: 0.95rem;
                            border-radius: 12px;
                        }
                        .react-calendar__tile--now {
                            background: #e7f5ff;
                            color: #4dabf7;
                            font-weight: bold;
                        }
                        .react-calendar__tile--now:enabled:hover,
                        .react-calendar__tile--now:enabled:focus {
                            background: #d0ebff;
                        }
                        .react-calendar__tile--active {
                            background: #4dabf7 !important;
                            color: white !important;
                            font-weight: bold;
                        }
                        /* 일요일 빨간색 */
                        .cal-sunday { color: #fa5252 !important; }
                        /* 토요일 파란색 */
                        .cal-saturday { color: #228be6 !important; }
                        /* 일정이 있는 날짜 (초록 점 표시 등 커스텀 가능) */
                        .cal-has-todo {
                            position: relative;
                            font-weight: bold;
                            color: #0ca678 !important;
                        }
                        /* 점 표시 추가 */
                        .cal-has-todo abbr::after {
                            content: '';
                            display: block;
                            width: 6px;
                            height: 6px;
                            background-color: #0ca678;
                            border-radius: 50%;
                            margin: 2px auto 0;
                        }
                    `}
                </style>

                {/* 캘린더 카드 영역 */}
                <div style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    border: "1px solid #f1f3f5",
                    marginBottom: "10px"
                }}>
                    <Calendar
                        className="my-calendar"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        onClickDay={setSelectedDate}
                        onActiveStartDateChange={({ activeStartDate }) =>
                            setActiveStartDate(activeStartDate)
                        }
                        formatMonthYear={(locale, date) =>
                            `${date.getFullYear()}년 ${date.getMonth() + 1}월`
                        }
                        // '일' 글자 제거하고 숫자만 표시
                        formatDay={(locale, date) => date.getDate()} 
                        tileClassName={({ date, view }) => {
                            if (view !== "month") return null;

                            const key = getDateKey(date);
                            const classes = [];

                            if (date.getDay() === 0) classes.push("cal-sunday");
                            if (date.getDay() === 6) classes.push("cal-saturday");

                            // 해당 날짜에 일지가 있으면 클래스 추가
                            const hasDiary = diaryDateKeys.some(k => {
                                const kDate = k.use_date || k.use_date_local;
                                return kDate && kDate.includes(key);
                            });
                            
                            if (hasDiary) {
                                classes.push("cal-has-todo");
                            }

                            return classes.join(" ");
                        }}
                    />
                </div>

                {/* 하단 일지 리스트 컴포넌트 */}
                <DailyList
                    currentMonth={currentMonth - 1} // DailyList는 0-index 월을 기대함
                    monthTodos={monthTodos}
                    currentYear={currentYear}
                    handleEditTodo={() => {}}
                    handleDeleteTodo={() => {}}
                />
            
            </div>
        </Container>
    );
}

export default Homepage;