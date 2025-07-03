"use client";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="mt-5 w-full py-4 px-6 bg-gray-100 border-t">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <p className="text-sm text-gray-600">© 2024 Your Company</p>
        <button
          onClick={() => router.push("/settings")}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Settings
        </button>
      </div>
    </footer>
  );
};

export default Footer;
