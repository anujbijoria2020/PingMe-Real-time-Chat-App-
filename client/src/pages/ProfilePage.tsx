import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

export function ProfilePage() {
    const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState<File>();
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);


  async function OnSubmitHandler(e: any) {
    e.preventDefault();
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ fullName: name, bio, profilePic: base64Image });
      navigate("/");
      return;
    };
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center ">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={OnSubmitHandler}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3>Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => {
                setSelectedImage(e.target.files?.[0]);
              }}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${selectedImage && "rounded-full"}`}
            />
            Upload Profile Image
          </label>
          <input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            required
            placeholder="Your Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Write Your Bio"
          ></textarea>

          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-purple-600 to-violet-400 text-white rounded-md cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          className={`max-w-44 aspect-[1/1] rounded-full mx-10 max-sm:mt-10`}
          src={ authUser.profilePic||assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
}
