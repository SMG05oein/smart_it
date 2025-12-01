import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import DailyList from "./DailyList";
import axios from "axios";

function Homepage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeStartDate, setActiveStartDate] = useState(new Date());

    const [monthTodos, setMonthTodos] = useState([]); // 아래 리스트용
    const [diaryDateKeys, setDiaryDateKeys] = useState([]); // 캘린더 색칠용

    const getDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const currentYear = activeStartDate.getFullYear();
    const currentMonth = activeStartDate.getMonth() + 1; // 서버는 1~12 사용

    // 서버에서 해당 월의 일지 목록 가져오기 (안전 처리 포함)
    const fetchMonthlyDiaries = async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/daily/${currentYear}/${currentMonth}`,
                {
                    withCredentials: true
                }
            );

            console.log("fetchMonthlyDiaries response:", res.data);
            let diaryList = res.data.data;

            // diaryList가 배열이 아니면 빈 배열로 처리
            if (!Array.isArray(diaryList)) diaryList = [];
            // 캘린더에 표시할 날짜들 및 리스트 아이템 준비
            const dateSet = new Set();
            const items = [];

            diaryList.forEach((item) => {
                // 방어코드: item.use_date 혹은 item.date 혹은 item.useDate 등 가능성 체크
                const dateStr = item.use_date || item.date || item.useDate || null;
                if (!dateStr) return;

                // 간단 포맷 보정: "YYYY-MM-DD" 형태가 아니면 시도
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
    console.log(diaryDateKeys);
    console.log(monthTodos);
    // 보고 있는 달이 바뀌면 서버에서 다시 가져오기
    useEffect(() => {
        fetchMonthlyDiaries();
    }, [currentYear, currentMonth]);

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "16px 8px",
            }}
        >
            {/* 캘린더 박스 */}
            <div
                style={{
                    border: "1px solid #777",
                    borderRadius: "4px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
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
                    tileClassName={({ date, view }) => {
                        if (view !== "month") return null;

                        const key = getDateKey(date);
                        const classes = [];

                        if (date.getDay() === 0) classes.push("cal-sunday");
                        if (date.getDay() === 6) classes.push("cal-saturday");

                        // 해당 날짜에 일지가 있으면 초록색
                        diaryDateKeys.forEach((k) => {
                            if(k.use_date_local.includes(key)){
                                classes.push("cal-has-todo");
                            }
                        })
                        if (diaryDateKeys.includes(key)) {
                            classes.push("cal-has-todo");
                        }

                        return classes.join(" ");
                    }}
                />
            </div>

            {/* 아래 나의 일지 리스트 */}
            <DailyList
                currentMonth={currentMonth - 1}
                monthTodos={monthTodos}
                handleEditTodo={() => {}}
                handleDeleteTodo={() => {}}
            />
        </div>
    );
}

export default Homepage;
