import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request){
    try{
        const body=await request.json();
        const {uid,color1,color2,image_url,description}=body;

        const {data,error}=await supabase
            .from("outfits")
            .insert([{uid,color1,color2,image_url,description}])
            .select("*")
            .single();

        if(error){
            return NextResponse.json({message:"登録失敗",error:error.message},{status:500});
        }

        return NextResponse.json({message:"登録成功",data});
    }catch(error){
        return NextResponse.json({message:"登録失敗",error:error.message},{status:500});
    }
}

export async function GET(request){
    const {searchParams} =new URL(request.url);
    const color1=searchParams.get("color1");
    const color2=searchParams.get("color2");

    if(!color1 || !color2){
        return NextResponse.json({message:"二色選んでください"},{status:400});
    }

    const [c1,c2]=[color1,color2].sort();

    const {data,error}=await supabase
        .from("outfits")
        .select("*")
        .eq("color1",c1)
        .eq("color2",c2);

    if(error){
        return NextResponse.json({message:"取得失敗",error:error.message},{status:500});
    }

    return NextResponse.json(data);
}