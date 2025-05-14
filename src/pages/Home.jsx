export const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[600px] bg-gray-100">
                <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Our Store</h1>
                        <p className="text-xl text-gray-600 mb-8">Discover amazing products at great prices</p>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
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
                            <div key={category} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">{category}</h3>
                                <p className="text-gray-600">Explore our {category.toLowerCase()} collection</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-8">Featured Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                                <h3 className="font-medium text-gray-900 mb-2">Product Name</h3>
                                <p className="text-gray-600 mb-2">$99.99</p>
                                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
