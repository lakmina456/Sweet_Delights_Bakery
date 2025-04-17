"use client"

import Image from "next/image"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"
import { useCart } from "@/context/cart-context"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setIsAdded(true)

    // Reset the added state after 1.5 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 1500)
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-amber-900 mb-1">{product.name}</h3>
        <p className="text-amber-700 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-amber-800">Rs.{product.price.toFixed(2)}</span>
          <Button
            size="sm"
            className={`transition-colors ${
              isAdded ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"
            } text-white`}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
