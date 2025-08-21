export function formatMessageTime(date:any){
const result:any =  new Date(date).toLocaleTimeString("en-Us",{
    hour:"2-digit",
    minute:"2-digit",
    hour12:true,
})
return result;
}