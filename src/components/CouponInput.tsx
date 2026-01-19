import { useState } from "react";
import { Tag, X, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CouponInputProps {
  total: number;
}

// Mock coupon validation
const validateCoupon = (code: string, total: number) => {
  const coupons: Record<string, { discount_type: "percentage" | "fixed"; discount_value: number; min_order: number; max_discount?: number }> = {
    "RIMAENEW": { discount_type: "percentage", discount_value: 20, min_order: 500, max_discount: 500 },
    "WINTER50": { discount_type: "fixed", discount_value: 50, min_order: 300 },
    "FIRST10": { discount_type: "percentage", discount_value: 10, min_order: 0, max_discount: 200 },
  };

  const coupon = coupons[code.toUpperCase()];
  if (!coupon) {
    return { valid: false, error: "Invalid coupon code" };
  }
  if (total < coupon.min_order) {
    return { valid: false, error: `Minimum order amount is ₹${coupon.min_order}` };
  }

  let discount = coupon.discount_type === "percentage" 
    ? (total * coupon.discount_value) / 100 
    : coupon.discount_value;

  if (coupon.max_discount && discount > coupon.max_discount) {
    discount = coupon.max_discount;
  }

  return { valid: true, discount, coupon };
};

const CouponInput = ({ total }: CouponInputProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = validateCoupon(code, total);
    setIsLoading(false);

    if (!result.valid) {
      toast.error(result.error);
      return;
    }

    setAppliedCoupon({ code: code.toUpperCase(), discount: result.discount! });
    toast.success(`Coupon applied! You save ₹${result.discount}`);
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCode("");
    toast.info("Coupon removed");
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">
              {appliedCoupon.code}
            </p>
            <p className="text-xs text-green-600">
              -₹{appliedCoupon.discount.toLocaleString()} discount applied
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 hover:bg-green-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-green-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="pl-10 bg-white font-mono uppercase"
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
        />
      </div>
      <Button
        onClick={handleApply}
        disabled={isLoading}
        variant="outline"
        className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
      </Button>
    </div>
  );
};

export default CouponInput;
