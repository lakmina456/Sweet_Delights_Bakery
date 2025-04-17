"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import PaymentPortal from "./payment-portal"

export default function CartIcon() {
  const { items, getCartCount, getCartTotal, removeFromCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const cartCount = getCartCount()
  const cartTotal = getCartTotal()

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-full relative">
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh]">
              <ShoppingBag className="h-16 w-16 text-amber-300 mb-4" />
              <h3 className="text-lg font-medium text-amber-800">Your cart is empty</h3>
              <p className="text-amber-600 mt-2 text-center">Add some delicious treats to your cart!</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b border-amber-100">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-amber-700">
                          Rs.{item.price.toFixed(2)} × {item.quantity}
                        </div>
                        <div className="font-medium">Rs.{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-amber-600 hover:text-amber-800 p-1">
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-200 pt-4 mt-auto">
                <div className="flex justify-between text-lg font-semibold mb-4">
                  <span>Total</span>
                  <span>Rs.{cartTotal.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => setShowPayment(true)}
                >
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <PaymentPortal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        totalAmount={cartTotal}
      />
    </>
  )
}
