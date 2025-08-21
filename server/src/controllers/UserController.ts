import { User } from "../models/User.js";
import { LoginSchemaValidation, SignUpSchemaValidation } from "../lib/Validators.js";
import { DoComparison, DoHash } from "../lib/Hash.js";
import { GenerateToken } from "../lib/JWTAuth.js";
import cloudinary from "../lib/cloudinary.js";

export const UserSignUp = async (req: any, res: any) => {
  const { fullName, email, password, bio } = req.body;

  const Validated = SignUpSchemaValidation.safeParse({
    fullName,
    password,
    email,
    bio,
  });

  if (!Validated.success) {
    return res.status(400).json({
      message: Validated.error,
      success: false,
    });
  }

  try {
    const response = await User.findOne({ email });
    if (response) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await DoHash(password, 10);

    const UserSaved = await User.create({
      fullName,
      password: hashedPassword,
      email,
      bio,
    });

    await UserSaved.save();

    const token = GenerateToken(UserSaved._id.toString());

    res.status(200).json({
        message:"Account Created Successfully",
        token:token,
        success:true,

    })
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};


export const UserLogin =async (req:any,res:any)=>{
const {email,password} = req.body;

const Validated = LoginSchemaValidation.safeParse({email,password});
if(!Validated.success){
    return res.status(400).json({
        message:Validated.error,
        success:false,
    })
}

try{
    const UserExists = await User.findOne({email});
if(!UserExists){
    return res.status(400).json({
        message:"User does Not Exists",
        success:false
    })
}

const isPasswordCorrect = DoComparison(password,UserExists.password);

if(!isPasswordCorrect){
    return res.status(400).json({
        message:"Password did not matched ,Try Again!",
        success:false
    })
}

const token = GenerateToken(UserExists._id.toString());

return res.status(200).json({
    message:"Login Successgull",
    token:token,
    success:true
})
}
catch(error:any){
    console.log(error);
    return res.status(500).json({
        message:error.message||error,
        success:false
    })
}
}



export const checkAuth = (req:any,res:any)=>{
    res.json({
        success:true,
        user:req.user
    });
}

export const updateProfile = async(req:any,res:any)=>{
try{
const {profilePic,bio,fullName} = req.body;
const userId = req.user._id;
let updatedUser;

if(!profilePic){
  updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
}
else{
  const upload = await cloudinary.uploader.upload(profilePic);

  updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName,profilePic:upload.secure_url},{new:true});
}
res.status(200).json({
  message:"User Updated successfully",
  user:updatedUser,
  success:true
})
}catch(error){
console.log(error);
return res.status(500).json({
  message:"internal server error",
  success:true
})
}
}