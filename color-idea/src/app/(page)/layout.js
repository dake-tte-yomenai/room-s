"use client";
import {useState,useEffect} from "react";
import Link from "next/link"
import styles from "./layout.module.css";
import {signOut} from "firebase/auth";
import {auth} from "../(auth)/lib/firebase";
import {useRouter} from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function PageLayout({children}){
    const router=useRouter();
    const params = useSearchParams();
    const color1 = params.get("color1");
    const color2 = params.get("color2");

    const [isopen,setIsopen]=useState(false);
    const [user,setUser]=useState(null);
    const [iconUrl,setIconUrl]=useState("");
    const [userName,setUserName]=useState("");
    
    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged(async (firebaseUser)=>{
            setUser(firebaseUser);
            if(firebaseUser){
                const res=await fetch(`/api/profile?uid=${firebaseUser.uid}`);
                if(res.ok){
                    const data=await res.json();
                    setIconUrl(data.icon_url || "");
                    setUserName(data.user_name);
                }else{
                    setIconUrl("");
                }
            }else{
                setIconUrl("")
            }
        });
        return ()=>unsubscribe();
    },[]);
    

    const toggleMenu=()=>{
        setIsopen(!isopen);
    };

    const handleLogout=async()=>{
        try{
            await signOut(auth);
            alert("ログアウトしました")
        }catch(error){
            alert("ログアウトできません");
        }
    }
    const handleLogin=(e)=>{
        e.preventDefault();
        if (!color1 || !color2){
            router.push("/login");
        }else{
            router.push(`/login?color1=${encodeURIComponent(color1)}&color2=${encodeURIComponent(color2)}`);
        }
    }

    const handleSignUp=()=>{
        if (!color1 || !color2){
            router.push("/signup");
        }else{
            router.push(`/signup?color1=${encodeURIComponent(color1)}&color2=${encodeURIComponent(color2)}`);
        }
    }

    const routerDetailUser=()=>{
        if(color1 && color2){
            router.push(`/detailUser?color1=${encodeURIComponent(color1)}&color2=${encodeURIComponent(color2)}`)
            return;
        }
        router.push("/detailUser");
    }

    return(
        <div>
            <header className={styles.header}>
                <div className={styles.left}>

                </div>
                <div className={styles.right}>
                    <div className={styles.one} onClick={routerDetailUser}>
                        {!user || !iconUrl ?(
                            <div className={styles.Icon}>
                                <Image src="/1280.jpg" alt="未設定アイコン" width={30} height={30} className={styles.pic}/>
                            </div>
                        ):(
                            <div className={styles.Icon}>
                                <Image src={iconUrl} alt="ユーザーアイコン" width={30} height={30} className={styles.pic}/>
                                <div className={styles.userName}>　{userName}　</div>
                            </div>
                        )}
                    </div>
                    <div className={styles.two}>
                        <div className={styles.menuIcon} onClick={toggleMenu}>
                            🍔
                            {isopen && (
                                <div className={styles.dropdown}>
                                    <Link href="/home">色選択</Link>
                                    <button onClick={handleLogin} className={styles.Button}>
                                        ログイン
                                    </button>
                                    <button onClick={handleSignUp} className={styles.Button}>
                                        サインアップ
                                    </button>
                                    <button onClick={handleLogout} className={styles.Button}>
                                        ログアアウト
                                    </button>
                                </div>   
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}