import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Mail, Phone, User, Sparkles, Gift, CheckCircle2 } from "lucide-react";
import logoImg from "@/assets/logo.png";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, navigateTo?: string) => void;
}

type Step = "phone" | "phone-otp" | "profile" | "email-otp" | "success";

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [notifyMe, setNotifyMe] = useState(true);
  const navigate = useNavigate();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      // Check for admin phone number
      if (phone === "0000000000") {
        resetAndClose();
        navigate("/admin");
        return;
      }
      console.log("Sending OTP to:", phone);
      setStep("phone-otp");
    }
  };

  const handlePhoneOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOtp.length === 6) {
      console.log("Phone OTP verified:", phoneOtp);
      setStep("profile");
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email) {
      console.log("Sending email OTP to:", email);
      setStep("email-otp");
    }
  };

  const handleEmailOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtp.length === 6) {
      console.log("Email verified! User registered:", { phone, username, email });
      setStep("success");
    }
  };

  const handleBack = () => {
    switch (step) {
      case "phone-otp":
        setStep("phone");
        setPhoneOtp("");
        break;
      case "profile":
        setStep("phone-otp");
        break;
      case "email-otp":
        setStep("profile");
        setEmailOtp("");
        break;
      default:
        break;
    }
  };

  const resetAndClose = () => {
    setStep("phone");
    setPhone("");
    setPhoneOtp("");
    setUsername("");
    setEmail("");
    setEmailOtp("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => resetAndClose()}>
      <DialogContent className="p-0 gap-0 max-w-md overflow-hidden border-0 rounded-2xl shadow-2xl">
        {/* Beautiful Gradient Header */}
        <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 p-8 text-center text-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-4 left-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
          </div>
          
          {step !== "phone" && step !== "success" && (
            <button
              onClick={handleBack}
              className="absolute left-4 top-4 p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="relative z-10 space-y-4">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3">
              <img src={logoImg} alt="RIMAE Logo" className="h-12 w-auto invert" />
            </div>
            
            {/* Promo Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Exclusive Offer</span>
            </div>
            
            {/* Main Headline */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome to RIMAE!</h2>
              <p className="text-white/90 text-sm mt-2 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" />
                Sign in to explore fragrances
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-t-3xl -mt-4 relative z-10">
          {/* Step Indicator */}
          {step !== "success" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {["phone", "phone-otp", "profile", "email-otp"].map((s, i) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-all ${
                    step === s
                      ? "w-6 bg-gradient-to-r from-rose-500 to-orange-400"
                      : ["phone", "phone-otp", "profile", "email-otp"].indexOf(step) > i
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-charcoal">
              {step === "phone" && "Enter Your Mobile"}
              {step === "phone-otp" && "Verify Your Phone"}
              {step === "profile" && "Complete Your Profile"}
              {step === "email-otp" && "Verify Your Email"}
              {step === "success" && "Welcome to RIMAE!"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              {step === "phone" && "We'll send you a verification code"}
              {step === "phone-otp" && `Enter the 6-digit code sent to +91 ${phone}`}
              {step === "profile" && "Tell us a bit about yourself"}
              {step === "email-otp" && `Enter the 6-digit code sent to ${email}`}
              {step === "success" && "Your account has been created successfully!"}
            </p>
          </div>

          {/* Step 1: Phone Input */}
          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div className="relative">
                <div className="flex rounded-xl overflow-hidden border-2 border-gray-100 focus-within:border-rose-300 transition-colors shadow-sm">
                  <div className="flex items-center px-4 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200">
                    <span className="text-lg mr-1">🇮🇳</span>
                    <span className="text-gray-700 font-medium">+91</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-rose-50 p-3 rounded-xl">
                <Checkbox
                  id="notify"
                  checked={notifyMe}
                  onCheckedChange={(checked) => setNotifyMe(checked as boolean)}
                  className="data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500 h-5 w-5"
                />
                <label htmlFor="notify" className="text-sm text-gray-700 cursor-pointer">
                  Keep me updated on exclusive offers & new arrivals
                </label>
              </div>

              <Button
                type="submit"
                disabled={phone.length < 10}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 hover:from-rose-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold py-6 rounded-xl text-base shadow-lg shadow-rose-200 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                <Phone className="w-5 h-5 mr-2" />
                Send OTP
              </Button>
            </form>
          )}

          {/* Step 2: Phone OTP Verification */}
          {step === "phone-otp" && (
            <form onSubmit={handlePhoneOtpSubmit} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={phoneOtp}
                  onChange={(value) => setPhoneOtp(value)}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-12 h-14 text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-rose-400"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <p className="text-center text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button type="button" className="text-rose-500 font-semibold hover:underline">
                  Resend OTP
                </button>
              </p>

              <Button
                type="submit"
                disabled={phoneOtp.length !== 6}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 hover:from-rose-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold py-6 rounded-xl text-base shadow-lg shadow-rose-200 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Verify Phone
              </Button>
            </form>
          )}

          {/* Step 3: Profile (Username & Email) */}
          {step === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="flex rounded-xl overflow-hidden border-2 border-gray-100 focus-within:border-rose-300 transition-colors shadow-sm">
                  <div className="flex items-center px-4 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-6"
                  />
                </div>

                <div className="flex rounded-xl overflow-hidden border-2 border-gray-100 focus-within:border-rose-300 transition-colors shadow-sm">
                  <div className="flex items-center px-4 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-6"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!username || !email.includes("@")}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 hover:from-rose-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold py-6 rounded-xl text-base shadow-lg shadow-rose-200 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                Verify Email
              </Button>
            </form>
          )}

          {/* Step 4: Email OTP Verification */}
          {step === "email-otp" && (
            <form onSubmit={handleEmailOtpSubmit} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={emailOtp}
                  onChange={(value) => setEmailOtp(value)}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-12 h-14 text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-rose-400"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <p className="text-center text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button type="button" className="text-rose-500 font-semibold hover:underline">
                  Resend OTP
                </button>
              </p>

              <Button
                type="submit"
                disabled={emailOtp.length !== 6}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 hover:from-rose-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold py-6 rounded-xl text-base shadow-lg shadow-rose-200 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Complete Registration
              </Button>
            </form>
          )}

          {/* Step 5: Success */}
          {step === "success" && (
            <div className="space-y-6 text-center">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse opacity-30" />
                <div className="absolute inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-lg">
                  Welcome, <strong className="text-charcoal">{username}</strong>!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Your account has been created successfully.
                </p>
              </div>
              <Button
                onClick={resetAndClose}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 hover:from-rose-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold py-6 rounded-xl text-base shadow-lg shadow-rose-200 transition-all"
              >
                <Gift className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
            <div className="flex gap-3">
              <a href="#" className="hover:text-gray-600 transition-colors">T&C</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-500">🔒</span>
              <span>Secured by <strong className="text-gray-600">RIMAE</strong></span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
