import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request){
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if(!uid){
        return NextResponse.json({message:"投稿者はいません"});
    }

    const {data}=await supabase
        .from("profiles")
        .select("*")
        .eq("uid",uid)
        .single();

    if(!data){
        return NextResponse.json({message:"名前が見つかりません"});
    }

    return NextResponse.json(data);
}