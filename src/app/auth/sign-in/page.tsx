import { Metadata } from "next";
import { redirect } from "next/navigation";
import { PagePropsType } from "@/types/gettedUserDataType";
import pageValidation from "@/lib/pageValidation";
import SignInBox from "@/components/sign-in/SignInBox";
import bgBanner from "@/assets/background_signin.jpg";


export const metadata: Metadata = {
  title: "Sign in"
}

export default async function Page(props: PagePropsType) {

  const { stockAppData, callbackUrl, serverSession } = await pageValidation(props);

  if (serverSession) redirect(`/auth/user-info?${callbackUrl}`);

  return (
    <main style={{ backgroundImage: `url(${bgBanner.src})` }} className="min-h-screen w-full bg-cover bg-center">
      <div className="dark:bg-black dark:bg-opacity-50">
        <div className="min-h-screen container mx-auto flex items-center justify-center">
          <SignInBox stockAppData={{ name: stockAppData.data.app_name, icon: stockAppData.data.image }} callbackUrl={callbackUrl}  />
        </div>
      </div>

      <footer className="absolute bottom-2 w-full z-30">
        <p className="text-center text-white dark:text-gray-200 ">{stockAppData.data?.bottomBranding}</p>
      </footer>
    </main>
  );
}
  