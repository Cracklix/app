
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Logo from "@/components/brand/Logo"
import { ShieldCheck, Phone } from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const router = useRouter()

  const handleSendOtp = () => {
    if (phoneNumber.length >= 10) {
      setStep('otp')
    }
  }

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      router.push("/profile-setup")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-12">
        <Logo variant="dark" />
      </div>

      <Card className="w-full max-w-md border-foreground/5 shadow-2xl shadow-primary/5">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold">Secure Access</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? "Enter your mobile number to receive an OTP" 
              : "Enter the 6-digit code sent to your mobile"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'phone' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">+91</span>
                  <Input 
                    id="phone" 
                    className="pl-12 h-12 font-bold tracking-widest" 
                    placeholder="98765-43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
              <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 font-bold"
                onClick={handleSendOtp}
                disabled={phoneNumber.length < 10}
              >
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2 text-center">
                <Label htmlFor="otp">Verification Code</Label>
                <Input 
                  id="otp" 
                  className="text-center h-12 text-2xl font-black tracking-[0.5em]" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <Button 
                className="w-full h-12 bg-secondary hover:bg-secondary/90 font-bold"
                onClick={handleVerifyOtp}
                disabled={otp.length < 6}
              >
                Verify & Continue
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-xs font-bold uppercase tracking-widest text-muted-foreground"
                onClick={() => setStep('phone')}
              >
                Change Phone Number
              </Button>
            </div>
          )}

          <div className="pt-6 border-t text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest">
            Institutional Access • Cracklix Security System
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        Don't have an account? <span className="text-primary font-bold cursor-pointer hover:underline">Register Now</span>
      </p>
    </div>
  )
}
