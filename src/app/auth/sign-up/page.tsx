import { Metadata } from "next";
import { redirect } from "next/navigation";
import pageValidation from "@/lib/pageValidation";
import RegistrationBox from "@/components/sign-up/RegistrationBox";
import { PagePropsType } from "@/types/gettedUserDataType";

export const metadata: Metadata = {
    title: "Sign up"
  }

export default async function Page(props: PagePropsType) {

    const { stockAppData, callbackUrl, serverSession } = await pageValidation(props);

    if (serverSession && !serverSession.user.newUser) redirect(`/auth/user-info?${callbackUrl}`);

    return (
        <main  className="min-h-screen w-full bg-cover bg-center bg-gradient-to-bl from-indigo-700 via-violet-700 to-pink-600 relative">
            <div className="dark:bg-black dark:bg-opacity-50">
                <div className="container mx-auto flex items-center justify-center min-h-screen">
                    <RegistrationBox stockAppData={{ name: stockAppData.data.app_name, icon: stockAppData.data.image }} callbackUrl={callbackUrl}  />
                </div>
            </div>

            <footer className="absolute bottom-2 w-full z-30">
                <p className="text-center text-gray-500 dark:text-gray-200 lg:text-gray-200">{stockAppData.data?.bottomBranding}</p>
            </footer>
        </main>
    );
}