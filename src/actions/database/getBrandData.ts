"use server";
import { redirect } from "next/navigation";
import { db } from "@/config/firebase.config";
import { BrandDataType } from "@/types/types";

export default async function getBrandData() {
    const brandingQuerySnapshot = await db.collection("brandingInfo").where("type", "==", "Parent").get();
    if (brandingQuerySnapshot.empty) return redirect("/error?code=");
    return brandingQuerySnapshot.docs[0].data() as BrandDataType;
}