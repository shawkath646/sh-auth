import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/config/firebase.config";
import { BrandDataType } from "@/types/types";


const getBrandData = cache(async() => {
    const brandingQuerySnapshot = await db.collection("brandingInfo").where("type", "==", "Parent").get();
    if (brandingQuerySnapshot.empty) return redirect("/error?code=M023");
    return brandingQuerySnapshot.docs[0].data() as BrandDataType;
})

export default getBrandData;