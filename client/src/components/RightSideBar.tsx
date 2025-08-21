import { useContext } from "react";
import { assets } from "../assets/assets";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

export function RightSideBar({showSideBar,setShowSideBar}:any) {
  const { messages, SelectedUser } = useContext(ChatContext);
  const { onlineUsers, logout } = useContext(AuthContext);

  if (!SelectedUser) return null;

  return (
    <div className={`bg-[#8184B2]/10 text-white w-full h-screen md:block ${showSideBar?"block":"hidden"} `}>
        <span className="top-1 right-1 p-3 m-2 absolute cursor-pointer text-2xl font-semibold  bg-white/5 rounded-full"
        onClick={()=>{
            setShowSideBar(false);
        }}
        >
           X
        </span>
      {/* Profile header */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={SelectedUser?.profilePic || assets.avatar_icon}
          alt="profile_pic"
          className="w-20 h-20 rounded-full cursor-pointer object-cover object-center"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(SelectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {SelectedUser.fullName}
        </h1>
        <div className="text-sm font-medium bg-slate-700/40 w-full max-w-[250px] text-center p-2 rounded-xl overflow-hidden text-ellipsis">
          {SelectedUser.bio || "No bio set"}
        </div>
      </div>

      <hr className="border border-[#ffffff50] my-4" />

      {/* Media gallery */}
      <div className="px-5 text-xs flex-1 overflow-y-scroll ">
        <p className="mb-2">Media</p>
        <div className="grid grid-cols-2 gap-3 opacity-80 max-h-[50vh]">
          {messages
            .filter((m: any) => m.image)
            .map((message: any, index: number) => (
              <div
                key={index}
                onClick={() => window.open(message.image)}
                className="cursor-pointer rounded"
              >
                <img
                  src={message.image}
                  alt=""
                  className="h-full w-full rounded-md object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Logout button */}
      <div className="p-4">
        <button
          className="w-full bg-gradient-to-b from-purple-400 to-violet-600 text-white text-sm font-light py-2 rounded-full cursor-pointer"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
