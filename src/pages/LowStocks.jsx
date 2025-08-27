import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAllProducts } from '../API/productApi';
import { BASE_BACKEND_URL } from '../API/config';

const ProductImage = ({ imageUrl, altText }) => {
  const [src, setSrc] = useState(null);
  const [error, setError] = useState(false);

  const getImageUrl = (url) => {
    if (!url) {
      return null;
    }
    if (url.startsWith("http")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `${BASE_BACKEND_URL}${url}`;
    }
    return `${BASE_BACKEND_URL}/${url}`;
  };

  useEffect(() => {
    const newSrc = getImageUrl(imageUrl);
    if (newSrc) {
      setSrc(newSrc);
      setError(false);
    } else {
      setError(true);
    }
  }, [imageUrl]);

  const handleError = () => {
    if (!error) {
      setError(true);
    }
  };

  if (error || !src) {
    return <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-500 text-xs rounded">Image not found</div>;
  }

  return (
    <img 
      src={src} 
      alt={altText || 'Product image'} 
      className="w-16 h-16 object-cover rounded"
      onError={handleError}
    />
  );
};


export const LowStocks = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getAllProducts();
        const lowStock = productsData.filter(product => product.quentity < 3 && (product.isActive === true || product.isActive === 1));
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error("Error fetching low stock products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Low Stock Products</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : lowStockProducts.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <ProductImage imageUrl={product.imageUrl} altText={product.title} />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{product.title}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{product.brandDto?.brandName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">${product.price}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                        <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                        <span className="relative">{product.quentity}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">No low stock products found.</h2>
            <p className="text-gray-500 mt-2">Everything is well stocked!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};