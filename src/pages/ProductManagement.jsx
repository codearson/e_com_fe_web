import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, updateProductStatus } from '../API/productApi';
import { BASE_BACKEND_URL } from '../API/config';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../App.jsx';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      // Filter out inactive products
      setProducts(data.filter(product => product.isActive));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const result = await updateProductStatus(productId, 0);
      if (result.errorDescription) {
        showToast({ title: 'Error', description: result.errorDescription, type: 'error' });
      } else {
        showToast({ title: 'Success', description: 'Product deleted successfully.', type: 'foreground' });
        fetchProducts();
      }
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to delete product.', type: 'error' });
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleAddProduct = () => {
    navigate('/sell');
  };

  const renderContentView = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64">Loading...</div>;
    }
  
    if (error) {
      return <div className="text-red-500 text-center p-4">Error: {error}</div>;
    }

    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
          <button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            Add Product
          </button>
        </div>
  
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products && products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.id} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={`${BASE_BACKEND_URL}${product.imageUrl}`} alt={product.title} className="h-16 w-16 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productCategoryDto?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quentity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEdit(product.id)} className="text-indigo-600 hover:text-white hover:bg-indigo-700 border border-indigo-600 font-bold py-1 px-2 rounded transition-colors duration-300">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-white hover:bg-red-700 border border-red-600 font-bold py-1 px-2 rounded ml-4 transition-colors duration-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                      <p className="mt-2 font-semibold">No products found.</p>
                      <p className="text-sm mt-1">Click "Add Product" to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {renderContentView()}
    </AdminLayout>
  );
};

export default ProductManagement;
