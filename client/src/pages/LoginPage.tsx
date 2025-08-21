import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

export function LoginPage(){

    const [currentState,setCurrentState] =useState<string>("Sign Up");
    const [fullName,setFullName]  = useState("");
    const[email,setEmail] = useState("");
    const [password,setPassword]= useState("");
    const [bio,setBio] = useState("Default Bio");
    const [isDataSubmitted,setIsDataSubmitted]= useState<boolean>();

 
    const {login} = useContext(AuthContext);

    function OnSubmitHandler(event:any){
event.preventDefault();
if(currentState==="Sign Up" && !isDataSubmitted){
    setIsDataSubmitted(true);
    return;
}

login(currentState==="Sign Up"?"signup":"login",{fullName,email,password,bio});

  }

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
         {/* left */}
       <div className="flex flex-col text-center">
          <img src={assets.logo_icon} alt="" 
         className="w-[min(30vw,250px)]"
         />
         <span className="text-white text-4xl font-semibold m-2 p-2">PingMe</span>
       </div>
          
         {/* right */}

         <form onSubmit={OnSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
    <h2 className="font-medium text-2xl flex justify-between items-center">{currentState}
      {isDataSubmitted &&(
          <img src={assets.arrow_icon} alt="" 
        className="cursor-pointer w-5" onClick={()=>{
            setIsDataSubmitted(false);
        }}/>
      )}
    </h2>

    {currentState==="Sign Up"  &&  !isDataSubmitted &&(
<input type="text" onChange={(e)=>{
    setFullName(e.target.value);
}}
className="p-2 border border-gray-500 rounded-md focus:outline-none"
placeholder="Full Name"
required
/>
    )}

    {!isDataSubmitted && (
<>
<input onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Email Adress"  required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>

<input onChange={(e)=>{
    setPassword(e.target.value)
}} type="password" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="password"/>
</>
    )}

{
    isDataSubmitted && currentState==="Sign Up" && (
 <textarea 
 onChange={(e)=>setBio(e.target.value)}
className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
rows={4} 
placeholder="Set Your Bio"
 ></textarea>
    )
}
<div className="flex items-center gap-2 text-sm text-gray-500">
    <input type="checkbox" required />
    <p>Agree to the terms of use & privacy policy.</p>
</div>

<button type="submit" className="py-3 bg-gradient-to-r from-purple-600 to-violet-400 text-white rounded-md cursor-pointer">
    {
        currentState==="Sign Up"?"Create Account":"Login Now"
    }
</button>

<div className="flex flex-col gap-2 text-center">
{currentState==="Sign Up"?(
    <p>Already have an account? <span className="font-medium text-blue-900 cursor-pointer"
    onClick={()=>{
        setCurrentState("Login");
        setIsDataSubmitted(false);
    }}
    >Login Here</span> </p>
):(
    <p>Create an Account <span className="font-medium text-blue-900 cursor-pointer"
    onClick={()=>{
        setCurrentState("Sign Up")
    }}
    >Click Here</span> </p>

)}
</div>
         </form>
        </div>
    )
}