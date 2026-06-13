'use client';

import { useMemo } from "react";
import { Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'dark';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'h-14';
  showLabel?: boolean;
}

/**
 * @fileOverview Reliable Share Action Node v3.0.
 * HARDENED: Added permission guard for Clipboard API to prevent runtime exceptions.
 */
export default function ShareButton({ 
  className = "", 
  variant = 'default', 
  size = 'default',
  showLabel = true 
}: ShareButtonProps) {
  const db = useFirestore();
  const { toast } = useToast();
  
  const settingsRef = useMemo(() => (db ? doc(db, 'settings', 'global') : null), [db]);
  const { data: settings, loading } = useDoc<any>(settingsRef);

  const handleShare = async () => {
    if (!settings) {
      toast({ variant: "destructive", title: "Wait", description: "Settings still loading." });
      return;
    }

    const shareData = {
      title: settings.shareTitle || "Cracklix",
      text: settings.shareDescription || "Prepare for Punjab Government Exams with Cracklix.",
      url: settings.shareUrl || window.location.origin
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        // Permission-Safe Clipboard execution
        try {
          await navigator.clipboard.writeText(shareData.url);
          toast({
            title: "Link Copied!",
            description: "Cracklix link saved to your clipboard.",
          });
        } catch (clipErr) {
          console.warn("[CLIPBOARD_BLOCKED]:", clipErr);
        }
      }
    } catch (err) {
      // Handle user cancellation silently
    }
  };

  const isDark = variant === 'dark';

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleShare();
      }}
      disabled={loading}
      variant={isDark ? 'ghost' : (variant as any)}
      className={cn(
        "rounded-xl font-black uppercase text-[10px] tracking-widest gap-3 transition-all active:scale-95",
        isDark ? "bg-[#0F172A] hover:bg-black text-white shadow-xl" : "",
        className
      )}
      size={size as any}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Share2 className={cn("h-4 w-4", isDark ? "text-primary" : "")} />
      )}
      {showLabel && <span>Share Cracklix</span>}
    </Button>
  );
}
