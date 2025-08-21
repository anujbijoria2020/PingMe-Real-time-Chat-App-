import jwt from "jsonwebtoken";
import "dotenv/config";


export const GenerateToken = (userId: string): string => {
    if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

  const token = jwt.sign(
    {userId }, 
    process.env.JWT_SECRET, 
     { expiresIn: "7d" }
  );

  return token;
};
