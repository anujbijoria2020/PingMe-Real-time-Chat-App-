import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
console.log(backendUrl);
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // check user auth
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user)
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  // login
  const login = async (state:any, credentials: any) => {
    try {
      const { data } = await axios.post(`/api/v1/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // logout
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    if (socket) socket.disconnect();
    toast.success("Logged out successfully");
  };

  // update profile
  const updateProfile = async (body: any) => {
    try {
      const { data } = await axios.put("/api/v1/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // connect socket
  const connectSocket = (userData: any) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
