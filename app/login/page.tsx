import { signIn } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen bg-white lg:grid lg:grid-cols-2">
      {/* Left section: Dark Image Area */}
      <div className="hidden lg:flex relative flex-col-reverse bg-slate-900 border-r border-slate-200/20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center brightness-[0.6] grayscale contrast-125"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1541888086047-925a3aed2f00?q=80&w=2671&auto=format&fit=crop")' 
            }}
          />
          {/* Subtle gradient overlays to match image's dark vibe */}
          <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/40 to-transparent" />
        </div>
        
        {/* Quote overlay */}
        <div className="relative z-20 m-10 mb-16 text-white max-w-lg">
          <blockquote className="space-y-4">
            <p className="text-[1.35rem] font-medium leading-relaxed tracking-tight">
              &ldquo;The best way to predict the future is to create it.&rdquo;
            </p>
            <footer className="text-sm text-slate-300 font-light flex items-center">
              <span className="w-4 h-[1px] bg-slate-400 mr-2"></span>
              Peter Drucker
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right section: Form Area */}
      <div className="flex flex-col h-full bg-white relative">
        {/* Header container */}
        <div className="flex justify-between items-center p-6 sm:p-8 lg:p-10 w-full shrink-0">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 tracking-tight">
            <svg
              className="w-5 h-5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="10" height="10" rx="1.5" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3"/>
              <rect x="9" y="9" width="10" height="10" rx="1.5" stroke="#0ea5e9" strokeWidth="1.5" className="fill-blue-50/50"/>
            </svg>
            tailark
          </div>
          <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign up
          </Link>
        </div>

        {/* Center Container */}
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10 relative">
          <div className="w-full max-w-[360px] space-y-8 -mt-20">
            {/* Title & Subtitle */}
            <div className="space-y-2.5 text-left">
              <h1 className="text-[1.75rem] font-semibold tracking-tight text-slate-900">
                Sign in
              </h1>
              <p className="text-[0.9rem] text-slate-500 font-medium">
                Enter your credentials to access your account
              </p>
            </div>
            
            {/* Form using only Google Auth */}
            <div className="pt-2">
              <form
                action={async () => {
                  "use server"
                  await signIn("google", { redirectTo: "/" })
                }}
              >
                <div className="grid gap-4">
                  {/* Google Button */}
                  <Button 
                    type="submit"
                    className="w-full h-11 bg-[#5b63ff] hover:bg-[#4f56f1] text-white font-medium text-[0.95rem] rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
                  >
                    <div className="bg-white rounded p-0.5 flex items-center justify-center -ml-1">
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    </div>
                    Sign in with Google
                  </Button>
                </div>
              </form>
            </div>

            {/* Bottom Form Text */}
            <div className="text-left text-[0.9rem] text-slate-500 font-medium pt-1">
              No account?{" "}
              <Link href="#" className="text-[#5b63ff] hover:underline hover:text-[#4f56f1] font-semibold">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="absolute bottom-8 left-0 right-0 px-8">
          <p className="text-[0.7rem] text-slate-400 text-center mx-auto max-w-[280px] leading-relaxed">
            By signing in, you agree to our{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-slate-700 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-slate-700 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
