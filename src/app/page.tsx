import Link from "next/link";
import Image from "next/image";
import CopierButton from "@/components/universel/CopierButton";
import getAppData from "@/actions/database/getAppData";
import getBrandData from "@/actions/database/getBrandData";
import { FaCheckCircle } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import homeCover from "@/assets/home_cover.jpg"



export default async function Home() {

  const appId = process.env.SHAS_APP_ID as string;
  const appData = await getAppData(appId);
  const brandData = await getBrandData();

  return (
    <main className="min-h-screen w-full bg-white text-black dark:text-gray-200 dark:bg-black">
      <div className="relative">
        <Image src={homeCover.src} alt="Home page cover" fill priority className="object-cover object-center lg:rounded" />
        <header className="pt-5 z-20 relative p-3 lg:p-6 bg-black/40 lg:h-[500px]">
          <div className="container mx-auto lg:pt-10">
            <div className="flex items-center space-x-2">
              {appData.appIcon && <Image src={appData.appIcon} alt={`${appData.appName} icon`} height={30} width={30} />}
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white dark:text-gray-200">{appData.appName}</p>
            </div>
            <p className="uppercase tracking-wide font-semibold text-blue-500 ml-10">Fast | Simple | Secured </p>
            <div className="mt-10 grid lg:grid-cols-2 gap-5">
              <section className="space-y-3 text-white dark:text-gray-200">
                <p className="lg:w-[400px] mx-auto">Create your free account today!</p>
                <Link href="/sign-up" className="block lg:w-[400px] mx-auto text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign up</Link>
              </section>
              <section className="space-y-3 text-white dark:text-gray-200">
                <p className="lg:w-[400px] mx-auto">Already joined us?</p>
                <Link href="/sign-in" className="block lg:w-[400px] mx-auto text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</Link>
              </section>
            </div>
            <p className="text-sm mt-5 lg:mt-10 lg:ml-10 max-w-[600px] text-white dark:text-gray-200">The SH Authentication System is a web application designed to streamline user access across SH CloudBurst Labs' suite of applications. By implementing Single Sign-On (SSO) functionality, users can log in once with a single account and gain access to all associated applications seamlessly. This centralized authentication approach significantly reduces user inconvenience and eliminates the need for multiple login credentials, thereby enhancing user experience and minimizing potential login-related issues.</p>
          </div>
        </header>
      </div>
      <div className="container mx-auto">
        <div className="p-5 lg:p-0">
          <p className="text-blue-500 text-lg md:text-xl lg:text-2xl lg:mt-10  md:mt-8 mt-5 font-medium text-center">NPM Package (Only for NextJS 13+)</p>
          <section className="mt-8 grid lg:grid-cols-2">
            <div className="mx-auto text-center">
              <h3 className="mb-4 text-lg lg:text-2xl">SHAS App Controller</h3>
              <code className="p-3 bg-gray-200 dark:bg-gray-800 rounded inline-flex space-x-2 lg:space-x-3 text-sm lg:text-base items-center">
                <span>$</span>
                <span>npm i </span>
                <span className="text-amber-700 dark:text-amber-500">shas-app-controller</span>
                <CopierButton text="npm i --save-dev sh-authentication-system" className="hover:text-gray-700 dark:hover:text-gray-400 transition-all" />
              </code>
              <div className="my-4">
                <Link href="https://www.npmjs.com/package/shas-app-controller" className="text-violet-500 bg-violet-600/30 px-3 py-2 rounded hover:text-white hover:bg-violet-600 transition-all dark:hover:text-gray-200">Read docs</Link>
              </div>
            </div>
            <div className="mx-auto text-center">
              <h3 className="mb-4 text-lg lg:text-2xl">CloudBurst Lab Provider</h3>
              <code className="p-3 bg-gray-200 dark:bg-gray-800 rounded inline-flex space-x-2 lg:space-x-3 text-sm lg:text-base items-center">
                <span>$</span>
                <span>npm i </span>
                <span className="text-amber-700 dark:text-amber-500">next-auth-provider-cloudburst-lab</span>
                <CopierButton text="npm i --save-dev sh-authentication-system" className="hover:text-gray-700 dark:hover:text-gray-400 transition-all" />
              </code>
              <div className="my-4">
                <Link href="https://www.npmjs.com/package/next-auth-provider-cloudburst-lab" className="text-violet-500 bg-violet-600/30 px-3 py-2 rounded hover:text-white dark:hover:text-gray-200 hover:bg-violet-600 transition-all">Read docs</Link>
              </div>
            </div>
          </section>
          <section className="mt-10 grid lg:grid-cols-2 gap-5">
            <div>
              <p className="text-xl font-medium">Why us?</p>
              <ul className="text-lg mt-6 space-y-2">
                <li className="flex items-center space-x-2">
                  <MdArrowForwardIos size={20} className="text-blue-500" />
                  <p>Faster and more efficient login system</p>
                </li>
                <li className="flex items-center space-x-2">
                  <MdArrowForwardIos size={20} className="text-blue-500" />
                  <p>Integration with 3 popular login providers</p>
                </li>
                <li className="flex items-center space-x-2">
                  <MdArrowForwardIos size={20} className="text-blue-500" />
                  <p>Enhanced security measures to protect your data</p>
                </li>
                <li className="flex items-center space-x-2">
                  <MdArrowForwardIos size={20} className="text-blue-500" />
                  <p>Two-step verification available for added security</p>
                </li>
                <li className="flex items-center space-x-2">
                  <MdArrowForwardIos size={20} className="text-blue-500" />
                  <p>Easy and hassle-free account creation process</p>
                </li>
                <li className="flex items-center space-x-2">
                  <MdArrowForwardIos size={20} className="text-blue-500" />
                  <p>Highly protected user data with advanced encryption</p>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xl font-medium">We also provide</p>
              <ul className="text-lg mt-6 space-y-2">
                <li>
                  <FaCheckCircle className="inline mr-2 text-green-500" />
                  Remotely control your application via our library
                </li>
                <li>
                  <FaCheckCircle className="inline mr-2 text-green-500" />
                  Web, Android, iOS, and desktop all platforms supported
                </li>
                <li>
                  <FaCheckCircle className="inline mr-2 text-green-500" />
                  OAuth 2.0 support with OpenID client
                </li>
                <li>
                  <FaCheckCircle className="inline mr-2 text-green-500" />
                  One account, all CloudBurst Lab applications
                </li>
              </ul>
            </div>
          </section>

        </div>
        <footer className="w-full">
          <section className="flex items-center space-x-2 mb-4 mt-[80px]">
            <Link href={brandData.website}>
              <Image src={brandData.iconTransparent} alt={`${brandData.name} icon`} height={50} width={95} className="w-[95px] h-[50px]" />
            </Link>
            <p>A product of {brandData.name}</p>
          </section>
          <p className=" bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-400 py-1.5 text-center text-sm">{brandData.copyrightText}</p>
        </footer>
      </div>
    </main>
  );
}

