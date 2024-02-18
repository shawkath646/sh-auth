"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Home() {

  const [appId, setAppId] = useState('sh-portfolio-maker');
  const [authToken, setAuthToken] = useState('any');
  const [callbackUrl, setCallbackUrl] = useState('https://sh-portfolio-maker.vercel.app');

  const router = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const link = `/validate?app_id=${appId}&auth_token=${authToken}&callback_url=${callbackUrl}`;
    router.push(link);
  }

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <div className="container mx-auto h-screen flex items-center justify-center">
        <section>
          <p className="text-2xl font-semibold text-center mb-16">Main Page</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" value={appId} onChange={event => setAppId(event.target.value)} className="border border-black block" />
            <input type="text" value={authToken} onChange={event => setAuthToken(event.target.value)} className="border border-black block" />
            <input type="text" value={callbackUrl} onChange={event => setCallbackUrl(event.target.value)} className="border border-black block" />
            <button type="submit" className="border border-black block">Go to sign in page</button>
          </form>
        </section>
      </div>
    </main>
  );
}

