
import "server-only"
import { SessionParams } from "../constants/types"
import {SignJWT,jwtVerify} from 'jose'

const secret=process.env.SESSION_SECRET || "newSecret"
const secretKey=new TextEncoder().encode(secret);

export async function encrypt(payload:SessionParams) {
  return new SignJWT(payload)
    .setProtectedHeader({alg:'HS256'})
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey)
}

export async function decrypt(session:string | undefined="") {

  try {
    const {payload}=await jwtVerify(session,secretKey,{algorithms:['HS256']})
    return payload;
  } catch (error) {
    console.log(error);
  }
}

