import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext<any>(null);

export const ChatsProvider = ({children}:any)=>{

const [messages,setMessages]  = useState<any>([]);
const [users,setUsers]= useState([]);
const [SelectedUser,setSelectedUser] =useState<any>(null);
const [unseenMessages,setUnseenMessages]= useState<Record<string,number>>({});

const {socket,axios} = useContext(AuthContext);

//for getting users of sidebars
 
const getUsers = async()=>{
    try{
const {data} = await axios.get("/api/v1/message/users");
if(data.success){
    setUsers(data.filteredUsers);
    setUnseenMessages(data.unseenMessages);
}
    }catch(error:any){ 
        toast.error(error.message);

    }
}


//getting msgs of selected user

const getMessages = async (userId:any)=>{
try{
const {data}=await axios.get(`/api/v1/message/${userId}`);
if(data.success){
setMessages(data.messages);
setUnseenMessages((prev:any) => {
    const copy = { ...prev };
    delete copy[SelectedUser?._id];
    return copy;
  });
}
}
catch(error:any){
toast.error(error.message);
}
}

const sendMessage = async(messageData:any) =>{
try{
    const {data} = await axios.post(`/api/v1/message/send/${SelectedUser._id}`,messageData);

    if(data.success){
    setMessages((prev:any)=>[...prev,data.newMessage]);
    
    }else{
        toast.error(data.message);
    }

}catch(error:any){
    toast.error(error.message);
}
}

const subscribeToMessage = async()=>{
    if(!socket)return;
    socket.on("newMessage",(newMessage:any)=>{
        if(SelectedUser && newMessage.senderId===SelectedUser._id){
            newMessage.seen = true;
            setMessages((prev:any)=>
                [...prev,newMessage]
            );
            axios.put(`/api/v1/message/mark/${newMessage._id}`);
        }
        else{
            setUnseenMessages((prev:any)=>{
return({...prev,[newMessage.senderId]:prev[newMessage.senderId]?prev[newMessage.senderId]+1:1});
            })
        }
    })
}

const unSubscribeFromMessages = async()=>{
    if(socket) socket.off("newMessage");
}
useEffect(() => {
  subscribeToMessage();

  return () => {
    unSubscribeFromMessages();
  };
}, [socket, SelectedUser]);


  const  value={
messages,
users,
SelectedUser,
getUsers,
getMessages,
setMessages,
sendMessage,
setSelectedUser,
subscribeToMessage,
unSubscribeFromMessages,
unseenMessages,
setUnseenMessages
    }
    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}