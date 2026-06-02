
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Logo from "@/components/brand/Logo"
import { ShieldCheck, Mail, Lock, AlertCircle } from "lucide-react"
import { useAuth } from "@/firebase"
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  
  const router = useRouter()
  const auth = useAuth()
  const { toast } = useToast()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
        toast({ title: "Welcome back!", description: "Successfully logged in." })
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
        toast({ title: "Account created!", description: "Please complete your profile." })
        router.push("/profile-setup")
        return
      }
      router.push("/")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Invalid credentials. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      toast({ title: "Success", description: "Signed in with Google." })
      router.push("/")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message
      })
    }
  }

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({ variant: "destructive", title: "Email required", description: "Please enter your email address." })
      return
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      toast({ title: "Reset link sent!", description: "Check your inbox for the recovery email." })
      setIsResetDialogOpen(false)
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message })
    }
  }

  return (
    <div className="min-h-screen bg-[#08152D] flex flex-col items-center justify-center p-6">
      <div className="mb-12">
        <Logo variant="light" />
      </div>

      <Card className="w-full max-w-md border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-2 border border-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-white">
            {mode === 'login' ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {mode === 'login' 
              ? "Access your Punjab exam preparation dashboard" 
              : "Join 15,000+ aspirants on Cracklix"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  id="email" 
                  type="email"
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" name="password" className="text-gray-300">Password</Label>
                {mode === 'login' && (
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="text-xs text-primary font-bold hover:underline">Forgot Password?</button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-white/10 text-white">
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Enter your email address and we'll send you a recovery link.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <Input 
                            value={resetEmail} 
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleForgotPassword} className="bg-primary hover:bg-primary/90">Send Reset Link</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  id="password" 
                  type="password"
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? "Please wait..." : (mode === 'login' ? "Login" : "Register")}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#08152D] px-2 text-gray-500 font-bold">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white gap-3"
            onClick={handleGoogleSignIn}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>

          <div className="pt-6 border-t border-white/5 text-[10px] text-center text-gray-500 uppercase font-black tracking-widest">
            {mode === 'login' ? (
              <p>Don't have an account? <button onClick={() => setMode('register')} className="text-primary hover:underline">Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setMode('login')} className="text-primary hover:underline">Log in</button></p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
        <ShieldCheck className="h-4 w-4" />
        Institutional Grade Security
      </div>
    </div>
  )
}
