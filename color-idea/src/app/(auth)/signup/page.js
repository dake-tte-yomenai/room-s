"use client";
import {useState} from "react";
import {createUserWithEmailAndPassword,sendEmailVerification} from "firebase/auth";
import {auth} from "../lib/firebase";
import {useRouter} from "next/navigation";

export default function SignupPage(){
    const router=useRouter();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSignup=async(e)=>{
        e.preventDefault();
        try{
            const userCredential=await createUserWithEmailAndPassword(auth,email,password);
            const user=userCredential.user;
            await sendEmailVerification(user);
            alert("登録成功しました。認証メールを確認してください。");
            router.push("/login");
        }catch(error){
            alert("登録失敗"+(error.message || json.stringify(error)));
        }
    };

    return(
        <div>
            <h1>ユーザー登録</h1>
            <form onSubmit={handleSignup}>
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
                    登録する
                </button>
            </form>
            <div>
                <p>ログインは<a href="/login">こちら</a>から</p>
            </div>
        </div>
    )
}