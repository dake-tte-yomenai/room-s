import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request){
    const {searchParams}=new URL(request.url);
    const uid=searchParams.get("uid");

    const {count:followerCount,error:followerError}=await supabase
        .from("follows")
        .select("*",{count:"exact",head:true})
        .eq("followed_uid",uid);

    const {count:followedCount,error:followedError}=await supabase
        .from("follows")
        .select("*",{count:"exact",head:true})
        .eq("follower_uid",uid);

    if(followerError || followedError){
        return NextResponse.json({
            follower:0,
            followed:0,
            error:(followerError?.message || "")+(followedError?.message)
        },{status:500});
    }

    return NextResponse.json({
        follower:followerCount ?? 0,
        followed:followedCount ?? 0
    });
}