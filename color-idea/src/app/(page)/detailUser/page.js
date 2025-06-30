"use client";
import {useState,useEffect} from "react";
import {auth} from "../../(auth)/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import styles from "./detailUser.module.css";

export default function DetailUserPage(){
    const router=useRouter();

    const [user,setUser]=useState(null);
    
    const [isopen,setIsopen]=useState(false);
    const [file,setFile]=useState(null);
    const [desc,setDesc]=useState("");
    const [uploading,setUploading]=useState(false);

    const colors = [
        '#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50', '#009688',
        '#00bcd4', '#2196f3', '#3f51b5', '#9c27b0', '#e91e63', '#795548',
    ];
    const [c1,setC1]=useState("");
    const [c2,setC2]=useState("");
    const [profileData,setProfileData]=useState(null);
    const [count,setCount]=useState(0);
    const [follower, setFollower] = useState(0);
    const [followed, setFollowed] = useState(0);

    useEffect(() =>{
        const unsubscribe=auth.onAuthStateChanged(async (firebaseUser)=>{
            setUser(firebaseUser);
            if(firebaseUser){
                const res=await fetch(`/api/profile?uid=${firebaseUser.uid}`);
                if(res.ok){
                    const data=await res.json();
                    setProfileData(data);
                }
            }
        });
        return ()=>unsubscribe();
    },[]);

    const toggleMenu=()=>{
        setIsopen(!isopen);
    };

    async function uploadToCloudinary(file){
        const formData=new FormData();
        formData.append("file",file);
        formData.append("upload_preset","unsigned_upload");
        formData.append("folder","heic-uploads");

        const res=await fetch("https://api.cloudinary.com/v1_1/dow5pdusq/image/upload",{
            method:"POST",
            body:formData,
        });

        if (!res) throw new Error("Cloudinaryへのアップロード失敗");

        const data=await res.json();

        const jpegUrl=data.secure_url.replace('/upload/','/upload/f_auto,q_auto/');
        return jpegUrl;
    }

    async function handleUpload(e) {
        e.preventDefault();
        if(!file || !c1 || !c2) return;
        setUploading(true);
        try{
            const imageJpegUrl=await uploadToCloudinary(file);

            const res=await fetch("/api/outfits",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    uid:user.uid,
                    color1:[c1,c2].sort()[0],
                    color2:[c1,c2].sort()[1],
                    image_url:imageJpegUrl,
                    description:desc,
                })
            })
            const result=await res.json();
            if (!res.ok) throw new Error(result.error || "登録失敗");

            alert("アップロード完了！");
            setFile(null);
            setDesc("");
            setC1("");
            setC2("");
            setIsopen(false);
        }catch(err){
            alert('アップロード失敗'+ (err.message || JSON.stringify(err)));
        }
        setUploading(false);
    }

    async function countUpload(){
        if(!profileData) return;
        const res=await fetch(`/api/countUpload?uid=${encodeURIComponent(profileData.uid)}`);
        const data=await res.json();
        setCount(data.count ?? 0);
    }

    const toChangeDetail=(e)=>{
        e.preventDefault();
        router.push('/changeDetail');
    }

    async function countFollowerFollowed(){
        if(!profileData) return;
        const res=await fetch(`/api/countFollowerFollowed?uid=${encodeURIComponent(profileData.uid)}`);
        const data=await res.json();
        setFollower(data.follower ?? 0);
        setFollowed(data.followed ?? 0);
    }

    useEffect(()=>{
        countUpload();
        countFollowerFollowed();
    },[profileData]);

    if(!user){
        return <p><Link href="/login">ログイン</Link>してください</p>;
    };

    return(
        <div className={styles.all}>
            {user || profileData?(
                <div className={styles.allBox}>
                    <div className={styles.displayIcon}>
                        {profileData && profileData.icon_url?
                            <Image src={profileData.icon_url} alt={""} width={200} height={200}></Image>:null
                        }
                    </div>
                    <div className={styles.detailUser}>
                        <div>{profileData ? profileData.user_name : ""}</div>
                        <div>投稿: {count} 件</div>
                        <div>フォロワー： {follower}人　フォロー： {followed}人</div>
                        <br/>
                        <div>
                            <button onClick={toChangeDetail}>ユーザー情報編集</button>
                        </div>
                    </div>
                </div>
            ):(
                <div></div>
            )}

            <div className={styles.addButton} onClick={toggleMenu}>
                ＋
                {isopen &&(
                    <div className={styles.bg} onClick={()=>setIsopen(false)}>
                        <div className={styles.addPage} onClick={e => e.stopPropagation()}>
                            <button className={styles.closeButton} onClick={()=>setIsopen(false)}>
                                ×
                            </button>
                            <h3>コーデ追加</h3>
                            <form onSubmit={handleUpload}>
                                <div className={styles.colorButton}>
                                    {colors.map((color,idx) => (
                                        <button
                                            type="button"
                                            key={color}
                                            className={styles.colorBox}
                                            style={{
                                                background: color,
                                                border: c1 === color || c2===color? "3px solid #000" : "1px solid #ccc",
                                                opacity:c1===color || c2===color ? 1:0.8,
                                            }}
                                            onClick={() =>{
                                                if (c1 === color) {
                                                    setC1("");
                                                } else if (c2 === color) {
                                                    setC2("");
                                                } else if (!c1) {
                                                    setC1(color);
                                                } else if (!c2) {
                                                    setC2(color);
                                                } else {
                                                }
                                            }}
                                            disabled={c1 !== "" && c2 !== "" && c1 !== color && c2 !== color}
                                        />
                                    ))}
                                </div>
                                <div style={{marginBottom:"1rem"}}>
                                    選択中: 
                                    <span style={{marginLeft:"0.5rem", color: c1}}>{c1 || "未選択"}</span>
                                    <span style={{marginLeft:"1rem", color: c2}}>{c2 || "未選択"}</span>
                                </div>                      
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e=>setFile(e.target.files[0])}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="説明（任意）"
                                    value={desc}
                                    onChange={e=>setDesc(e.target.value)}
                                />
                                <button type="submit" disabled={uploading}>
                                    {uploading ? "アップロード中・・・":"追加"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}