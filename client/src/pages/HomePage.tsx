import { useContext, useState } from "react";
import { ChatContainer } from "../components/ChatContainer";
import { RightSideBar } from "../components/RightSideBar";
import { SideBar } from "../components/SideBar";
import { ChatContext } from "../context/ChatContext";

export function HomePage(){
    const {SelectedUser}= useContext(ChatContext);
  const [showSideBar,setShowSideBar] = useState(false);
    
    return (
        <div className="border h-screen w-full">
            <div className={`backdrop-blur-lg border-2 border-gray-600 rounded-2xl md:overflow-hidden h-[100%] grid grid-cols-1 relative ${SelectedUser?'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]':'grid-cols-1 md:grid-cols-2'}`}>

                <SideBar/>
                <ChatContainer setShowSideBar={setShowSideBar}/>
                <RightSideBar showSideBar={showSideBar} setShowSideBar={setShowSideBar}/> 
            </div>
        </div>
    )
}