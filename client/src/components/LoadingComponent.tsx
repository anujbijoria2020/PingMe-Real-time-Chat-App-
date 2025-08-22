import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[url('/backgroundImage.jpg')] bg-cover">
      <div className="backdrop-blur-lg bg-black/40 border border-gray-600 rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center gap-3 h-100 w-300">
        <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
        <p className="text-gray-200 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
