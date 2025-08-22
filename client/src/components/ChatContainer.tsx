import { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { formatMessageTime } from "../libraries/utils";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export function ChatContainer({setShowSideBar}:any) {
  const scrollEnd = useRef<HTMLDivElement>(null);
  const { messages,SelectedUser, setSelectedUser,sendMessage,getMessages } = useContext(ChatContext);
  const {authUser,onlineUsers}  = useContext(AuthContext);
  const [Input,setInput] = useState("");

  const handleSendMessage = async(e:any)=>{
     e.preventDefault();
     if(Input.trim()==="")return null;
     await sendMessage({text:Input.trim()});
     setInput("");
     
    }

const handleSendImage = async(e:any)=>{
  const file = e.target.files[0];
  if(!file || !file.type.startsWith("image/")){
  toast.error("select an image file");
  return;}

  const reader = new FileReader();
  reader.onload = async()=>{
    await sendMessage({image:reader.result});
    e.target.value="";
  }
  reader.readAsDataURL(file);
  
}


useEffect(()=>{
if(SelectedUser){
  getMessages(SelectedUser._id);
}
},[SelectedUser?._id]);

useEffect(() => {
  if (scrollEnd.current && messages) {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);



return SelectedUser ? (
  <div className="h-full flex flex-col relative backdrop-blur-lg">
  {/* header */}
  <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
    <img
      src={SelectedUser?.profilePic || assets.avatar_icon}
      alt=""
      className="w-8 rounded-full object-cover aspect-[1/1] m-1 cursor-pointer"
    />
    <p
      className="flex-1 text-lg cursor-pointer text-white flex items-center gap-2"
      onClick={() => setShowSideBar(true)}
    >
      {SelectedUser?.fullName}
      {onlineUsers.includes(SelectedUser._id) && (
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
      )}
    </p>

    <img
      src={assets.arrow_icon}
      alt=""
      onClick={() => setSelectedUser(null)}
      className="md:hidden max-w-7 cursor-pointer"
    />
    <img src={assets.help_icon} alt="" className="w-7 mr-3" />
  </div>

  {/* messages (scrollable middle) */}
  <div className="flex-1 overflow-y-auto p-3 pb-20">
    {messages.map((message: any, index: number) => (
      <div
        key={index}
        className={`flex items-end gap-2 justify-end ${
          message.senderId !== authUser._id && "flex-row-reverse"
        }`}
      >
        {message.image ? (
          <img
            src={message.image}
            alt=""
            className="w-80 rounded-2xl p-2 border-lg cursor-pointer"
            onClick={() => window.open(message.image)}
          />
        ) : (
          <p
            className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
              message.senderId === authUser._id
                ? "rounded-br-none rounded-tl-none"
                : "rounded-bl-none rounded-tr-none"
            }`}
          >
            {message.text}
          </p>
        )}
        <div className="text-center text-xs">
          <img
            src={
              message.senderId === authUser._id
                ? authUser?.profilePic || assets.avatar_icon
                : SelectedUser?.profilePic || assets.avatar_icon
            }
            alt=""
            className="w-7 rounded-full aspect-[1/1] object-cover"
          />
          <p className="text-gray-500">
            {formatMessageTime(message.createdAt)}
          </p>
        </div>
      </div>
    ))}
    <div ref={scrollEnd}></div>
  </div>

  {/* input (fixed at bottom) */}
  <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-slate-900">
    <div className="flex-1 flex items-center bg-slate-800 px-3 rounded-full">
      <input
        value={Input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage(e);
        }}
        type="text"
        placeholder="Send a message"
        className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
      />
      <input
        onChange={handleSendImage}
        type="file"
        id="image"
        accept="image/png,image/jpeg"
        hidden
      />
      <label htmlFor="image">
        <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" />
      </label>
    </div>
    <img
      onClick={handleSendMessage}
      src={assets.send_button}
      alt=""
      className="w-7 cursor-pointer"
    />
  </div>
</div>

  ) : (
    <div className="hidden md:flex  flex-col justify-center items-center text-white ">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-xl font-medium text-white">chat anytime,anywhere</p>
    </div>
  );
}
