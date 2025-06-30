import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request){
    const {searchParams}=new URL(request.url);
    const uid=searchParams.get("uid");

    const {count,error}=await supabase
        .from("outfits")
        .select("*", { count: "exact", head: true })
        .eq("uid",uid);

    if(error){
        return NextResponse.json({count:0,error:error.message},{status:200});
    }
    return NextResponse.json({count:count ?? 0});
}