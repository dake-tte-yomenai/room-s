import { NextResponse } from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request){
    const {searchParams} =new URL(request.url);
    const id=searchParams.get("id");
    const user_id=searchParams.get("user_id");
    
    if(!id){
        return NextResponse.json([],{status:400});
    }

    const {data,error}=await supabase
        .from("outfits")
        .select("*")
        .eq("id",id);

    if (error || !data || data.length ===0) {
        return NextResponse.json([], { status: 200 });
    }
    let likedByMe = false;
    if (user_id) {
        const { data: likeData } = await supabase
            .from("likes")
            .select("*")
            .eq("user_id", user_id)
            .eq("outfit_id", id);
        likedByMe = likeData && likeData.length > 0;
    }

    const imageWithLike = { ...data[0], likedByMe };
    return NextResponse.json([imageWithLike], { status: 200 });
}