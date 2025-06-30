"use client";
import {useSearchParams} from "next/navigation";
import {useState,useEffect} from "react";
import {auth} from "../../(auth)/lib/firebase";

export default function DetailImage(){
    const params=useSearchParams();

    const [user, setUser] = useState(null);
    const [images,setImages]=useState(null);
    const [uploadUser,setUploadUser]=useState(null);
    const id=params.get("id");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    async function fetchImages(){
        if(id){
            const res=await fetch(`/api/detailImage?id=${encodeURIComponent(id)}&user_id=${user.uid}`);
            const data=await res.json();
            if(res.ok &&data.length>0) setImages(data[0]);
            else setImages(null);
        }else{
            alert("idがありません")
        }
        
    }
    
    const like=async()=>{
        setImages(prev => prev ? { ...prev, likedByMe: !prev.likedByMe } : prev);

        const res=await fetch("/api/likes",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:images.id,user_id:user.uid}),
            
        });
        if (res.ok){
            await fetchImages();
        }
    }

    async function GetUploadUser(){
        const res = await fetch(`/api/getName?uid=${images.uid}`);
        const data = await res.json();
        setUploadUser(data ?? "");
    }
    useEffect(()=>{
        if(!id || !user?.uid) return;
        fetchImages();
    },[id,user?.uid]);

    useEffect(()=>{
        if(!images || !images.uid) return;
        GetUploadUser();
    },[images])

    return(
        <div>
            {!images ?(
                <div>画像がありません。画像の詳細を表示させたいのであればログイン・サインインしてください。</div>
            ):(
                <div>
                    <img src={images.image_url} alt={images.description} width={400} />
                    <p>{images.description}</p> 
                    <button 
                        onClick={like}
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                        <span style={{ color: images.likedByMe ? "red" : "#888", fontSize: "2rem" }}>❤</span>
                    </button>
                    <div>いいね数:{images.likes}</div>
                    <div>
                        <img src={uploadUser?.icon_url} alt="ユーザーアイコン" width={30} height={30} />
                        :{uploadUser?.user_name ??""}</div>
                </div>

            )}
        </div>
    )
}