import Image from "next/image";
import getAppData from "@/actions/database/getAppData";
import getBrandData from "@/actions/database/getBrandData";

export default async function Page() {

    const appId = process.env.SHAS_APP_ID as string;
    const appData = await getAppData(appId);
    const brandData = await getBrandData();

    return (
        <main className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-gray-200">
            <div className="container mx-auto p-3 lg:p-0">
                <header className="pt-5">
                    <div className="flex items-center justify-center space-x-2 mb-8">
                        {appData.appIcon && <Image src={appData.appIcon} alt={`${appData.appName} icon`} height={30} width={30} />}
                        <p className="text-lg md:text-xl lg:text-2xl font-bold">{appData.appName}</p>
                    </div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">Privacy Policy</h2>
                    <p className="text-gray-500">Last Updated: March 5, 2024</p>
                    <p className="mt-3">This privacy policy sets out how our website uses and protects any information that you give us when you use this website.</p>
                    <hr className="h-px border-0 mb-8 mt-3 bg-gray-500" />
                </header>
                
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">1. Information We Collect</h2>
                    <p className="mb-1">a) Personal Information</p>
                    <p className="mb-5 text-sm">We collect the following personal information when you use our application:</p>
                    <ul className="list-inside list-disc mb-3 text-sm">
                        <li>First name</li>
                        <li>Last name</li>
                        <li>Email address</li>
                        <li>Phone number (with country code)</li>
                        <li>Profile picture</li>
                        <li>Date of birth</li>
                        <li>Gender</li>
                        <li>Country</li>
                    </ul>
                    <p className="mb-1">b) Sensitive Personal Information</p>
                    <p className="mb-5 text-sm">We do not collect any sensitive personal information.</p>
                </section>
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">2. Usage Data</h2>
                    <p className="mb-1">a) Log Data, IP Addresses, Browser Information</p>
                    <p className="mb-5 text-sm">We collect log data, IP addresses, and browser information to provide a secure login system. This information is used to detect unusual activity and may result in the suspension of an account to protect user privacy.</p>
                    <p className="mb-1">b) Purpose of Usage Data</p>
                    <p className="mb-5 text-sm">We collect this information to:</p>
                    <ul className="list-inside list-disc mb-3 text-sm">
                        <li>Confirm the identity of users</li>
                        <li>Provide content based on age, gender, and region</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">3. CloudBurst Lab Integration</h2>
                    <p className="mb-1">a) Official Account Manager</p>
                    <p className="mb-5 text-sm">This application is the official account manager of CloudBurst Lab and is created and developed by CloudBurst Lab.</p>
                    <p className="mb-1">b) Data Sharing</p>
                    <p className="mb-5 text-sm">We share user data with CloudBurst Lab as it is the parent company of this app and handles user privacy. Please refer to the CloudBurst Lab Privacy Policy for more information.</p>
                </section>
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">4. OAuth 2.0/OpenID Provider</h2>
                    <p className="mb-1">a) OAuth 2.0/OpenID Provider</p>
                    <p className="mb-5 text-sm">Our CloudBurst Lab login system acts as an OAuth 2.0/OpenID provider.</p>
                    <p className="mb-1">b) Data Collection</p>
                    <p className="mb-5 text-sm">We collect the previously mentioned data to prevent unusual activities and ensure the security of user accounts.</p>
                </section>
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">5. Remote Application Control</h2>
                    <p className="mb-1">a) Remote Application Control</p>
                    <p className="mb-5 text-sm">In registered applications, users must wrap the entire application with our provided library. Our library checks the application status on our server and provides output accordingly.</p>
                    <p className="mb-1">b) Data Sharing</p>
                    <p className="mb-5 text-sm">Application public data is shared with our public application control library.</p>
                </section>
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">6. Data Sharing</h2>
                    <p className="mb-1">a) Sharing Within Authorized CloudBurst Lab Applications</p>
                    <p className="mb-5 text-sm">We share user data only between authorized CloudBurst Lab applications.</p>
                    <p className="mb-1">b) No Data Sharing Outside of CloudBurst Lab Applications</p>
                    <p className="mb-5 text-sm">We do not share user data outside of CloudBurst Lab applications.</p>
                </section>
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">7. Security Measures</h2>
                    <p className="mb-1">a) Two-Step Login System</p>
                    <p className="mb-5 text-sm">We provide a two-step login system to enhance the security of user data.</p>
                    <p className="mb-1">b) Data Security</p>
                    <p className="mb-5 text-sm">We use our own library to prevent data leaks outside of our system. We regularly review our code for bugs and security issues.</p>
                </section>
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">8. User Rights</h2>
                    <p className="mb-1">a) Data Modification</p>
                    <p className="mb-5 text-sm">Users can directly change their data from the profile section of the application.</p>
                    <p className="mb-1">b) Account Deletion</p>
                    <p className="mb-5 text-sm">Users can modify their data as needed and delete their CloudBurst Lab ID when they no longer need it.</p>
                </section>
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">9. Cookies and Tracking</h2>
                    <p className="mb-1">a) Cookies Usage</p>
                    <p className="mb-5 text-sm">We use cookies for OAuth sign-in to save OAuth application request data for a short period.</p>
                    <p className="mb-1">b) Encryption</p>
                    <p className="mb-5 text-sm">We encrypt OAuth application request data and store it as cookies, which are automatically deleted after a certain period.</p>
                </section>
                <section>
                    <h2 className="text-lg md:text-xl lg:text-2xl mb-4 font-semibold">10. Policy Updates</h2>
                    <p className="mb-1">a) Notification</p>
                    <p className="mb-5 text-sm">Users will be notified via their primary email associated with their CloudBurst Lab ID about any changes to this Privacy Policy.</p>
                    <p className="mb-1">b) Effective Date</p>
                    <p className="mb-5 text-sm">This Privacy Policy is effective as of March 5, 2024.</p>
                </section>
                <footer className="w-full bg-gray-300 dark:bg-gray-800">
                    <p className="text-gray-800 dark:text-gray-400 py-1.5 text-center text-sm">{brandData.copyrightText}</p>
                </footer>
            </div>        
        </main >
    );
}