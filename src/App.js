import './App.css';
import {Route, Routes} from "react-router-dom";
import GNB from "./component/NB/GNB";
import FNB from "./component/NB/FNB";
import Test from "./Test";
import Login from "./component/User/Login";
import SignUp from "./component/User/SignUp";

function App() {
    return (
        <Routes>
            <Route path={"/"} element={<><GNB/><FNB/></>}>
                <Route index element={<Test/>}/> {/** 홈페이지 할 때 바꾸십쇼 */}
                <Route path={"/Login"} element={<div className={'Section scroll-hidden'}><Login/></div>}/>
                <Route path={"/SignUp"} element={<div className={'Section scroll-hidden'}><SignUp/></div>}/>
            </Route>
        </Routes>
    );
}

export default App;
