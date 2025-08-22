import { Navigate, Route,Routes } from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { ProfilePage } from "./pages/ProfilePage"
import {Toaster} from 'react-hot-toast';
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LoadingScreen from "./components/LoadingComponent";

export default function App(){
  const {authUser,initializing}= useContext(AuthContext);
if(initializing)return <LoadingScreen/>;
return(
<div  className="bg-[url('/backgroundImage.jpg')] bg-cover ">
<Toaster/>
    <Routes>
    <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
    <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>}/>
    <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>
  </Routes>
</div>
)
}
