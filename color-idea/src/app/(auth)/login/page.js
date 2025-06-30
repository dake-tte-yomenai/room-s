"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../lib/firebase";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useSearchParams} from "next/navigation";

export default function LoginPage(){
    const router=useRouter();
    const params=useSearchParams();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const color1=params.get("color1");
    const color2=params.get("color2");

    const handleLogin=async(e)=>{
        e.preventDefault();
        try{
            const userCredential=await signInWithEmailAndPassword(auth,email,password);
            const user=userCredential.user;
            if(!user.emailVerified){
                alert("メールアドレス認証が完了していません。");
                return;
            }
            if(color1 && color2){
                router.push(`/result?color1=${encodeURIComponent(color1)}&color2=${encodeURIComponent(color2)}`)
            }
            else{
                router.push("/result");
            }
        }catch{
            alert("ログイン失敗");
        }
    };

    return(
        <div>
            <h1>ログイン</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                />
                <br/>
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                />
                <br/>
                <button type="submit">
                    ログインする
                </button>
            </form>
        </div>
    )
}