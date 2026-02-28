'use client';

import { useEffect, useState } from 'react';
import { adminApi, Product } from '@/lib/api/admin';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                Quản lý sản phẩm
              </h1>
              <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
                Tổng số: {products.length} sản phẩm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
                      {product.category.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowAddStockModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Thêm stock"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Giá bán</span>
                    <span className="font-bold text-green-600" style={{ fontFamily: 'Fira Code, monospace' }}>
                      {formatCurrency(product.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Tồn kho</span>
                    <span
                      className={`font-bold ${
                        product.availableStock > 10
                          ? 'text-green-600'
                          : product.availableStock > 0
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                      style={{ fontFamily: 'Fira Code, monospace' }}
                    >
                      {product.availableStock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Đã bán</span>
                    <span className="font-semibold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                      {product.totalSales}
                    </span>
                  </div>
                </div>

                {product.description && (
                  <p className="mt-4 text-sm text-slate-500 line-clamp-2" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
                    {product.description}
                  </p>
                )}

                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowAddStockModal(true);
                  }}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer font-medium"
                  style={{ fontFamily: 'Fira Sans, sans-serif' }}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Thêm stock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {showAddStockModal && selectedProduct && (
        <AddStockModal
          product={selectedProduct}
          onClose={() => {
            setShowAddStockModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            loadProducts();
            setShowAddStockModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

function AddStockModal({
  product,
  onClose,
  onSuccess,
}: {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [stockText, setStockText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockText.trim()) return;

    const stocks = stockText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (stocks.length === 0) return;

    try {
      setLoading(true);
      await adminApi.addBulkStock(product.id, stocks);
      alert(`Đã thêm ${stocks.length} stock thành công!`);
      onSuccess();
    } catch (error) {
      console.error('Failed to add stock:', error);
      alert('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Fira Code, monospace' }}>
          Thêm stock cho {product.name}
        </h2>

        <div className="mb-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">Tồn kho hiện tại</p>
          <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Fira Code, monospace' }}>
            {product.availableStock}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Danh sách tài khoản (mỗi dòng 1 tài khoản)
            </label>
            <textarea
              value={stockText}
              onChange={(e) => setStockText(e.target.value)}
              placeholder="email|password&#10;email2|password2&#10;hoặc&#10;license_key_1&#10;license_key_2"
              rows={10}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              style={{ fontFamily: 'Fira Code, monospace' }}
              required
            />
            <p className="mt-2 text-xs text-slate-500">
              Số lượng: {stockText.split('\n').filter((l) => l.trim()).length} tài khoản
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer font-medium disabled:opacity-50"
            >
              {loading ? 'Đang thêm...' : 'Thêm stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
