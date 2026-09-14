"use client";
import { useState } from "react";
import { useReferrals } from "@/app/referral-context";
import { useAuth } from "@/app/auth-context";
import { motion } from "framer-motion";
import { Gift, Copy, CheckCircle, Users } from "lucide-react";

export default function ReferralsPage() {
  const { generateReferral, applyReferral, getReferralsByPhone, referrals } = useReferrals();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [applyCode, setApplyCode] = useState("");
  const [applyResult, setApplyResult] = useState<{ success: boolean; message: string } | null>(null);

  const myReferral = referrals.find((r) => r.referrerPhone === (user as any)?.phone || r.referrerPhone === user?.email);
  const myReferrals = getReferralsByPhone((user as any)?.phone || user?.email || "");

  const handleGenerate = () => {
    if (!user?.email) return;
    generateReferral(user.email, user.name || "Customer");
  };

  const handleCopy = () => {
    if (myReferral?.code) {
      navigator.clipboard.writeText(myReferral.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyReferral(applyCode, (user as any)?.phone || user?.email || "", user?.name || "Customer");
    setApplyResult(result);
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Gift className="text-truffle mx-auto mb-2" size={40} />
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Referral Program</h1>
            <p className="text-chocolate/60">Refer friends and earn QAR 50 each!</p>
          </div>
          <div className="bg-truffle/5 rounded-2xl p-6 mb-8">
            <h2 className="font-playfair text-2xl font-bold text-chocolate mb-4">Your Referral Code</h2>
            {myReferral ? (
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-truffle tracking-wider">{myReferral.code}</p>
                <button onClick={handleCopy} className="bg-truffle text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-chocolate transition-colors flex items-center gap-1">
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            ) : (
              <button onClick={handleGenerate} className="bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors">Generate Referral Code</button>
            )}
          </div>
          <div className="border-t pt-6">
            <h3 className="font-playfair text-xl font-bold text-chocolate mb-4">Apply a Referral Code</h3>
            <form onSubmit={handleApply} className="flex gap-2">
              <input type="text" placeholder="Enter referral code" value={applyCode} onChange={(e) => setApplyCode(e.target.value.toUpperCase())} className="flex-1 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle uppercase" />
              <button type="submit" className="bg-truffle text-white px-4 py-2 rounded-full font-medium hover:bg-chocolate transition-colors">Apply</button>
            </form>
            {applyResult && <p className={`mt-2 text-sm ${applyResult.success ? "text-green-600" : "text-red-500"}`}>{applyResult.message}</p>}
          </div>
          <div className="mt-8">
            <h3 className="font-playfair text-xl font-bold text-chocolate mb-4 flex items-center gap-2"><Users size={20} /> Your Referrals ({myReferrals.length})</h3>
            {myReferrals.length === 0 ? (
              <p className="text-chocolate/60 text-center py-4">No referrals yet. Share your code!</p>
            ) : (
              <div className="space-y-2">
                {myReferrals.map((ref) => (
                  <div key={ref.id} className="bg-vanilla/20 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-chocolate text-sm">{ref.refereeName || "Unknown"}</p>
                      <p className="text-xs text-chocolate/60">Code: {ref.code}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ref.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{ref.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
