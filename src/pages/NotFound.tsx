import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Page not found
        </h2>
        <p className="text-slate-500 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link to="/">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
