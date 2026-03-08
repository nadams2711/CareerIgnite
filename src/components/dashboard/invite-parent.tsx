"use client";

import { useState, useEffect } from "react";
import { generateParentInvite } from "@/lib/actions/parent.actions";
import { Heart, Loader2, Copy, Check } from "lucide-react";
import QRCode from "qrcode";

export function InviteParent() {
  const [loading, setLoading] = useState(true);
  const [qrSrc, setQrSrc] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function generate() {
      try {
        const token = await generateParentInvite();
        if (cancelled) return;
        const url = `${window.location.origin}/parent/invite/${token}`;
        setInviteCode(token);
        setInviteUrl(url);
        const dataUrl = await QRCode.toDataURL(url, {
          width: 120,
          margin: 1,
          color: { dark: "#1e293b", light: "#ffffff" },
        });
        if (!cancelled) setQrSrc(dataUrl);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    generate();
    return () => { cancelled = true; };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) return null;

  return (
    <div className="rounded-2xl border-2 border-border bg-card shadow-md p-5 h-full flex flex-col">
      <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-1.5">
        <Heart className="h-4 w-4 text-rose-500" />
        Share with Parents
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        {loading ? (
          <div className="flex h-[120px] w-[120px] items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="rounded-lg overflow-hidden bg-muted/40 p-1">
              <img src={qrSrc} alt="Parent invite QR code" width={120} height={120} />
            </div>

            <div className="w-full text-center space-y-1.5">
              <p className="text-[11px] text-muted-foreground">or share this code</p>
              <div className="flex items-center justify-center gap-2">
                <code className="rounded-lg bg-muted px-3 py-1.5 font-mono text-base font-bold tracking-widest">
                  {inviteCode}
                </code>
                <button
                  onClick={handleCopy}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Copy invite link"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Visit <span className="font-medium text-foreground">/parent/invite</span> and enter code
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
