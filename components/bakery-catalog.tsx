"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import ProductCard from "./product-card"
import CartIcon from "./cart-icon"
import { bakeryProducts } from "@/lib/data"

export default function BakeryCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter products based on search query and selected category
  const filteredProducts = bakeryProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ["all", "cakes", "cookies", "bread", "pastries"]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-amber-800 font-serif">Sweet Delights Bakery</h1>
            <p className="text-amber-700 mt-2">Handcrafted with love since 1995</p>
          </div>
          <div className="flex items-center">
            <CartIcon />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-amber-300 text-amber-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 p-2.5"
              placeholder="Search for delicious treats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                  selectedCategory === category
                    ? "bg-amber-600 text-white"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-xl font-medium text-amber-800">No products found</h3>
            <p className="text-amber-600 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-amber-200 text-center text-amber-700">
        <p>© 2025 Sweet Delights Bakery. All rights reserved.</p>
        
      </footer>
    </div>
  )
}
