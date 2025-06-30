import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request){
    const {id,user_id}=await request.json();
    if (!id || !user_id) return NextResponse.json({error:"no id or user_id"},{status:400});

    const {data:likeData}=await supabase
        .from("likes")
        .select("*")
        .eq("user_id",user_id)
        .eq("outfit_id",id);

    
    if (likeData&&likeData.length>0){

        await supabase
            .from("likes")
            .delete()
            .eq("user_id", user_id)
            .eq("outfit_id", id);

        const { data: outfitData } = await supabase
            .from("outfits")
            .select("likes")
            .eq("id", id)
            .single();
        
        const currentLikes=outfitData?.likes ?? 0;

        await supabase
            .from("outfits")
            .update({likes:Math.max(currentLikes - 1,0)})
            .eq("id",id);

        return NextResponse.json({liked:false});
    }else{

        await supabase
            .from("likes")
            .insert([{user_id,outfit_id:id}]);

        const {data:outfitsData2}=await supabase
            .from("outfits")
            .select("likes")
            .eq("id",id)
            .single();

        const currentLikes2=outfitsData2?.likes ?? 0;
        
        await supabase
            .from("outfits")
            .update({likes:currentLikes2 + 1})
            .eq("id",id);

        return NextResponse.json({liked:true});
    }
}