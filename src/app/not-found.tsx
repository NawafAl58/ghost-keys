import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
      <h1 className="text-9xl font-black text-neonPurple mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-6">ضيعت الطريق؟ هذي الصفحة ماهي موجودة</h2>
      <Link href="/" className="px-8 py-3 rounded-full bg-iceBlue text-black font-bold hover:brightness-110 transition-all">
        ارجع للمتجر
      </Link>
    </div>
  );
}