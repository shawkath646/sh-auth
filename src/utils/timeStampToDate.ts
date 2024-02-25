"use server";
import { TimestampFieldValue } from "@/types/types";
import { Timestamp } from "firebase-admin/firestore";

export default async function timeStampToDate(fieldValue: TimestampFieldValue | Timestamp | Date): Promise<Date> {
    if (fieldValue instanceof Date) return fieldValue;
    if (fieldValue instanceof Timestamp) return fieldValue.toDate();
    const timestamp = new Timestamp(fieldValue._seconds, fieldValue._nanoseconds);
    return timestamp.toDate();
};
