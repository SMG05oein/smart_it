import './App.css';
import { Route, Routes } from "react-router-dom";
import GNB from "./component/NB/GNB";
import FNB from "./component/NB/FNB";
import Test from "./Test";
import Login from "./component/User/Login";
import SignUp from "./component/User/SignUp";
import HospitalSearch from "./component/Hospital/HospitalSearch"; // 동물병원 조회
import ChatBot from "./component/chat/ChatBot";                    // ✅ 챗봇 화면 추가
import BoardList from "./component/Board/BoardList";
import BoardDetail from "./component/Board/BoardDetail";

function App() {
    return (
        <Routes>
            <Route path={"/"} element={<><GNB/><FNB/></>}>
                {/* 메인 페이지 */}
                <Route index element={<Test />} />  {/** 홈페이지 할 때 바꾸십쇼 */}

                {/* 동물병원 조회 */}
                <Route path={"/hospital"} element={<HospitalSearch />} />

                {/* 챗봇 화면 */}
                <Route path={"/chat"} element={<ChatBot />} />

                {/* 게시판 */}
                <Route path={"/board"} element={<BoardList />} />
                <Route path={"/board/:id"} element={<BoardDetail />} />

                {/* 로그인 / 회원가입 */}
                <Route
                    path={"/Login"}
                    element={<div className={'Section scroll-hidden'}><Login /></div>}
                />
                <Route
                    path={"/SignUp"}
                    element={<div className={'Section scroll-hidden'}><SignUp /></div>}
                />
            </Route>
        </Routes>
    );
}

export default App;
