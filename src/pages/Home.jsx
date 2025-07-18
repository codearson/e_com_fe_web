import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { getAllproductPage } from "../API/productApi";
import { useNavigate } from "react-router-dom";



export const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllproductPage();
                
                if (response?.payload && Array.isArray(response.payload)) {
                    const latestProducts = [...response.payload]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 4);
                    setFeaturedProducts(latestProducts);
                } else {
                    setError("No products available");
                    setFeaturedProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products. Please try again later.");
                setFeaturedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (product) => {
        // Normalize the product data structure to match what ProductView expects
        const normalizedProduct = {
            id: product.id,
            title: product.title || product.name,
            price: product.price,
            description: product.description,
            imageUrl: product.imageUrl || product.image || product.responseDto?.imageUrl,
            brandDto: product.brandDto || product.brand || { brandName: product.brand?.brand || '' },
            conditionsDto: product.conditionsDto || product.conditions || { conditionType: product.condition || 'Used' },
            statusDto: product.statusDto || product.status || {},
            productCategoryDto: product.productCategoryDto || product.productCategory || { name: product.category || 'Uncategorized' },
            quentity: product.quentity || product.stock || product.quantity || 0,
            createdAt: product.createdAt,
            size: product.size || '',
            color: product.color || ''
        };
        navigate(`/productView/${product.id}`, { state: { product: normalizedProduct } });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section */}
            <section className="relative h-[600px] bg-gray-100 z-0">
                <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Our Store</h1>
                        <p className="text-xl text-gray-600 mb-8">Discover amazing products at great prices</p>
                        <button 
                            onClick={() => navigate('/products')}
                            className="bg-[#1E90FF] text-white px-8 py-3 rounded-lg hover:bg-[#1876cc] transition-colors"
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">Featured Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['Electronics', 'Fashion', 'Home & Living'].map((category) => (
                            <div 
                                key={category} 
                                className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate('/products')}
                            >
                                <h3 className="text-xl font-medium text-gray-900 mb-2">{category}</h3>
                                <p className="text-gray-600">Explore our {category.toLowerCase()} collection</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Products */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">Featured Products</h2>
                    <p className="text-gray-600 mb-8">Check out our featured collection</p>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                                        <img 
                                            src={product.responseDto?.imageUrl || 'https://placehold.co/400x400/png'} 
                                            alt={product.title || product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/400x400/png';
                                            }}
                                        />
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-2">{product.title || product.name}</h3>
                                    <p className="text-gray-600 mb-2">LKR {product.price?.toFixed(2)}</p>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            product.conditions?.name === 'New with tags' ? 'bg-green-100 text-green-800' :
                                            product.conditions?.name === 'New without tags' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {product.conditions?.name || product.condition || 'Used'}
                                        </span>
                                        {product.brand?.brand && (
                                            <span className="text-sm text-gray-600">{product.brand.brand}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No products available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>
            <Footer />  
        </div>
    );
};
