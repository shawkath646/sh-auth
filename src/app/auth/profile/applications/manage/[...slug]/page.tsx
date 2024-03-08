import type { Metadata } from 'next';
import Link from "next/link";
import { redirect } from "next/navigation";
import getAppData from "@/actions/database/getAppData";
import ManageBox from "./ManageBox";
import DeleteButton from "./DeleteButton";
import timeStampToDate from "@/utils/timeStampToDate";
import { IoIosArrowBack } from "react-icons/io";

export const metadata: Metadata = {
    title: 'Modify application',
}

export default async function Page({ params }: { params: { slug: string } }) {

    if (!params.slug.length) redirect("/error?code=No slug");
    const appData = await getAppData(params.slug[0]);

    appData.createdOn = await timeStampToDate(appData.createdOn);
    if (appData.inactiveUntil) appData.inactiveUntil = await timeStampToDate(appData.inactiveUntil);

    return (
        <main className="min-h-screen bg-white dark:bg-black text-black dark:text-gray-200 w-full">
            <div className="container mx-auto p-5 2xl:px-0">
                <div className="flex items-center space-x-4 mb-5">
                    <Link href="/auth/profile/applications">
                        <IoIosArrowBack size={24} />
                    </Link>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-thin">{appData.appName}</h2>
                </div>
                <ManageBox appData={appData} />
                <section className="mt-10">
                    <p className="text-lg lg:text-xl xl:text-2xl">Others</p>
                    <div className="mt-8 lg:flex items-center justify-between space-y-3">
                        <div className="max-w-[600px]">
                            <p className="text-red-500">Delete application</p>
                            <p className="text-gray-500 text-sm">Deleting this application will permanently erase all associated data and cannot be restored later. OAuth functionality will cease immediately, and any code or library related to this website used in your application will restrict your access to the website.</p>
                        </div>
                        <DeleteButton appId={appData.id} appName={appData.appName} imageUrl={appData.appIcon} />
                    </div>
                </section>
            </div>
        </main>
    );
}