
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Lock, CreditCard, ChevronRight, Zap, ArrowLeft, Loader2, Sparkles, AlertCircle, QrCode, Phone, CheckCircle2 } from "lucide-react"
import { useUser } from "@/firebase"
import { useEffect, useState, Suspense } from "react"
import { useToast } from "@/hooks/use-toast"
import { createRazorpayOrder, verifyRazorpayPayment, submitManualPayment } from "@/app/actions/payment"
import Script from "next/script"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * @fileOverview Institutional Production Checkout Node.
 * Re-engineered to support Manual UPI/QR verification.
 */

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="h-10 w-10 text-primary animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get("plan") || "gold"
  const { user, profile, loading } = useUser()
  const { toast } = useToast()
  const [processing, setProcessing] = useState(false)
  const [utr, setUtr] = useState("")

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  const planData = {
    free: { id: 'free', name: "Aspirant Free", price: 0, tier: 'Free' },
    silver: { id: 'silver', name: "Silver Pass", price: 99, tier: 'Silver' },
    gold: { id: 'gold', name: "Gold Pass", price: 199, tier: 'Gold' },
    premium: { id: 'premium', name: "Elite Pass", price: 499, tier: 'Premium' }
  }[planId] || { id: 'gold', name: "Gold Pass", price: 199, tier: 'Gold' }

  const handleRazorpay = async () => {
    if (!user) return
    setProcessing(true)
    try {
      const order = await createRazorpayOrder(planId)
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Cracklix Authority",
        description: `Upgrade to ${order.planName}`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
             await verifyRazorpayPayment({
                orderId: order.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId: user.uid,
                userEmail: user.email || '',
                planId: order.planId
             })
             toast({ title: "Pass Activated", description: "Your institutional access has been upgraded." })
             router.push("/payment/success?plan=" + planId)
          } catch (err: any) {
             toast({ variant: "destructive", title: "Verification Failed", description: err.message })
          }
        },
        prefill: { name: profile?.name || "", email: user.email || "" },
        theme: { color: "#0F172A" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Order Failed", description: e.message })
    } finally {
      setProcessing(false)
    }
  }

  const handleManualPayment = async () => {
    if (!user || !profile) return
    if (!utr || utr.length < 10) {
       toast({ variant: "destructive", title: "UTR Missing", description: "Please enter your 12-digit transaction ID." })
       return
    }

    setProcessing(true)
    try {
       await submitManualPayment({
          userId: user.uid,
          userEmail: user.email || '',
          userName: profile.name,
          planId: planId,
          transactionId: utr
       })
       toast({ title: "Verification Submitted", description: "Admin will verify your payment within 1-2 hours." })
       router.push("/dashboard")
    } catch (e: any) {
       toast({ variant: "destructive", title: "Submission Failed", description: e.message })
    } finally {
       setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />
      <main className="container mx-auto px-6 py-24 max-w-5xl">
        <div className="flex items-center gap-6 mb-12">
           <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl h-14 w-14 border border-slate-200 bg-white shadow-sm">
             <ArrowLeft className="h-6 w-6 text-[#0F172A]" />
           </Button>
           <div className="text-left">
              <h1 className="text-4xl font-headline font-black text-[#0F172A] uppercase">Payment Terminal</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 text-left">Gateway & UPI Node</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
           <div className="lg:col-span-7 space-y-8">
              <Tabs defaultValue="upi" className="w-full">
                 <TabsList className="bg-white border border-slate-200 p-1.5 h-16 rounded-2xl w-full justify-start gap-4 mb-8 shadow-sm">
                    <TabsTrigger value="upi" className="rounded-xl px-8 font-black uppercase text-[10px] gap-2 h-full data-[state=active]:bg-[#0F172A] data-[state=active]:text-white"><QrCode className="h-4 w-4" /> Direct UPI / QR</TabsTrigger>
                    <TabsTrigger value="card" className="rounded-xl px-8 font-black uppercase text-[10px] gap-2 h-full data-[state=active]:bg-[#0F172A] data-[state=active]:text-white"><CreditCard className="h-4 w-4" /> Cards & Netbanking</TabsTrigger>
                 </TabsList>

                 <TabsContent value="upi" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-3xl shadow-slate-900/5 rounded-[3rem] bg-white overflow-hidden">
                       <CardHeader className="p-10 bg-slate-50/50 border-b border-slate-50">
                          <CardTitle className="font-headline font-black text-xl uppercase text-[#0F172A]">Manual UPI Verification</CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Scan QR and submit Transaction ID (UTR)</CardDescription>
                       </CardHeader>
                       <CardContent className="p-10 space-y-10">
                          <div className="flex flex-col md:flex-row items-center gap-10">
                             <div className="h-48 w-48 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center p-4 relative group">
                                {/* Simulated QR Node - In production, replace with actual static QR URL */}
                                <div className="absolute inset-0 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <Zap className="h-8 w-8 text-primary animate-pulse" />
                                </div>
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=arshdeepgrewal1122@okaxis%26pn=Cracklix%26am=199%26cu=INR" alt="Admin QR" className="w-full h-full object-contain" />
                             </div>
                             <div className="flex-1 space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Admin UPI ID</p>
                                   <p className="text-lg font-black text-[#0F172A]">arshdeepgrewal1122@okaxis</p>
                                </div>
                                <ul className="space-y-2">
                                   <li className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Open any UPI App (GPay/Paytm)</li>
                                   <li className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Pay ₹{planData.price} to the ID above</li>
                                   <li className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Copy the 12-digit UTR/Ref ID</li>
                                </ul>
                             </div>
                          </div>

                          <div className="space-y-4 pt-6 border-t border-slate-50">
                             <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Transaction ID (UTR)</Label>
                                <Input 
                                  value={utr}
                                  onChange={e => setUtr(e.target.value)}
                                  placeholder="Enter 12-digit UTR Number" 
                                  className="h-14 rounded-xl border-slate-100 bg-slate-50 font-black text-lg tracking-widest" 
                                />
                             </div>
                             <Button 
                                onClick={handleManualPayment}
                                disabled={processing}
                                className="w-full h-16 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 gap-3"
                             >
                                {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                                Submit for Verification
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                 </TabsContent>

                 <TabsContent value="card" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-3xl shadow-slate-900/5 rounded-[3rem] bg-white overflow-hidden">
                       <CardHeader className="p-10 bg-slate-50/50 border-b border-slate-50">
                          <CardTitle className="font-headline font-black text-xl uppercase text-[#0F172A]">Automated Gateway</CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Debit, Credit, Wallets & Instant UPI</CardDescription>
                       </CardHeader>
                       <CardContent className="p-10 space-y-8">
                          <div className="p-8 rounded-[2rem] border-2 border-primary bg-primary/5 flex items-center justify-between group cursor-pointer shadow-xl" onClick={handleRazorpay}>
                             <div className="flex items-center gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                   <Zap className="h-7 w-7 text-primary fill-current" />
                                </div>
                                <div className="text-left">
                                   <p className="font-black text-[#0F172A] uppercase tracking-tight text-left">Instant Activation</p>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-left">Verified Razorpay Node</p>
                                </div>
                             </div>
                             <div className="h-6 w-6 rounded-full border-4 border-primary bg-white" />
                          </div>

                          <Button 
                             onClick={handleRazorpay}
                             disabled={processing}
                             className="w-full h-20 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-3xl shadow-slate-300 gap-4"
                          >
                             {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                             Connect Secure Gateway
                          </Button>
                       </CardContent>
                    </Card>
                 </TabsContent>
              </Tabs>

              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                 <ShieldCheck className="h-10 w-10 text-emerald-600 shrink-0" />
                 <p className="text-sm font-bold text-emerald-800 leading-relaxed italic antialiased text-left">
                   "Institutional Guarantee: All manual UPI verifications are processed within 120 minutes."
                 </p>
              </div>
           </div>

           <div className="lg:col-span-5 space-y-8">
              <Card className="border-none shadow-4xl rounded-[3.5rem] bg-[#0F172A] text-white p-12 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Sparkles className="h-40 w-40" /></div>
                 <div className="relative z-10 space-y-10">
                    <div className="space-y-1 text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Order Node Summary</p>
                       <h3 className="text-4xl font-headline font-black uppercase">{planData.name}</h3>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-white/5">
                       <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                          <span>Institutional Fee</span>
                          <span className="text-white font-black">₹{planData.price}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                          <span>Audit Node Tax</span>
                          <span className="text-emerald-500 font-black">₹0</span>
                       </div>
                       <div className="flex justify-between items-center pt-6 border-t border-white/5">
                          <span className="text-xl font-headline font-black uppercase">Grand Total</span>
                          <span className="text-4xl font-black text-primary tracking-tighter">₹{planData.price}</span>
                       </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                       <p className="text-[10px] font-black uppercase text-slate-400 text-center">Plan Privileges</p>
                       <ul className="space-y-3">
                          <PlanFeature text="Official Pattern Mocks" />
                          <PlanFeature text="AI Rationalization Tutor" />
                          <PlanFeature text="All Punjab Ranking" />
                          <PlanFeature text="30 Days Global Validity" />
                       </ul>
                    </div>

                    <p className="text-[9px] text-center text-slate-600 font-black uppercase tracking-[0.2em]">
                       Secured by Institutional Audit Node v1.0
                    </p>
                 </div>
              </Card>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function PlanFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-[11px] font-bold text-slate-300 uppercase">
       <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
       {text}
    </li>
  )
}
