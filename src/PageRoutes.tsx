import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
//@ts-ignore
import Auth from './Auth.tsx';
//@ts-ignore
import App from './App.tsx';
//@ts-ignore
import End from "./End.tsx";

function PageRoutes(){

    return (

        <Router>
            <Routes>
                <Route path="/" element={<Auth/>} />
                <Route path="/selector" element={<App/>} />
                <Route path="/end" element={<End/>} />
            </Routes>
        </Router>
    )    
}

export default PageRoutes;