"use client";
import {useSearchParams} from "next/navigation";
import {useEffect,useState} from "react";
import {auth} from "../../(auth)/lib/firebase";
import styles from "./result.module.css";
import Link from "next/link";

export default function ResultPage(){
    const params=useSearchParams();

    const color1=params.get("color1");
    const color2=params.get("color2");

    const [images,setImages]=useState([]);
    const [uploading,setUploading]=useState(false);
    const [file,setFile]=useState(null);
    const [desc,setDesc]=useState("");
    const [user,setUser]=useState(null);

    const [profileExists,setProfileExists]=useState(false);

    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged(async (firebaseUser)=>{
            setUser(firebaseUser);
            if(firebaseUser){
                const res=await fetch(`/api/profile?uid=${firebaseUser.uid}`);
                if(res.ok){
                    setProfileExists(true);
                }else{
                    setProfileExists(false);
                }
            }else{
                setProfileExists(false);
            }
        });
        return ()=>unsubscribe();
    },[]);

    

    async function fetchImages(){
        if (!color1 || !color2) return;
        const [c1,c2]=[color1,color2].sort();
        const res=await fetch(`/api/outfits?color1=${encodeURIComponent(c1)}&color2=${encodeURIComponent(c2)}`);
        const data=await res.json();
        if(res.ok) setImages(data);
    }

    useEffect(()=>{
        console.log("color1:", color1, "color2:", color2);
        if (!color1 || !color2) return; 
        fetchImages();
    },[color1,color2]);

    return(
        <div>
            {images.length==0 && <p>該当するコーデ画像がありません</p>}
            <div className={styles.showImage}>
                {images.map((items,idx)=>(
                    <div key={idx} className={styles.loopPhoto}>
                        <Link href={`/detailImage?id=${items.id}`}>
                            <img src={items.image_url} alt={items.description} width={300} height={150} className={styles.hoverImage}/>
                            <div>いいね数:{items.likes}</div>
                        </Link>
                        <p>{items.description}</p>
                    </div>
                ))}
            </div>
            <a href="/home">色選択画面</a>
        </div>
    )
}
