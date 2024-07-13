import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";
import { redirect } from "next/navigation";

export const verifySession=cache(async()=> {

    try {
        const cookieVal=cookies().get('session')?.value;
        const sessionVal=await decrypt(cookieVal);

        if(!sessionVal?.authId) redirect('/');
        
        return sessionVal;
    } catch (error) {
        console.log(error);
    }
})

export const deleteSession=cache(()=> {
    cookies().delete('session');
})
