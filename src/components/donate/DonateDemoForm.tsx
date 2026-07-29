"use client";

import { AlertCircle, Lock, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];
const PURPOSES = [
  "Support Where Most Needed",
  "Education & Student Development",
  "Environmental Action",
  "Mental Well-being",
  "Community Empowerment",
  "Volunteer Programmes",
];

export function DonateDemoForm() {
  const [amount, setAmount] = useState<number | "other">(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [purpose, setPurpose] = useState<string>(PURPOSES[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDemoModal, setShowDemoModal] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const selectedAmount = amount === "other" ? parseFloat(customAmount) : amount;
    if (!selectedAmount || isNaN(selectedAmount) || selectedAmount < 100) {
      newErrors.amount = "Minimum contribution is ₹100";
    }

    if (!name.trim()) newErrors.name = "Full name is required";
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowDemoModal(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-udbhav-blue/10 overflow-hidden relative">
        
        {/* Demo Mode Notice */}
        <div className="bg-soft-green/50 border-b border-[#3C9D23]/20 p-4 flex gap-3 items-start sm:items-center">
          <AlertCircle className="w-5 h-5 text-[#3C9D23] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-udbhav-blue-deep font-medium leading-relaxed">
            Online donations are currently in demo mode. Secure payment services will be available soon.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Form Header */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-udbhav-blue mb-2">Make a Contribution</h2>
            <p className="text-sm text-gray-600">
              Choose an amount and help us continue meaningful grassroots action.
            </p>
          </div>

          {/* Amount Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-udbhav-blue-deep">
              Select Amount (INR)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount("");
                    setErrors((prev) => ({ ...prev, amount: "" }));
                  }}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    amount === preset
                      ? "bg-[#3C9D23] border-[#3C9D23] text-white shadow-md shadow-[#3C9D23]/20"
                      : "bg-white border-gray-200 text-gray-700 hover:border-[#3C9D23] hover:text-[#3C9D23]"
                  }`}
                >
                  ₹{preset.toLocaleString("en-IN")}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount("other")}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  amount === "other"
                    ? "bg-[#3C9D23] border-[#3C9D23] text-white shadow-md shadow-[#3C9D23]/20"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#3C9D23] hover:text-[#3C9D23]"
                }`}
              >
                Other Amount
              </button>
            </div>

            {amount === "other" && (
              <div className="mt-3 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input
                  type="number"
                  min="100"
                  step="1"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
                  }}
                  placeholder="Enter custom amount"
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#3C9D23]/30 transition-all ${
                    errors.amount ? "border-red-400" : "border-gray-200 focus:border-[#3C9D23]"
                  }`}
                />
              </div>
            )}
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
          </div>

          {/* Purpose Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-udbhav-blue-deep">
              Donation Purpose
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C9D23]/30 focus:border-[#3C9D23] transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23172B6B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
            >
              {PURPOSES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <hr className="border-gray-100" />

          {/* Donor Information */}
          <div className="space-y-5">
            <label className="block text-sm font-semibold text-udbhav-blue-deep">
              Donor Information
            </label>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#3C9D23]/30 transition-all ${
                    errors.name ? "border-red-400" : "border-gray-200 focus:border-[#3C9D23]"
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#3C9D23]/30 transition-all ${
                      errors.email ? "border-red-400" : "border-gray-200 focus:border-[#3C9D23]"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#3C9D23]/30 transition-all ${
                      errors.phone ? "border-red-400" : "border-gray-200 focus:border-[#3C9D23]"
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Message or note of support (Optional)"
                  rows={2}
                  maxLength={250}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#3C9D23]/30 focus:border-[#3C9D23] transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#3C9D23] hover:bg-[#31851c] text-white py-4 px-6 rounded-xl font-bold text-base transition-colors shadow-lg shadow-[#3C9D23]/20"
            >
              <Lock className="w-4 h-4" />
              <span>Donate Securely</span>
            </button>
            <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed max-w-xs mx-auto">
              Secure payment processing. By continuing, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
        </form>
      </div>

      {/* Demo Modal Overlay */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-udbhav-blue-deep/60 backdrop-blur-sm"
            onClick={() => setShowDemoModal(false)}
          />
          <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl p-8 text-center overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-udbhav-blue via-[#3C9D23] to-udbhav-blue" />
            
            <button 
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-soft-green rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-[#3C9D23]" />
            </div>

            <h3 className="text-2xl font-heading font-bold text-udbhav-blue mb-4">
              Demo Mode Active
            </h3>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Thank you for choosing to support UDBHAV Foundation. Online donation services are currently being integrated and will be available soon.
            </p>

            <div className="flex flex-col gap-3">
              <Link 
                href="/"
                className="w-full bg-udbhav-blue hover:bg-udbhav-blue-deep text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Return to Website
              </Link>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
