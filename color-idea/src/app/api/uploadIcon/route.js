import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request){
    const formData=await request.formData();
    const file=formData.get("file");
    const uid=formData.get("uid");

    if(!file || !uid){
        return NextResponse.json({message:"ファイルまたはuidがありません"},{status:400});
    }

    const fileName=`${uid}_${Date.now()}_${file.name}`;

    const {data,error}=await supabase.storage
        .from("icons")
        .upload(fileName,file.stream(),{
            contentType:file.type,
            upsert:true,
        });

    if(error){
        return NextResponse.json({message:"アップロード失敗",error:error.message},{status:500});
    }

    const {data:publicUrlData}=supabase.storage.from("icons").getPublicUrl(fileName);

    return NextResponse.json({url:publicUrlData.publicUrl});
}