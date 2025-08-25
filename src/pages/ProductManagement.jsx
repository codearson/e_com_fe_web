import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProduct, updateProductStatus } from '../API/productApi';
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
    navigate('/sell-product');
  };

  const renderContentView = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Product Management</h1>
        
        <div className="mb-4">
          <button onClick={handleAddProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Product
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
            Bulk Upload (CSV)
          </button>
        </div>
  
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Stock</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-2 px-4 border-b">
                      <img src={`${BASE_BACKEND_URL}${product.imageUrl}`} alt={product.title} className="h-16 w-16 object-cover" />
                    </td>
                    <td className="py-2 px-4 border-b">{product.title}</td>
                    <td className="py-2 px-4 border-b">{product.productCategoryDto?.name || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">${product.price}</td>
                    <td className="py-2 px-4 border-b">{product.quentity}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button onClick={() => handleEdit(product.id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2 text-xs">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">No products found.</td>
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