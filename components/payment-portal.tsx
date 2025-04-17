"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/context/cart-context"

interface PaymentPortalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
}

interface ValidationErrors {
  cardNumber?: string
  expiryDate?: string
  cvv?: string
}

export default function PaymentPortal({ isOpen, onClose, totalAmount }: PaymentPortalProps) {
  const { clearCart } = useCart()
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<ValidationErrors>({})

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return value
  }

  // Validate card number
  const validateCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, "")
    if (cleaned.length < 16) return "Card number must be 16 digits"
    if (!/^\d+$/.test(cleaned)) return "Card number must contain only digits"
    return ""
  }

  // Validate expiry date
  const validateExpiryDate = (value: string) => {
    const [month, year] = value.split("/")
    if (!month || !year) return "Invalid date format"
    if (month.length !== 2 || year.length !== 2) return "Invalid date format"
    const monthNum = parseInt(month)
    const yearNum = parseInt(year)
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1

    if (monthNum < 1 || monthNum > 12) return "Invalid month"
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return "Card has expired"
    }
    return ""
  }

  // Validate CVV
  const validateCVV = (value: string) => {
    if (value.length < 3) return "CVV must be 3 digits"
    if (!/^\d+$/.test(value)) return "CVV must contain only digits"
    return ""
  }

  // Update errors state when inputs change
  useEffect(() => {
    const newErrors: ValidationErrors = {}
    const cardError = validateCardNumber(cardNumber)
    const expiryError = validateExpiryDate(expiryDate)
    const cvvError = validateCVV(cvv)

    if (cardError) newErrors.cardNumber = cardError
    if (expiryError) newErrors.expiryDate = expiryError
    if (cvvError) newErrors.cvv = cvvError

    setErrors(newErrors)
  }, [cardNumber, expiryDate, cvv])

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setExpiryDate(formatted)
  }

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setCvv(value)
  }

  const handlePayment = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentStatus("success")
      clearCart()
      // Close the dialog after 2 seconds
      setTimeout(() => {
        onClose()
        setPaymentStatus("idle")
      }, 2000)
    }, 2000)
  }

  const isFormValid = Object.keys(errors).length === 0 && 
    cardNumber.replace(/\s+/g, "").length === 16 &&
    expiryDate.length === 5 &&
    cvv.length === 3

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Portal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              className={errors.cardNumber ? "border-red-500" : ""}
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500">{errors.cardNumber}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                maxLength={5}
                className={errors.expiryDate ? "border-red-500" : ""}
              />
              {errors.expiryDate && (
                <p className="text-sm text-red-500">{errors.expiryDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={handleCVVChange}
                maxLength={3}
                className={errors.cvv ? "border-red-500" : ""}
              />
              {errors.cvv && (
                <p className="text-sm text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-lg font-bold text-amber-800">Rs.{totalAmount.toFixed(2)}</span>
          </div>
          {paymentStatus === "success" ? (
            <div className="text-center py-4">
              <div className="text-green-600 font-semibold">Payment Successful!</div>
              <p className="text-sm text-gray-600 mt-2">Thank you for your purchase</p>
            </div>
          ) : (
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handlePayment}
              disabled={isProcessing || !isFormValid}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 