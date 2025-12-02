import './App.css';
import { Route, Routes } from "react-router-dom";
import GNB from "./component/NB/GNB";
import FNB from "./component/NB/FNB";
import HomePage from "./component/Diary/HomePage";
import Login from "./component/User/Login";
import SignUp from "./component/User/SignUp";
import HospitalSearch from "./component/Hospital/HospitalSearch"; // 동물병원 조회
import ChatBot from "./component/chat/ChatBot";
// ✅ 챗봇 화면 추가
import BoardList from "./component/Board/BoardList";
import BoardDetail from "./component/Board/BoardDetail";
import BoardWrite from "./component/Board/BoardWrite";
import BoardEditSelect from "./component/Board/BoardEditSelect";
import BoardEdit from "./component/Board/BoardEdit";
import MyPage from "./component/User/MyPage";
import DiaryListPage from "./component/Diary/DiaryListPage";
import DiaryWritePage from "./component/Diary/DiaryWritePage";
import DiaryEditPage from "./component/Diary/DiaryEditPage";


function App() {
    return (
        <Routes>
            <Route path={"/"} element={<><GNB/><FNB/></>}>
                {/* 메인 페이지 */}
                <Route index element={<div className={'Section scroll-hidden'}><HomePage /></div>} />  {/** 홈페이지 할 때 바꾸십쇼 */}

                {/* 동물병원 조회 */}
                <Route path={"/hospital"} element={<div className={'Section scroll-hidden'}><HospitalSearch /></div>} />

                {/* 챗봇 화면 */}
                <Route path={"/chat"} element={<div className={'Section scroll-hidden'}><ChatBot /></div>} />

                {/* 마이페이지 */}
                <Route path={"/mypage"} element={<div className={'Section scroll-hidden'}><MyPage/></div>} />

                {/* 게시판 */}
                <Route path="/board" element={<div className="Section scroll-hidden"><BoardList /></div>}/>
                <Route path={"/board/write"} element={<div className={'Section scroll-hidden'}><BoardWrite /></div>}/>
                <Route path="/board/:id" element={<div className="Section scroll-hidden"><BoardDetail /></div>}/>
                <Route path="/board/edit" element={<div className="Section scroll-hidden"><BoardEditSelect /></div>}/>
                <Route path="/board/edit/:id" element={<div className="Section scroll-hidden"><BoardEdit /></div>}/>
                <Route path={"/board"} element={<div className={'Section scroll-hidden'}><BoardList /></div>}/>


                {/* 나의 일지 리스트 */}
                <Route path={"/diary/list/:year?/:month?"} element={<div className={'Section scroll-hidden'}><DiaryListPage /></div>}/>
                <Route path={"/diary/edit/:id"} element={<div className={'Section scroll-hidden'}><DiaryEditPage /></div>}/>

                {/* 나의 일지 등록 */}
                <Route path={"/diary/write"} element={<div className={'Section scroll-hidden'}><DiaryWritePage /></div>}/>



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
