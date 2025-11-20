import './App.css';
import {Route, Routes} from "react-router-dom";
import GNB from "./component/NB/GNB";
import Gnb from "./component/NB/GNB";
import FNB from "./component/NB/FNB";
import Test from "./Test";

function App() {
    return (
        <Routes>
            <Route path={"/"} element={<><GNB/><FNB/></>}>
                <Route path={"/"} element={<Test/>}/>
            </Route>
        </Routes>
    );
}

export default App;
