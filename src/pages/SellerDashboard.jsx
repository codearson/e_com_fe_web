import React, { useState, useEffect } from "react";
import {
  saveShippingPreferences,
  getShippingPreferencesByUserId,
  deleteShippingPreference,
  updateShippingPreference,
} from "../API/shippingPreferencesApi";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { decodeJwt } from "../API/UserApi";
import { getUserByEmail } from "../API/config";
import Modal from "../components/Modal";
import { getProductsByUserId } from "../API/productApi";
import { filterProductsWithActiveImages } from "../API/ProductImageApi";
import { BASE_BACKEND_URL } from "../API/config";

const ProductCard = ({ product, onClick, isSelected }) => {
  const { title, price, imageUrl } = product;
  const fullImageUrl = imageUrl
    ? `${BASE_BACKEND_URL}${imageUrl}`
    : "https://via.placeholder.com/150";

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer ${
        isSelected ? "border-blue-500" : "border-gray-300"
      }`}
      onClick={() => onClick(product.id)}
    >
      <img
        src={fullImageUrl}
        alt={title}
        className="w-full h-32 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">Rs.{price}</p>
    </div>
  );
};

const tabs = [
  { key: "listing-items", label: "Listing Items" },
  { key: "shipping-preferences", label: "Shipping Preferences" },
  { key: "promotions", label: "Promotional Tools" },
  { key: "offers", label: "Offers to Likers" },
  { key: "order-shipping", label: "Order & Shipping Management" },
  { key: "additional-policies", label: "Additional Policies (Pro Only)" },
  { key: "selling-guide", label: "Selling Guide" },
];

const SellerDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("listing-items");
  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    const getUserIdFromToken = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        const decoded = decodeJwt(token);
        const email = decoded?.sub;
        if (!email) return null;

        const userData = await getUserByEmail(email);
        setUserId(userData?.id);
      } catch (error) {
        console.error("Error getting user ID from token:", error);
        return null;
      }
    };

    getUserIdFromToken();
  }, []);

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (userId) {
        try {
          const products = await getProductsByUserId(userId);
          const productsWithActiveImages = await filterProductsWithActiveImages(
            products
          );
          setUserProducts(productsWithActiveImages);
        } catch (error) {
          console.error("Error fetching user products:", error);
          setUserProducts([]);
        }
      }
    };
    fetchUserProducts();
  }, [userId]);

  const [listings, setListings] = useState([]);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  const [rawShippingPreferences, setRawShippingPreferences] = useState([]);
  const [shippingPreferences, setShippingPreferences] = useState([]);
  const [showAddPreferenceForm, setShowAddPreferenceForm] = useState(false);
  const [newPreferenceName, setNewPreferenceName] = useState("");
  const [newPreferenceCouriers, setNewPreferenceCouriers] = useState([]);
  const [newPreferencePackageSizes, setNewPreferencePackageSizes] = useState(
    []
  );
  const [newPreferenceCustomWeight, setNewPreferenceCustomWeight] =
    useState(false);
  const [customWeightValue, setCustomWeightValue] = useState("");
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [savingPreference, setSavingPreference] = useState(false);
  const [error, setError] = useState(null);
  const [shippingSearchTerm, setShippingSearchTerm] = useState("");
  const [editingPreference, setEditingPreference] = useState(null);

  const [promotions, setPromotions] = useState([]);
  const [showAddPromotionForm, setShowAddPromotionForm] = useState(false);
  const [newPromotionType, setNewPromotionType] = useState("");
  const [newPromotionDuration, setNewPromotionDuration] = useState("");
  const [newPromotionItemIds, setNewPromotionItemIds] = useState([]);
  const [promotionSearchTerm, setPromotionSearchTerm] = useState("");

  const [favorites, setFavorites] = useState([
    // Mock data: In production, fetch via API (e.g., GET /api/favorites/:sellerId)
    {
      itemId: null,
      buyerId: "buyer1",
      buyerName: "John Doe",
      buyerEmail: "john@example.com",
    },
    {
      itemId: null,
      buyerId: "buyer2",
      buyerName: "Jane Smith",
      buyerEmail: "jane@example.com",
    },
  ]);
  const [offers, setOffers] = useState([]);
  const [showAddOfferForm, setShowAddOfferForm] = useState(false);
  const [newOfferItemId, setNewOfferItemId] = useState("");
  const [newOfferBuyerId, setNewOfferBuyerId] = useState("");
  const [newOfferDiscount, setNewOfferDiscount] = useState("");
  const [newOfferDuration, setNewOfferDuration] = useState("");

  const [orders, setOrders] = useState([
    // Mock data: In production, fetch via API (e.g., GET /api/orders/:sellerId)
    {
      id: 1,
      itemId: null,
      buyerName: "John Doe",
      buyerEmail: "john@example.com",
      buyerAddress: "123 Main St, London, UK",
      status: "Pending",
      courier: "Royal Mail",
      trackingNumber: "",
      shippingFee: 400.0,
      sellerPaysShipping: false,
    },
    {
      id: 2,
      itemId: null,
      buyerName: "Jane Smith",
      buyerEmail: "jane@example.com",
      buyerAddress: "456 Elm St, Manchester, UK",
      status: "Shipped",
      courier: "Evri",
      trackingNumber: "EVRI123456",
      shippingFee: 1000.0,
      sellerPaysShipping: true,
    },
  ]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingTrackingNumber, setEditingTrackingNumber] = useState("");
  const [editingStatus, setEditingStatus] = useState("");
  const [editingSellerPaysShipping, setEditingSellerPaysShipping] =
    useState(false);

  const fixedPrices = {
    Small: 400.0,
    Medium: 1000.0,
    Large: 4000.0,
  };

  // Calculate custom weight price based on weight range
  const calculateCustomWeightPrice = (weight) => {
    const weightNum = parseFloat(weight);
    if (weightNum >= 16 && weightNum <= 20) return 7000.0;
    if (weightNum >= 21 && weightNum <= 25) return 10000.0;
    return 0; // Invalid weight
  };

  // Calculate promotion cost based on type and duration
  const calculatePromotionCost = (type, duration) => {
    const durationNum = parseInt(duration);
    if (type === "Item Bump") return durationNum * 100.0;
    if (type === "Wardrobe Spotlight") return durationNum * 200.0;
    return 0;
  };

  // Group shipping preferences by name to combine multiple package options
  const groupShippingPreferences = (preferences) => {
    const grouped = {};

    preferences.forEach((pref) => {
      const { shippingName, courierService, packageWeight, price } = pref;
      if (!grouped[shippingName]) {
        grouped[shippingName] = {
          name: shippingName,
          couriers: new Set(),
          packages: [],
        };
      }
      grouped[shippingName].couriers.add(courierService);
      grouped[shippingName].packages.push({
        weight: packageWeight,
        price,
        id: pref.id,
      });
    });

    // Convert sets to arrays for rendering
    Object.values(grouped).forEach((group) => {
      group.couriers = Array.from(group.couriers);
    });

    return Object.values(grouped);
  };

  const loadShippingPreferences = async () => {
    if (!userId) return;
    setLoadingPreferences(true);
    setError(null);
    try {
      const preferences = await getShippingPreferencesByUserId(userId);
      setRawShippingPreferences(preferences);
      const groupedPreferences = groupShippingPreferences(preferences);
      setShippingPreferences(groupedPreferences);
    } catch (err) {
      setError("Failed to load shipping preferences.");
      console.error("Error fetching shipping preferences:", err);
    } finally {
      setLoadingPreferences(false);
    }
  };

  // Fetch shipping preferences when component mounts
  useEffect(() => {
    if (userId) {
      loadShippingPreferences();
    }
  }, [userId]);

  const handleEditPreference = (shippingName) => {
    const preferenceToEdit = shippingPreferences.find(
      (p) => p.name === shippingName
    );
    if (preferenceToEdit) {
      setEditingPreference(preferenceToEdit);
      setNewPreferenceName(preferenceToEdit.name);
      setNewPreferenceCouriers(preferenceToEdit.couriers);
      const packageSizes = preferenceToEdit.packages
        .map((p) => {
          if (p.weight > 0 && p.weight <= 1.5) return "Small";
          if (p.weight > 1.5 && p.weight <= 5) return "Medium";
          if (p.weight > 5 && p.weight <= 15) return "Large";
          return null;
        })
        .filter(Boolean);
      setNewPreferencePackageSizes(packageSizes);
      const customPackage = preferenceToEdit.packages.find(
        (p) => p.weight >= 15
      );
      if (customPackage) {
        setNewPreferenceCustomWeight(true);
        setCustomWeightValue(customPackage.weight);
      } else {
        setNewPreferenceCustomWeight(false);
        setCustomWeightValue("");
      }
    }
  };

  const handleUpdatePreference = async (e) => {
    e.preventDefault();
    if (!editingPreference) return;

    setSavingPreference(true);
    setError(null);

    const packageSizeToWeight = {
      Small: 1,
      Medium: 5,
      Large: 15,
    };

    const existingPreferences = rawShippingPreferences.filter(
      (p) => p.shippingName === editingPreference.name
    );

    const newPreferences = [];
    newPreferenceCouriers.forEach((courier) => {
      newPreferencePackageSizes.forEach((size) => {
        newPreferences.push({
          shippingName: newPreferenceName,
          courierService: courier,
          packageWeight: packageSizeToWeight[size],
          price: fixedPrices[size],
          isActive: true,
          userDto: { id: userId },
        });
      });

      if (newPreferenceCustomWeight && customWeightValue) {
        newPreferences.push({
          shippingName: newPreferenceName,
          courierService: courier,
          packageWeight: parseFloat(customWeightValue),
          price: calculateCustomWeightPrice(customWeightValue),
          isActive: true,
          userDto: { id: userId },
        });
      }
    });

    const preferencesToUpdate = [];
    const preferencesToAdd = [];
    const preferencesToDeactivate = [];

    newPreferences.forEach((newPref) => {
      const existingPref = existingPreferences.find(
        (p) =>
          p.courierService === newPref.courierService &&
          p.packageWeight === newPref.packageWeight
      );
      if (existingPref) {
        preferencesToUpdate.push({ ...existingPref, ...newPref });
      } else {
        preferencesToAdd.push(newPref);
      }
    });

    existingPreferences.forEach((existingPref) => {
      const newPref = newPreferences.find(
        (p) =>
          p.courierService === existingPref.courierService &&
          p.packageWeight === existingPref.packageWeight
      );
      if (!newPref) {
        preferencesToDeactivate.push({ ...existingPref, isActive: 0 });
      }
    });

    try {
      for (const pref of preferencesToUpdate) {
        await updateShippingPreference(pref);
      }
      for (const pref of preferencesToAdd) {
        await saveShippingPreferences(pref);
      }
      for (const pref of preferencesToDeactivate) {
        await updateShippingPreference(pref);
      }

      setEditingPreference(null);
      loadShippingPreferences();
      alert(`Shipping preference "${newPreferenceName}" updated!`);
    } catch (err) {
      setError("Failed to update shipping preference.");
      console.error("Error updating shipping preference:", err);
    } finally {
      setSavingPreference(false);
    }
  };

  const handleDeletePreference = async (shippingName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the shipping preference "${shippingName}"?`
      )
    ) {
      return;
    }

    const preferencesToDelete = rawShippingPreferences.filter(
      (p) => p.shippingName === shippingName
    );

    try {
      for (const pref of preferencesToDelete) {
        const updatedPref = { ...pref, isActive: 0 };
        const response = await updateShippingPreference(updatedPref);
        if (response.errorDescription) {
          throw new Error(response.errorDescription);
        }
      }

      loadShippingPreferences();
      alert(`Shipping preference "${shippingName}" deleted!`);
    } catch (err) {
      setError("Failed to delete shipping preference.");
      console.error("Error deleting shipping preference:", err);
    }
  };

  const toggleNewPreferenceCourier = (courier) => {
    setNewPreferenceCouriers((prev) =>
      prev.includes(courier)
        ? prev.filter((c) => c !== courier)
        : [...prev, courier]
    );
  };

  const toggleNewPreferencePackageSize = (size) => {
    setNewPreferencePackageSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleNewPreferenceCustomWeight = () => {
    setNewPreferenceCustomWeight((prev) => !prev);
  };

  const handleSaveNewPreference = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to save preferences.");
      return;
    }

    if (!newPreferenceName.trim()) {
      alert("Please enter a name for the shipping preference.");
      return;
    }
    if (newPreferenceCouriers.length === 0) {
      alert("Please select at least one courier for this preference.");
      return;
    }
    if (newPreferencePackageSizes.length === 0 && !newPreferenceCustomWeight) {
      alert("Please select at least one package size or custom weight.");
      return;
    }
    if (newPreferenceCustomWeight) {
      const weightNum = parseFloat(customWeightValue);
      if (!customWeightValue || weightNum < 16 || weightNum > 25) {
        alert("Please enter a valid custom weight (16–25kg).");
        return;
      }
    }

    const packageSizeToWeight = {
      Small: 1,
      Medium: 5,
      Large: 15,
    };

    const preferencesToSave = [];

    newPreferenceCouriers.forEach((courier) => {
      newPreferencePackageSizes.forEach((size) => {
        preferencesToSave.push({
          shippingName: newPreferenceName,
          courierService: courier,
          packageWeight: packageSizeToWeight[size],
          price: fixedPrices[size],
          isActive: true,
        });
      });

      if (newPreferenceCustomWeight && customWeightValue) {
        preferencesToSave.push({
          shippingName: newPreferenceName,
          courierService: courier,
          packageWeight: parseFloat(customWeightValue),
          price: calculateCustomWeightPrice(customWeightValue),
          isActive: true,
        });
      }
    });

    setSavingPreference(true);
    setError(null);
    try {
      const savedPreferences = [];
      for (const pref of preferencesToSave) {
        const response = await saveShippingPreferences(pref);
        if (response.errorDescription) {
          setError(response.errorDescription);
          break;
        } else {
          savedPreferences.push(response);
        }
      }

      if (!error) {
        const allPreferences = await getShippingPreferencesByUserId(userId);
        const groupedPreferences = groupShippingPreferences(allPreferences);
        setShippingPreferences(groupedPreferences);
        alert(`Shipping preference "'${newPreferenceName}'" saved!`);
      }
    } catch (err) {
      setError("Failed to save shipping preference.");
      console.error("Error saving shipping preference:", err);
    } finally {
      setSavingPreference(false);
    }

    setNewPreferenceName("");
    setNewPreferenceCouriers([]);
    setNewPreferencePackageSizes([]);
    setNewPreferenceCustomWeight(false);
    setCustomWeightValue("");
    setShowAddPreferenceForm(false);
  };

  const handleSaveNewPromotion = (e) => {
    e.preventDefault();
    if (!newPromotionType) {
      alert("Please select a promotion type.");
      return;
    }
    if (!newPromotionDuration) {
      alert("Please select a duration.");
      return;
    }
    if (newPromotionType === "Item Bump" && newPromotionItemIds.length === 0) {
      alert("Please select at least one item for Item Bump.");
      return;
    }

    const newPromotion = {
      id: Date.now(), // Unique ID for the promotion
      type: newPromotionType,
      duration: parseInt(newPromotionDuration),
      cost: calculatePromotionCost(newPromotionType, newPromotionDuration),
      itemIds: newPromotionItemIds, // Store multiple item IDs if applicable
      status: "Active", // Mock status
    };

    setPromotions((prev) => [...prev, newPromotion]);
    // In production: fetch('/api/promotions', { method: 'POST', body: JSON.stringify(newPromotions) })
    setNewPromotionType("");
    setNewPromotionDuration("");
    setNewPromotionItemIds([]);
    setShowAddPromotionForm(false);
    alert(
      `Promotion "'${newPromotionType}'" for ${newPromotionDuration} days saved for ${newPromotionItemIds.length} items!`
    );
  };

  const handleSaveNewOffer = (e) => {
    e.preventDefault();
    if (!newOfferItemId) {
      alert("Please select an item.");
      return;
    }
    if (!newOfferBuyerId) {
      alert("Please select a buyer.");
      return;
    }
    if (!newOfferDiscount || newOfferDiscount < 5 || newOfferDiscount > 50) {
      alert("Please enter a valid discount percentage (5–50%).");
      return;
    }
    if (!newOfferDuration) {
      alert("Please select a duration.");
      return;
    }

    const newOffer = {
      id: Date.now(),
      itemId: newOfferItemId,
      buyerId: newOfferBuyerId,
      discount: parseFloat(newOfferDiscount),
      duration: parseInt(newOfferDuration),
      status: "Pending", // Mock status
    };

    setOffers((prev) => [...prev, newOffer]);
    // In production: fetch('/api/offers', { method: 'POST', body: JSON.stringify(newOffer) })
    setNewOfferItemId("");
    setNewOfferBuyerId("");
  };

  const handleBumpItem = (itemId) => {
    setActiveTab("promotions");
    setNewPromotionType("Item Bump");
    setNewPromotionItemIds([itemId]);
    setShowAddPromotionForm(true);
  };

  const handleTrackOrder = (orderId) => {
    alert(`Tracking info for order ${orderId}: In Transit`);
    // In production: fetch(`/api/orders/track/${orderId}`).then((response) => { /* Display tracking details */ })
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-2 py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6 self-start">Dashboard</h2>
              <nav className="flex flex-col gap-2 w-full">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full px-5 py-2 text-base font-semibold transition rounded-full text-left
                      ${
                        activeTab === tab.key
                          ? "bg-[#1E90FF] text-white shadow-md"
                          : "bg-transparent text-gray-700 hover:bg-[#eaf1fb] hover:text-[#1E90FF]"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
          {/* Main Content */}
          <section className="flex-1 bg-white rounded-2xl shadow p-4 md:p-8 min-h-[400px]">
            {activeTab === "listing-items" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Listing Items</h3>
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                  <form
                    className="space-y-4 mb-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newItem.title || !newItem.price) return;
                      const newItemWithId = { ...newItem, id: Date.now() };
                      setListings([...listings, newItemWithId]);
                      // Update favorites with new itemId for testing
                      setFavorites((prev) =>
                        prev.map((fav) => ({
                          ...fav,
                          itemId: fav.itemId || newItemWithId.id,
                        }))
                      );
                      setNewItem({
                        title: "",
                        description: "",
                        price: "",
                        category: "",
                      });
                    }}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Item Title"
                        className="border rounded px-3 py-2 w-full"
                        value={newItem.title}
                        onChange={(e) =>
                          setNewItem({ ...newItem, title: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Price (Rs.)"
                        className="border rounded px-3 py-2 w-full"
                        value={newItem.price}
                        onChange={(e) =>
                          setNewItem({ ...newItem, price: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        className="border rounded px-3 py-2 w-full"
                        value={newItem.category}
                        onChange={(e) =>
                          setNewItem({ ...newItem, category: e.target.value })
                        }
                      />
                      <textarea
                        placeholder="Description"
                        className="border rounded px-3 py-2 w-full"
                        rows={4}
                        value={newItem.description}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1E90FF] hover:bg-[#1C86EE] text-white font-bold py-2 px-4 rounded-full"
                    >
                      Add Listing
                    </button>
                  </form>

                  <h4 className="text-lg font-semibold mb-3">
                    Your Listed Items
                  </h4>
                  {listings.length === 0 ? (
                    <p className="text-gray-500">No items listed yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {listings.map((item) => (
                        <li
                          key={item.id}
                          className="border rounded-lg p-4 flex justify-between items-start"
                        >
                          <div>
                            <h5 className="text-lg font-bold text-[#1E90FF]">
                              {item.title}
                            </h5>
                            <p className="text-gray-700">Rs.{item.price}</p>
                            <p className="text-sm text-gray-500">
                              {item.category}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              className="text-sm text-white bg-[#1E90FF] px-3 py-1 rounded hover:bg-[#1C86EE]"
                              onClick={() =>
                                console.log(
                                  "Edit button clicked for item:",
                                  item.id
                                )
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                              onClick={() =>
                                setListings(
                                  listings.filter((i) => i.id !== item.id)
                                )
                              }
                            >
                              Delete
                            </button>
                            <button
                              className="text-sm text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600 mt-2"
                              onClick={() => handleBumpItem(item.id)}
                            >
                              Bump
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {error && <p className="text-red-500 mt-4">Error: {error}</p>}
                </div>
              </div>
            )}
            {activeTab === "shipping-preferences" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Shipping Preferences</h3>
                <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-6">
                  <button
                    onClick={() => {
                      setNewPreferenceName("");
                      setNewPreferenceCouriers([]);
                      setNewPreferencePackageSizes([]);
                      setNewPreferenceCustomWeight(false);
                      setCustomWeightValue("");
                      setEditingPreference(null);
                      setShowAddPreferenceForm(true);
                    }}
                    className="bg-[#1E90FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1C86EE]"
                  >
                    Create New Shipping Preference
                  </button>

                  {showAddPreferenceForm && (
                    <form
                      onSubmit={handleSaveNewPreference}
                      className="space-y-6 mt-4"
                    >
                      <div>
                        <h4 className="text-md font-semibold mb-2 text-gray-800">
                          Preference Name
                        </h4>
                        <input
                          type="text"
                          placeholder="e.g., Standard Shipping"
                          className="border rounded px-3 py-2 w-full"
                          value={newPreferenceName}
                          onChange={(e) => setNewPreferenceName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <h4 className="text-md font-semibold mb-2 text-gray-800">
                          Available Couriers
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Select shipping providers for buyers (based on your
                          location; more options = faster sales). Buyers choose
                          from these.
                        </p>
                        <div className="flex flex-col gap-2">
                          {["Prompt xpress"].map((courier) => (
                            <label key={courier} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={newPreferenceCouriers.includes(
                                  courier
                                )}
                                onChange={() =>
                                  toggleNewPreferenceCourier(courier)
                                }
                                className="mr-2"
                              />
                              {courier}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold mb-2 text-gray-800">
                          Package Sizes and Prices
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Select accepted package sizes (fixed prices apply).
                        </p>
                        <div className="flex flex-col gap-4">
                          {[
                            {
                              size: "Small",
                              weight: "<1.5kg",
                              price: fixedPrices.Small,
                            },
                            {
                              size: "Medium",
                              weight: "<5kg",
                              price: fixedPrices.Medium,
                            },
                            {
                              size: "Large",
                              weight: "<15kg",
                              price: fixedPrices.Large,
                            },
                          ].map(({ size, weight, price }) => (
                            <div key={size} className="flex items-center gap-4">
                              <label className="flex items-center flex-1">
                                <input
                                  type="checkbox"
                                  checked={newPreferencePackageSizes.includes(
                                    size
                                  )}
                                  onChange={() =>
                                    toggleNewPreferencePackageSize(size)
                                  }
                                  className="mr-2"
                                />
                                {size} ({weight}, Rs.{price.toFixed(2)})
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold mb-2 text-gray-800">
                          Custom Weight (16–25kg)
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Enter weight (16–25kg); price is auto-calculated.
                        </p>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center flex-1">
                            <input
                              type="checkbox"
                              checked={newPreferenceCustomWeight}
                              onChange={toggleNewPreferenceCustomWeight}
                              className="mr-2"
                            />
                            Custom Weight (16–25kg)
                          </label>
                          <input
                            type="number"
                            placeholder="Weight (kg)"
                            className="border rounded px-3 py-2 w-32"
                            value={customWeightValue}
                            onChange={(e) =>
                              setCustomWeightValue(e.target.value)
                            }
                            min="16"
                            max="25"
                            step="0.01"
                            disabled={!newPreferenceCustomWeight}
                          />
                          {newPreferenceCustomWeight && customWeightValue && (
                            <span className="text-gray-700">
                              Rs.
                              {calculateCustomWeightPrice(
                                customWeightValue
                              ).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="bg-[#1E90FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1C86EE]"
                          disabled={savingPreference}
                        >
                          {savingPreference ? "Saving..." : "Save Preference"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddPreferenceForm(false)}
                          className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600"
                          disabled={savingPreference}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <h4 className="text-lg font-semibold mb-3 mt-6">
                    Your Shipping Preferences
                  </h4>
                  <input
                    type="text"
                    placeholder="Search Shipping Preferences..."
                    className="border rounded px-3 py-2 w-full mb-4"
                    value={shippingSearchTerm}
                    onChange={(e) => setShippingSearchTerm(e.target.value)}
                  />
                  <div className="max-h-96 overflow-y-auto">
                    {loadingPreferences ? (
                      <p>Loading shipping preferences...</p>
                    ) : shippingPreferences.length === 0 ? (
                      <p className="text-gray-500">
                        No shipping preferences created yet.
                      </p>
                    ) : (
                      <ul className="space-y-4">
                        {shippingPreferences
                          .filter((pref) =>
                            pref.name
                              .toLowerCase()
                              .includes(shippingSearchTerm.toLowerCase())
                          )
                          .map((pref) => (
                            <li
                              key={pref.name}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-lg font-bold text-[#1E90FF]">
                                    {pref.name}
                                  </h5>
                                  <p className="text-gray-700">
                                    Couriers:{" "}
                                    {pref.couriers.join(", ") || "None"}
                                  </p>
                                  <p className="text-gray-700">
                                    Package Sizes and Prices:
                                  </p>
                                  <ul className="list-disc pl-5 text-gray-700">
                                    {pref.packages.map((pkg) => (
                                      <li key={pkg.id}>
                                        {pkg.weight}kg: Rs.
                                        {pkg.price.toFixed(2)}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="flex items-center">
                                  <button
                                    className="text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                                    onClick={() =>
                                      handleEditPreference(pref.name)
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 ml-2"
                                    onClick={() =>
                                      handleDeletePreference(pref.name)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                  {error && <p className="text-red-500 mt-4">Error: {error}</p>}
                </div>
              </div>
            )}
            {activeTab === "promotions" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Promotional Tools</h3>
                <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-6">
                  <button
                    onClick={() => setShowAddPromotionForm(true)}
                    className="bg-[#1E90FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1C86EE]"
                  >
                    Create New Promotion
                  </button>

                  {showAddPromotionForm && (
                    <form
                      onSubmit={handleSaveNewPromotion}
                      className="space-y-6 mt-4"
                    >
                      <div>
                        <h4 className="text-md font-semibold mb-2 text-gray-800">
                          Promotion Type
                        </h4>
                        <select
                          className="border rounded px-3 py-2 w-full"
                          value={newPromotionType}
                          onChange={(e) => setNewPromotionType(e.target.value)}
                          required
                        >
                          <option value="">Select a promotion type</option>
                          <option value="Item Bump">Item Bump</option>
                          <option value="Wardrobe Spotlight">
                            Wardrobe Spotlight
                          </option>
                        </select>
                      </div>

                      {newPromotionType === "Item Bump" && (
                        <div>
                          <h4 className="text-md font-semibold mb-2 text-gray-800">
                            Select Item
                          </h4>
                          <input
                            type="text"
                            placeholder="Search by product name..."
                            className="border rounded px-3 py-2 w-full mb-4"
                            onChange={(e) => setPromotionSearchTerm(e.target.value)}
                          />
                          {userProducts.length === 0 ? (
                            <p className="text-sm text-red-500">
                              No items listed. Please add items in the Listing
                              Items tab first.
                            </p>
                          ) : (
                            <div className="max-h-96 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
                              {userProducts
                                .filter((product) =>
                                  product.title
                                    .toLowerCase()
                                    .includes(promotionSearchTerm.toLowerCase())
                                )
                                .map((product) => (
                                  <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={(productId) =>
                                      setNewPromotionItemIds((prev) =>
                                        prev.includes(productId)
                                          ? prev.filter((id) => id !== productId)
                                          : [...prev, productId]
                                      )
                                    }
                                    isSelected={newPromotionItemIds.includes(
                                      product.id
                                    )}
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <h4 className="text-md font-semibold mb-2 text-gray-800">
                          Duration
                        </h4>
                        <select
                          className="border rounded px-3 py-2 w-full"
                          value={newPromotionDuration}
                          onChange={(e) =>
                            setNewPromotionDuration(e.target.value)
                          }
                          required
                        >
                          <option value="">Select duration</option>
                          {newPromotionType === "Item Bump" ? (
                            <>
                              <option value="3">3 days</option>
                              <option value="5">5 days</option>
                              <option value="7">7 days</option>
                            </>
                          ) : (
                            <option value="7">7 days</option>
                          )}
                        </select>
                      </div>

                      {newPromotionType && newPromotionDuration && (
                        <div>
                          <h4 className="text-md font-semibold mb-2 text-gray-800">
                            Cost
                          </h4>
                          <p className="text-gray-700">
                            Rs.
                            {calculatePromotionCost(
                              newPromotionType,
                              newPromotionDuration
                            ).toFixed(2)}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="bg-[#1E90FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1C86EE]"
                          disabled={
                            newPromotionType === "Item Bump" &&
                            userProducts.length === 0
                          }
                        >
                          Save Promotion
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddPromotionForm(false);
                            setNewPromotionType("");
                            setNewPromotionDuration("");
                            setNewPromotionItemIds([]);
                          }}
                          className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <h4 className="text-lg font-semibold mb-3 mt-6">
                    Your Promotions
                  </h4>
                  {promotions.length === 0 ? (
                    <p className="text-gray-500">No promotions created yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {promotions.map((promo) => (
                        <li key={promo.id} className="border rounded-lg p-4">
                          <h5 className="text-lg font-bold text-[#1E90FF]">
                            {promo.type}
                          </h5>
                          <p className="text-gray-700">
                            Duration: {promo.duration} days
                          </p>
                          <p className="text-gray-700">
                            Cost: Rs.{promo.cost.toFixed(2)}
                          </p>
                          {promo.itemIds && (
                            <p className="text-gray-700">
                              Item(s):{" "}
                              {Array.isArray(promo.itemIds)
                                ? promo.itemIds
                                    .map(
                                      (id) =>
                                        userProducts.find((item) => item.id === id)
                                          ?.title || "Unknown"
                                    )
                                    .join(", ")
                                : userProducts.find(
                                    (item) => item.id === promo.itemIds
                                  )?.title || "Unknown"}
                            </p>
                          )}
                          <p className="text-gray-700">
                            Status: {promo.status}
                          </p>
                          <button
                            className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 mt-2"
                            onClick={() => handleDeletePromotion(promo.id)}
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            {activeTab === "offers" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Offers to Likers</h3>
                <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-6">
                  <button
                    onClick={() => setShowAddOfferForm(true)}
                    className="bg-[#1E90FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1C86EE]"
                  >
                    Create New Offer
                  </button>

                  {showAddOfferForm && (
                    <form
                      onSubmit={handleSaveNewOffer}
                      className="space-y-6 mt-4"
                    >
                      <div>
                        <h4 className="text-md font-semibold mb-2 text-gray-800">
                          Select Item
                        </h4>
                        {userProducts.length === 0 ? (
                          <p className="text-sm text-red-500">
                            No items listed. Please add items in the Listing
                            Items tab first.
                          </p>
                        ) : (
                          <select
                            className="border rounded px-3 py-2 w-full"
                            value={newOfferItemId}
                            onChange={(e) => {
                              setNewOfferItemId(e.target.value);
                              setNewOfferBuyerId(""); // Reset buyer when item changes
                            }}
                            required
                          >
                            <option value="">Select an item</option>
                            {userProducts.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.title}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {newOfferItemId && (
                        <div>
                          <h4 className="text-md font-semibold mb-2 text-gray-800">
                            Select Buyer
                          </h4>
                          {favorites.filter(
                            (fav) => fav.itemId === newOfferItemId
                          ).length === 0 ? (
                            <p className="text-sm text-red-500">
                              No buyers have favorited this item.
                            </p>
                          ) : (
                            <select
                              className="border rounded px-3 py-2 w-full"
                              value={newOfferBuyerId}
                              onChange={(e) =>
                                setNewOfferBuyerId(e.target.value)
                              }
                              required
                            >
                              <option value="">Select a buyer</option>
                              {favorites
                                .filter((fav) => fav.itemId === newOfferItemId)
                                .map((fav) => (
                                  <option key={fav.buyerId} value={fav.buyerId}>
                                    {fav.buyerName} ({fav.buyerEmail})
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      )}

                      <div>
                        <h4 className="text-md font-semibold mb-2 text-gray-800">
                          Discount Percentage
                        </h4>
                        <input
                          type="number"
                          placeholder="Discount (5–50%)"
                          className="border rounded px-3 py-2 w-full"
                          value={newOfferDiscount}
                          onChange={(e) => setNewOfferDiscount(e.target.value)}
                          min="5"
                          max="50"
                          step="1"
                          required
                        />
                      </div>

                      <div>
                        <h4 className="text-md font-semibold mb-2 text-gray-800">
                          Offer Duration
                        </h4>
                        <select
                          className="border rounded px-3 py-2 w-full"
                          value={newOfferDuration}
                          onChange={(e) => setNewOfferDuration(e.target.value)}
                          required
                        >
                          <option value="">Select duration</option>
                          <option value="1">1 day</option>
                          <option value="3">3 days</option>
                          <option value="5">5 days</option>
                        </select>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="bg-[#1E90FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1C86EE]"
                          disabled={
                            userProducts.length === 0 ||
                            (newOfferItemId &&
                              favorites.filter(
                                (fav) => fav.itemId === newOfferItemId
                              ).length === 0)
                          }
                        >
                          Send Offer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddOfferForm(false);
                            setNewOfferItemId("");
                            setNewOfferBuyerId("");
                            setNewOfferDiscount("");
                            setNewOfferDuration("");
                          }}
                          className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <h4 className="text-lg font-semibold mb-3 mt-6">
                    Your Offers
                  </h4>
                  {offers.length === 0 ? (
                    <p className="text-gray-500">No offers sent yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {offers.map((offer) => (
                        <li key={offer.id} className="border rounded-lg p-4">
                          <h5 className="text-lg font-bold text-[#1E90FF]">
                            Item:{" "}
                            {userProducts.find(
                              (item) => item.id === offer.itemId
                            )?.title || "Unknown"}
                          </h5>
                          <p className="text-gray-700">
                            Buyer:{" "}
                            {favorites.find(
                              (fav) => fav.buyerId === offer.buyerId
                            )?.buyerName || "Unknown"}{" "}
                            (
                            {favorites.find(
                              (fav) => fav.buyerId === offer.buyerId
                            )?.buyerEmail || "Unknown"}
                            )
                          </p>
                          <p className="text-gray-700">
                            Discount: {offer.discount}%
                          </p>
                          <p className="text-gray-700">
                            Duration: {offer.duration} days
                          </p>
                          <p className="text-gray-700">
                            Status: {offer.status}
                          </p>
                          <button
                            className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 mt-2"
                            onClick={() => handleDeleteOffer(offer.id)}
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            {activeTab === "order-shipping" && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Order & Shipping Management
                </h3>
                <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-6">
                  <h4 className="text-lg font-semibold mb-3">Your Orders</h4>
                  {orders.length === 0 ? (
                    <p className="text-gray-500">No orders yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {orders.map((order) => (
                        <li key={order.id} className="border rounded-lg p-4">
                          <h5 className="text-lg font-bold text-[#1E90FF]">
                            Order ID: {order.id}
                          </h5>
                          <p className="text-gray-700">
                            Item:{" "}
                            {userProducts.find(
                              (item) => item.id === order.itemId
                            )?.title || "Unknown"}
                          </p>
                          <p className="text-gray-700">
                            Buyer: {order.buyerName} ({order.buyerEmail})
                          </p>
                          <p className="text-gray-700">
                            Address: {order.buyerAddress}
                          </p>
                          <p className="text-gray-700">
                            Status: {order.status}
                          </p>
                          <p className="text-gray-700">
                            Courier: {order.courier}
                          </p>
                          <p className="text-gray-700">
                            Tracking Number: {order.trackingNumber || "Not set"}
                          </p>
                          <p className="text-gray-700">
                            Shipping Fee: Rs.{order.shippingFee.toFixed(2)} (
                            {order.sellerPaysShipping
                              ? "Seller Pays"
                              : "Buyer Pays"}
                            )
                          </p>
                          <div className="flex gap-4 mt-2">
                            <button
                              className="text-sm text-white bg-[#1E90FF] px-3 py-1 rounded hover:bg-[#1C86EE]"
                              onClick={() => {
                                setEditingOrderId(order.id);
                                setEditingStatus(order.status);
                                setEditingTrackingNumber(order.trackingNumber);
                                setEditingSellerPaysShipping(
                                  order.sellerPaysShipping
                                );
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-sm text-white bg-[#1E90FF] px-3 py-1 rounded hover:bg-[#1C86EE]"
                              onClick={() => handleGenerateLabel(order.id)}
                            >
                              Generate Label
                            </button>
                            <button
                              className="text-sm text-white bg-[#1E90FF] px-3 py-1 rounded hover:bg-[#1C86EE]"
                              onClick={() => handleTrackOrder(order.id)}
                            >
                              Track
                            </button>
                          </div>
                          {editingOrderId === order.id && (
                            <form
                              onSubmit={handleUpdateOrder}
                              className="space-y-4 mt-4"
                            >
                              <div>
                                <label className="text-sm text-gray-800">
                                  Status
                                </label>
                                <select
                                  className="border rounded px-3 py-2 w-full"
                                  value={editingStatus}
                                  onChange={(e) =>
                                    setEditingStatus(e.target.value)
                                  }
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Returned">Returned</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-sm text-gray-800">
                                  Tracking Number
                                </label>
                                <input
                                  type="text"
                                  className="border rounded px-3 py-2 w-full"
                                  value={editingTrackingNumber}
                                  onChange={(e) =>
                                    setEditingTrackingNumber(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={editingSellerPaysShipping}
                                    onChange={(e) =>
                                      setEditingSellerPaysShipping(
                                        e.target.checked
                                      )
                                    }
                                    className="mr-2"
                                  />
                                  Seller Pays Shipping Fee
                                </label>
                              </div>
                              <div className="flex gap-4">
                                <button
                                  type="submit"
                                  className="bg-[#1E90FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1C86EE]"
                                >
                                  Update Order
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingOrderId(null)}
                                  className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            {activeTab === "additional-policies" && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Additional Policies (Pro Only)
                </h3>
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                  <p className="text-gray-700">
                    Define return, refund, and warranty policies. Visible only
                    to Pro sellers.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "selling-guide" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Selling Guide</h3>
                <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">
                      List your items
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Find out what you can sell on Vinted.</li>
                      <li>
                        Add a few nice, clear photos of the item. If it's an
                        item by a well-known brand, add at least 5 pictures of
                        it to show its authenticity.
                      </li>
                      <li>
                        Be specific and honest in the item's description, and
                        select the correct parcel size.
                      </li>
                      <li>
                        If it’s an electronic device, make sure to delete any
                        personal data and disconnect any personal accounts.
                      </li>
                      <li>
                        Remember that listing has no fees, and uploading more
                        items can help you sell faster.
                      </li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-600">
                      <b>Note:</b> Once you upload an item, it might get
                      screened automatically to go through a standard check to
                      make sure it follows our Catalogue Rules and guidelines
                      for selling. Normally, it takes up to 1 minute but, in
                      some cases, can take up to 1 or 2 days.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">
                      While you wait for buyers
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>
                        Get noticed — bump your items and use Wardrobe Spotlight
                        to boost your wardrobe's visibility.
                      </li>
                      <li>
                        Set a discount for item bundles: this may encourage
                        members to buy more items from you.
                      </li>
                      <li>
                        Choose which carriers will be available to your buyers.
                        The more shipping options you offer, the faster your
                        items are likely to sell.
                      </li>
                      <li>
                        Once a buyer contacts you, use the “Make an offer”
                        button to suggest a better price for a single item.
                      </li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-600">
                      <b>Important:</b> For the best selling experience, be sure
                      to use the Vinted system throughout the trading process.
                      It includes everything you need to sell successfully —
                      from tracked and compensated shipping to verified reviews
                      from real buyers, and support if things don’t go as
                      expected.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">
                      Sold! It’s time to ship the item
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Pack your item. A personal touch is always nice.</li>
                      <li>
                        Ship the item within 5 working days of the sale
                        (otherwise the order will be cancelled automatically and
                        the user will be refunded).
                      </li>
                      <li>
                        Use the shipping option your buyer has chosen to avoid
                        any issues with parcel tracking or even cancelled
                        orders.
                      </li>
                      <li>Track your parcel on Vinted if you'd like to.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">
                      Delivered! Get your earnings and leave feedback
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>
                        As soon as the buyer receives the item and there are no
                        issues, your payment will become available in your
                        Vinted Balance.
                      </li>
                      <li>
                        Money withdrawals may take up to 5 business days to
                        appear in your bank account.
                      </li>
                      <li>
                        Leave feedback to your buyer and help to build trust
                        within the community.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">
                      Good to know
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>
                        If you have closed an empty locker compartment and
                        couldn't resend the item using the same label, cancel
                        the order, explain what happened to the buyer, and ask
                        them to buy that item again so a new label will be
                        generated.
                      </li>
                      <li>
                        Note that if you sell a sealed item, any warranty for
                        the item may be affected if it’s opened by the buyer or
                        during the Electronics Verification service. We don’t
                        offer compensation for any potentially affected
                        warranties.
                      </li>
                      <li>
                        If you ever experience any improper behaviour,
                        harassment or spam activities from other members, we
                        encourage you to report them so we can put a stop to it
                        immediately.
                      </li>
                      <li>
                        You have the option to block users (press ⓘ in the top
                        right corner in your conversation screen with the other
                        member and choose “Block”).
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
        <Modal
          open={!!editingPreference}
          onClose={() => setEditingPreference(null)}
        >
          {editingPreference && (
            <form onSubmit={handleUpdatePreference} className="space-y-6 mt-4">
              <h3 className="text-xl font-bold mb-4">
                Edit Shipping Preference
              </h3>
              <div>
                <h4 className="text-md font-semibold mb-2 text-gray-800">
                  Preference Name
                </h4>
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  value={newPreferenceName}
                  onChange={(e) => setNewPreferenceName(e.target.value)}
                  required
                />
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2 text-gray-800">
                  Available Couriers
                </h4>
                <div className="flex flex-col gap-2">
                  {["Prompt xpress"].map((courier) => (
                    <label key={courier} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPreferenceCouriers.includes(courier)}
                        onChange={() => toggleNewPreferenceCourier(courier)}
                        className="mr-2"
                      />
                      {courier}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2 text-gray-800">
                  Package Sizes
                </h4>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      size: "Small",
                      weight: "<1.5kg",
                      price: fixedPrices.Small,
                    },
                    {
                      size: "Medium",
                      weight: "<5kg",
                      price: fixedPrices.Medium,
                    },
                    {
                      size: "Large",
                      weight: "<15kg",
                      price: fixedPrices.Large,
                    },
                  ].map(({ size, weight, price }) => (
                    <div key={size} className="flex items-center gap-4">
                      <label className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          checked={newPreferencePackageSizes.includes(size)}
                          onChange={() => toggleNewPreferencePackageSize(size)}
                          className="mr-2"
                        />
                        {size} ({weight}, Rs.{price.toFixed(2)})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2 text-gray-800">
                  Custom Weight (16–25kg)
                </h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={newPreferenceCustomWeight}
                      onChange={toggleNewPreferenceCustomWeight}
                      className="mr-2"
                    />
                    Custom Weight (16–25kg)
                  </label>
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    className="border rounded px-3 py-2 w-32"
                    value={customWeightValue}
                    onChange={(e) => setCustomWeightValue(e.target.value)}
                    min="16"
                    max="25"
                    step="0.01"
                    disabled={!newPreferenceCustomWeight}
                  />
                  {newPreferenceCustomWeight && customWeightValue && (
                    <span className="text-gray-700">
                      Rs.
                      {calculateCustomWeightPrice(customWeightValue).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#1E90FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1C86EE]"
                  disabled={savingPreference}
                >
                  {savingPreference ? "Updating..." : "Update Preference"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPreference(null)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600"
                  disabled={savingPreference}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Modal>
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
