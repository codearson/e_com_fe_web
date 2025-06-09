import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { getAllproductPage } from "../API/productApi";
import { useNavigate } from "react-router-dom";

// Sample product data for when user is not authenticated
const sampleProducts = [
    {
        id: 1,
        name: "iPhone 13 Pro",
        price: 999.99,
        description: "Latest iPhone model with advanced camera system",
        image: "https://images.unsplash.com/photo-1656392851225-ec9a304ef9d0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGklMjBwaG9uZSUyMDEzJTIwcHJvfGVufDB8fDB8fHww",
        condition: "New",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: "Samsung Galaxy S21",
        price: 799.99,
        description: "5G Android smartphone with 120Hz display",
        image: "https://images.unsplash.com/photo-1611282104572-e0b0e9a707f7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FsYXh5JTIwczIxJTIwdWx0cmF8ZW58MHx8MHx8fDA%3D",
        condition: "New",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: "MacBook Pro 2023",
        price: 1299.99,
        description: "Powerful laptop with M2 chip",
        image: "https://plus.unsplash.com/premium_photo-1681160405609-389cd83998d0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG1hYyUyMGJvb2slMjBwcm98ZW58MHx8MHx8fDA%3D",
        condition: "Refurbished",
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        name: "iPad Air",
        price: 599.99,
        description: "Versatile tablet for work and entertainment",
        image: "https://images.unsplash.com/photo-1682426526490-667d4912b8de?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SSUyMHBhZCUyMGFpcnxlbnwwfHwwfHx8MA%3D%3D",
        condition: "New",
        createdAt: new Date().toISOString()
    }
];

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
            imageUrl: product.imageUrl || product.image,
            brand: product.brand || { brand: '' },
            quentity: product.quentity || product.stock || 0,
            conditions: product.conditions || { name: product.condition || 'Used' },
            productCategory: product.productCategory || { name: product.category || 'Uncategorized' },
            createdAt: product.createdAt,
            size: product.size || '',
            color: product.color || ''
        };
        navigate('/productView', { state: { product: normalizedProduct } });
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
                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">Latest Products</h2>
                    <p className="text-gray-600 mb-8">Check out our newest arrivals</p>
                    
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
                                            src={product.imageUrl || product.image} 
                                            alt={product.title || product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
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
