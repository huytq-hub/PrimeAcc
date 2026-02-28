"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Zap, ShieldCheck, Clock, Star, Filter, Search, Loader2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { shopApi, Product, Category } from "@/lib/api/shop";
import { authApi } from "@/lib/api/auth";
import BuyModal from "@/components/shop/BuyModal";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, profileData] = await Promise.all([
        shopApi.getProducts(),
        shopApi.getCategories(),
        authApi.getProfile(),
      ]);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setUserBalance(Number(profileData.balance));
    } catch (error) {
      console.error("Failed to load shop data:", error);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = (products || []).filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuySuccess = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-end lg:justify-between lg:space-y-0">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Cửa hàng Tài khoản</h1>
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <p className="mt-2 text-muted-foreground">Tài khoản Premium, Key bản quyền, giao hàng tự động 24/7.</p>
          </div>
          <div className="flex items-center space-x-3 glass rounded-xl p-4 border border-cta/20">
            <Clock className="h-5 w-5 text-cta" />
            <p className="text-sm font-medium text-foreground">Giao hàng ngay lập tức sau khi thanh toán!</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass rounded-xl pl-12 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 glass rounded-xl p-2 border border-border">
            <Filter className="h-5 w-5 text-muted-foreground ml-2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent px-3 py-2 text-sm font-medium text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả danh mục</option>
              {(categories || []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category._count.products})
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden glass-card rounded-2xl p-6 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="glass rounded-2xl p-3">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{product.category}</p>
                    <div className="mt-1 flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-bold text-foreground">4.8</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{product.name}</h3>

                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-xs text-muted-foreground">
                    <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                    Bảo hành trọn thời gian sử dụng
                  </li>
                  <li className="flex items-center text-xs text-muted-foreground">
                    <Zap className="mr-2 h-4 w-4 text-orange-500" />
                    Giao hàng tự động trong 1 phút
                  </li>
                  <li className="flex items-center text-xs text-muted-foreground">
                    <ShoppingBag className="mr-2 h-4 w-4 text-blue-500" />
                    Còn lại: <span className={`ml-1 font-semibold ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>{product.stock} sản phẩm</span>
                  </li>
                </ul>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Giá chỉ từ</p>
                    <p className="text-2xl font-black text-foreground">{formatNumber(product.price)}đ</p>
                  </div>
                  <button
                    disabled={product.stock === 0}
                    className="rounded-xl bg-gradient-to-r from-cta to-primary px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.stock > 0 ? "Mua ngay" : "Hết hàng"}
                  </button>
                </div>

                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <BuyModal
          product={selectedProduct}
          userBalance={userBalance}
          onClose={() => setSelectedProduct(null)}
          onBuy={shopApi.buyAccount}
          onSuccess={handleBuySuccess}
        />
      )}
    </>
  );
}
