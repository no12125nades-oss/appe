import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Shield, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-900">AuthApp</span>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">
                  {user?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-2 text-slate-500 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/login?mode=register">
                <Button
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-slate-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gray-200/40 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-zinc-200/30 rounded-full blur-2xl" />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-gray-200/60 shadow-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-600">
                Secure Authentication System
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6">
              Simple.
              <span className="text-slate-400"> Secure.</span>
              <br />
              Minimal.
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              A clean and minimal authentication platform with email/password
              login, user management, and admin dashboard. Built for simplicity
              and security.
            </p>

            <div className="flex items-center justify-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-emerald-700 font-medium">
                      Welcome back, {user?.name}!
                    </span>
                  </div>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button
                        size="lg"
                        className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login?mode=register">
                    <Button
                      size="lg"
                      className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 text-base"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 h-12 text-base border-gray-300"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 pb-32">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<User className="w-5 h-5" />}
              title="User Authentication"
              description="Secure email and password registration and login with bcrypt password hashing."
            />
            <FeatureCard
              icon={<Shield className="w-5 h-5" />}
              title="Role-Based Access"
              description="Built-in user and admin roles with protected routes and permission checks."
            />
            <FeatureCard
              icon={<LayoutDashboard className="w-5 h-5" />}
              title="Admin Dashboard"
              description="Comprehensive admin panel to view and manage all registered users."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-slate-400">
          <span>AuthApp</span>
          <span>Built with React + tRPC + PostgreSQL</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
