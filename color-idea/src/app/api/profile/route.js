import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request){
    try{
        const body=await request.json();
        const {uid,user_name,icon_url,birthday}=body;

        const {data,error}=await supabase
            .from("profiles")
            .upsert([
                {uid,user_name,icon_url,birthday}  
            ],{onConflict:"uid"})
            .select("created_at")
            .single();

        if(error){
            return NextResponse.json({message:"登録失敗",error:error.message},{status:500});
        }

        return NextResponse.json({message:"登録成功",created_at:data?.created_at});
    }catch(error){
        return NextResponse.json({message:"登録失敗",error:error.message},{status:500});
    }
}

export async function GET(request){
    const {searchParams} =new URL(request.url);
    const uid =searchParams.get("uid");
    if(!uid){
        return NextResponse.json({message:"uidが必要です"},{status:400});
    }

    const {data,error}=await supabase
        .from("profiles")
        .select("*")
        .eq("uid",uid)
        .single();

    if(error || !data){
        return NextResponse.json({message:"取得失敗",error:error.message || "Not Found"},{status:404});
    }

    return NextResponse.json(data);
}