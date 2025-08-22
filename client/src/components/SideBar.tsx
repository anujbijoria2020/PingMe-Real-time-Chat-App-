import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export function SideBar() {
  const navigate = useNavigate();
  const [open,setOpen] = useState(false);
  const {logout,onlineUsers}= useContext(AuthContext);

  const {SelectedUser,setSelectedUser,getUsers,users,unseenMessages,setUnseenMessages} = useContext(ChatContext);
  const [input,setInput]= useState<any>();

  const filteredUsers = input? users.filter((user:any)=>user.fullName.toLowerCase().includes(input.toLowerCase()
  )
):users;

useEffect(()=>{
getUsers();
},[onlineUsers])
  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        SelectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex mx-2">
            <img src={assets.logo_icon} alt="logo" className="max-w-8" />
          <span className="mx-3 text-lg font-semibold">PingMe</span>
          </div>
          <div className="relative py-2"
  onClick={() => setOpen(o => !o)}
>
  <img
    src={assets.menu_icon}
    alt="menu"
    className="max-h-5 cursor-pointer"
  />
  <div
    className={`absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 ${
      open ? "block" : "hidden"
    }`}
  >
    <p
      onClick={() => navigate("/profile")}
      className="cursor-pointer text-sm"
    >
      Edit Profile
    </p>
    <hr className="my-2 border-t border-gray-500" />
    <p
      className="cursor-pointer text-sm"
      onClick={logout}
    >
      Logout
    </p>
  </div>
</div>

        </div>
        <div
          className={`bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5 mb-5`}
        >
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            name=""
            onChange={(e:any)=>{
              setInput(e.target.value)
            }}
            id=""
            className="bg-transparent border-none outline-none text-white text-xs placeholder=[#c8c8c8] flex-1"
            placeholder="Search user..."
          />
        </div>
        <div className="flex flex-col">
          {filteredUsers.map((user:any, index:any) => {
            return (
              <div
                onClick={() => {
                  setSelectedUser(user);
                  setUnseenMessages((prev:any) => {
                    const copy = { ...prev };
                    delete copy[SelectedUser?._id];
                    return copy;
                  });
                }}
                key={index}
                className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm my-1 ${
                  SelectedUser?._id === user._id && "bg-[#282142]/50"
                }`}
              >
                <img
                  src={user.profilePic || assets.avatar_icon}
                  alt="profile_pic"
                  className="w-[35px] aspect-[1/1] rounded-full object-cover"
                />
                <div className="flex flex-col leading">
                  <p>{user.fullName}</p>
                  {onlineUsers.includes(user._id) ? (
                    <span className="text-green-400 text-xs">Online</span>
                  ) : (
                    <span className="text-neutral-400 text-xs">Offline</span>
                  )}
                </div>
                {unseenMessages[user._id]>0 && (
                  <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                    {unseenMessages[user._id]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
