import bcrypt, { hash } from 'bcryptjs'

export const DoHash = async (password:string,salts:number):Promise<string>=>{
    const generatedSalt = await bcrypt.genSalt(salts);
    const hashedPassword = await bcrypt.hash(password,generatedSalt);
    return hashedPassword;
}

export const DoComparison = async(hashedPassword:string,password:string)=>{
    const res = await bcrypt.compare(hashedPassword,password);
    return res;
}