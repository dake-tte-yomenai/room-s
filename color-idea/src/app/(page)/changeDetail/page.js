"use client";
import {useState,useEffect,useCallback} from "react";
import {auth} from "../../(auth)/lib/firebase";
import Image from "next/image";
import Cropper from 'react-easy-crop';

export default function ChangeDetail(){
    const [profile,setProfile]=useState({
            user_name:"",
            icon_url:"",
            birthday:"",
            created_at:"",
        });
    const [iconFile,setIconFile]=useState(null);
    const [user,setUser]=useState(null);
    const [profileData,setProfileData]=useState(null);

    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.readAsDataURL(file);
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImg = async () => {
        const image = new window.Image();
        image.src = imageSrc;
        await new Promise((resolve) => { image.onload = resolve; });
        const canvas = document.createElement('canvas');
        const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        size,
        size,
        0,
        0,
        size,
        size
        );
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                setIconFile(new File([blob], "icon.png", { type: "image/png" }));
                setProfile((p) => ({ ...p, icon_url: canvas.toDataURL("image/png") }));
                resolve();
            }, "image/png");
        });
    };


    const handleSubmit=async(e)=>{
        e.preventDefault();
        let iconUrl=profile.icon_url;

        if(iconFile && user){
            const formData=new FormData();
            formData.append("file",iconFile);
            formData.append("uid",user.uid);
            const uploadRes=await fetch("/api/uploadIcon",{
                method:"POST",
                body:formData,
            });
            if(uploadRes.ok){
                const {url}=await uploadRes.json();
                iconUrl=url;
            }
        }

        if(user){
            const res=await fetch("/api/profile",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    uid:user.uid,
                    user_name:profile.user_name,
                    icon_url:iconUrl,
                    birthday:profile.birthday,
                }),
            });
            if(res.ok){
                alert("プロフィール情報を更新しました！");
                const data=await res.json();
                setProfile((p)=>({...p,created_at:data.created_at || p.created_at}));
            }else{
                alert("更新失敗");
            }
        }
    };
    return(
        <div>
            <h2>ユーザー情報編集</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="ユーザーネーム"
                    value={profile.user_name}
                    onChange={(e)=>setProfile(p=>({...p,user_name:e.target.value}))}
                />
                <input
                    type="date"
                    placeholder="生年月日"
                    value={profile.birthday}
                    onChange={(e)=>setProfile(p=>({...p,birthday:e.target.value}))}
                />
                <input type="file" accept="image/*" onChange={handleIconChange} />
                {imageSrc && (
                    <div style={{ position: 'relative', width: 300, height: 300 }}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                    </div>
                )}
                <button onClick={getCroppedImg}>この位置で切り取る</button>
                {profile.icon_url &&(
                    <div>
                        <Image src={profile.icon_url} alt="アイコン" width={80} height={80} style={{borderRadius:"50%"}}/>
                    </div>
                )}
                <div>作成日時:{profile.created_at ? new Date(profile.created_at).toLocaleString():""}</div>
                <button type="submit">
                    保存
                </button>  
            </form>
        </div>
    )
}