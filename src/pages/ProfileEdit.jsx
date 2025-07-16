import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { getUserByEmail } from "../API/config";
import { decodeJwt, updateUser } from "../API/UserApi";
import {
  searchUserBankDetails,
  saveUserBankDetails,
  updateUserBankDetails,
} from "../API/userBankDetailsApi";
import { getAllBanksBySearch } from "../API/bankApi";
import { getAllBranchesBySearch } from "../API/branchApi";
import {
  getAllShippingAddressesBySearch,
  saveShippingAddress,
  updateShippingAddress,
} from "../API/shippingAddressApi";
import {
  sendTwoStepEmailVerification,
  verifyTwoStepCode,
} from "../API/UserApi";
import provinceDistrictData from "../utils/provinceDistrictData";
window.__BACKEND_URL__ = "http://localhost:8080";

const tabs = [
  { key: "profile", label: "Profile details" },
  { key: "account", label: "Account settings" },
  { key: "bank", label: "Bank Details" },
  { key: "shipping-address", label: "Shipping Addresses" },
  { key: "privacy", label: "Privacy settings" },
  { key: "security", label: "Security" },
];

function ConfirmChange({ onBack, userEmail }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold mb-4 text-center">Confirm change</h2>
      <p className="text-lg text-gray-600 mb-2 text-center">
        You need to confirm
        <br />
        <span className="font-semibold">{userEmail}</span> is your email address
        before you can update it.
      </p>
      <button className="px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors mb-4">
        Send confirmation email
      </button>
      <button className="text-[#1E90FF] underline mb-8">
        I don't have access to this email
      </button>
      <button onClick={onBack} className="mt-4 text-[#1E90FF] font-medium">
        &larr; Back
      </button>
    </div>
  );
}

function ChangePassword({ onBack }) {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [error, setError] = React.useState("");

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (newPassword.length < 7) {
      setError("New password must be at least 7 characters.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    // TODO: Call your API to change password, passing currentPassword and newPassword
    // Example:
    // const result = await changePasswordApi({ currentPassword, newPassword });
    // if (result.success) { setStatus("Password updated!"); ... }
    setStatus("Password updated successfully!"); // Placeholder
    setTimeout(() => setStatus(""), 3000);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Change password</h2>
      <div className="bg-gray-100 rounded-xl p-6 mb-8">
        <h3 className="font-semibold mb-2">To create a secure password:</h3>
        <ul className="list-disc pl-6 text-gray-600 space-y-1">
          <li>
            When setting up a password, go for something that is not too
            obvious. It can be a combination of numbers, special characters,
            capital and lower case letters. The length of the password should be
            at least 7 characters.
          </li>
          <li>
            Don't use your name or date of birth when setting up a password.
          </li>
          <li>
            Memorize your password. Do not keep any record of it, do not tell
            other people about it. Try to change it regularly.
          </li>
          <li>Make sure no one can see you entering the password.</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 max-w-xl">
        <input
          type="password"
          placeholder="Current password"
          className="border rounded px-4 py-2"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          className="border rounded px-4 py-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Re-enter your new password"
          className="border rounded px-4 py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {status && <div className="text-green-600 text-sm">{status}</div>}
        <button
          className="px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors"
          onClick={handleChangePassword}
        >
          Change password
        </button>
      </div>
      <button onClick={onBack} className="mt-8 text-[#1E90FF] font-medium">
        &larr; Back
      </button>
    </div>
  );
}

function VerifyEmail({ onBack, onSwitchToPhone, userEmail, onEnableTwoStep }) {
  const [email, setEmail] = React.useState("");
  const [step, setStep] = React.useState("send"); // 'send' or 'verify' or 'success'
  const [sentCode, setSentCode] = React.useState("");
  const [inputCode, setInputCode] = React.useState("");
  const [statusMsg, setStatusMsg] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (
      userEmail &&
      email.trim().toLowerCase() !== userEmail.trim().toLowerCase()
    ) {
      setErrorMsg("Wrong email: Please enter your account email.");
      return;
    }
    try {
      await sendTwoStepEmailVerification(email);
      setStep("verify");
      setStatusMsg(`Verification code sent to ${email}`);
      setErrorMsg("");
      setInputCode("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to send verification code. Please try again.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!inputCode || inputCode.length !== 6) {
      setErrorMsg("Wrong OTP or empty");
      return;
    }
    try {
      const result = await verifyTwoStepCode(inputCode);
      // Check backend response for success
      if (
        (result && result.success) ||
        result.status === true ||
        result.verified === true
      ) {
        setStep("success");
        setStatusMsg("Two-step verification successful!");
        setErrorMsg("");
        if (typeof onEnableTwoStep === "function") {
          onEnableTwoStep();
        }
      } else {
        setErrorMsg("Verification failed");
      }
    } catch (err) {
      setErrorMsg("Verification failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Verify your email address
      </h2>
      <p className="text-lg text-gray-600 mb-4 text-center">
        We'll send a confirmation message to your email to verify that this is
        your address.
      </p>
      {step === "send" && (
        <form
          className="w-full max-w-xs flex flex-col items-center gap-4 mb-4"
          onSubmit={handleSend}
        >
          <label className="block text-base font-medium mb-1 w-full text-left">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-4 py-2 w-full text-center"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            className="w-full px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors"
          >
            Send
          </button>
          {errorMsg && (
            <div className="text-red-500 text-sm w-full text-center">
              {errorMsg}
            </div>
          )}
        </form>
      )}
      {step === "verify" && (
        <form
          className="w-full max-w-xs flex flex-col items-center gap-4 mb-4"
          onSubmit={handleVerify}
        >
          <div className="w-full text-center text-green-600 text-sm mb-2">
            {statusMsg}
          </div>
          <label className="block text-base font-medium mb-1 w-full text-left">
            Enter verification code
          </label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="border rounded px-4 py-2 w-full text-center tracking-widest"
            placeholder="6-digit code"
            maxLength={6}
          />
          <button
            type="submit"
            className="w-full px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors"
          >
            Verify
          </button>
          {errorMsg && (
            <div className="text-red-500 text-sm w-full text-center">
              {errorMsg}
            </div>
          )}
        </form>
      )}
      {step === "success" && (
        <div className="w-full max-w-xs flex flex-col items-center gap-4 mb-4">
          <div className="w-full text-center text-green-600 text-lg font-semibold mb-2">
            {statusMsg}
          </div>
          <div className="text-5xl mb-2">✅</div>
        </div>
      )}
      <button
        onClick={onSwitchToPhone}
        className="mt-2 text-[#1E90FF] underline"
      >
        Use phone instead
      </button>
      <div className="text-gray-500 text-center">
        Having trouble?{" "}
        <a href="#" className="underline text-[#1E90FF]">
          Get help
        </a>
      </div>
      <button onClick={onBack} className="mt-8 text-[#1E90FF] font-medium">
        &larr; Back
      </button>
    </div>
  );
}

function VerifyPhone({ onBack, onSwitchToEmail, userEmail, onEnableTwoStep }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Verify your phone number
      </h2>
      <p className="text-lg text-gray-600 mb-4 text-center">
        We'll send a confirmation message or give you a call to verify that this
        is your number.
      </p>
      <form className="w-full max-w-xs flex flex-col items-center gap-4 mb-4">
        <label className="block text-base font-medium mb-1 w-full text-left">
          Phone number
        </label>
        <input
          type="text"
          value="+44"
          className="border rounded px-4 py-2 w-full text-center"
          readOnly
        />
        <button className="w-full px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-[#1876cc] transition-colors">
          Send
        </button>
      </form>
      <button
        onClick={onSwitchToEmail}
        className="mt-2 text-[#1E90FF] underline"
      >
        Use email instead
      </button>
      <div className="text-gray-500 text-center">
        Having trouble?{" "}
        <a href="#" className="underline text-[#1E90FF]">
          Get help
        </a>
      </div>
      <button onClick={onBack} className="mt-8 text-[#1E90FF] font-medium">
        &larr; Back
      </button>
    </div>
  );
}

export const ProfileEdit = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [securityPage, setSecurityPage] = useState(null);
  const [securitySubPage, setSecuritySubPage] = useState(null); // new state for switching between phone/email
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [bankDetails, setBankDetails] = useState(null);
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankId, setBankId] = useState(1);
  const [branchId, setBranchId] = useState(1);
  const [savingBankDetails, setSavingBankDetails] = useState(false);
  const [bankDetailsError, setBankDetailsError] = useState(null);
  const [bankDetailsStatus, setBankDetailsStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [banks, setBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);

  // New state for Branches
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // State for edit mode
  const [isEditingBankDetails, setIsEditingBankDetails] = useState(false);
  const [isAddingShippingAddress, setIsAddingShippingAddress] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [newShippingAddress, setNewShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    district: "",
    province: "",
    isPrimary: false,
    name: "",
    mobileNumber: "",
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editingShippingAddress, setEditingShippingAddress] = useState(null);
  const [isEditingShippingAddress, setIsEditingShippingAddress] =
    useState(false);
  const [savingShippingAddress, setSavingShippingAddress] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);

  const [gender, setGender] = useState("");
  const [birthdayDay, setBirthdayDay] = useState("");
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [birthdayYear, setBirthdayYear] = useState("");

  const [shippingAddressStatus, setShippingAddressStatus] = useState("");

  const navigate = useNavigate();

  // Initialize provinces and districts on mount
  useEffect(() => {
    const allProvinces = provinceDistrictData.map((item) => item.province);
    const allDistricts = provinceDistrictData.flatMap((item) => item.districts);
    setProvinces(allProvinces);
    setFilteredProvinces(allProvinces);
    setDistricts(allDistricts);
    setFilteredDistricts(allDistricts);
  }, []);

  const fetchShippingAddresses = async (userId) => {
    console.log("Fetching shipping addresses for user ID:", userId);
    const addresses = await getAllShippingAddressesBySearch();
    console.log("All shipping addresses fetched:", addresses);
    // Filter addresses by logged-in user's ID
    if (userId && addresses) {
      const userAddresses = addresses.filter(
        (address) => address.userDto?.id === userId
      );
      console.log("Filtered shipping addresses for user:", userAddresses);
      setShippingAddresses(userAddresses);
    } else {
      console.log(
        "User ID not available or no addresses fetched, setting empty array."
      );
      setShippingAddresses([]);
    }
  };

  useEffect(() => {
    const fetchUserAndData = async () => {
      console.log("fetchUserAndData started");
      const token = localStorage.getItem("accessToken");
      console.log("Token:", token);
      if (token) {
        const decoded = decodeJwt(token);
        console.log("Decoded email:", decoded?.sub);
        const userEmail = decoded?.sub;
        if (userEmail) {
          let userData = null;
          try {
            userData = await getUserByEmail(userEmail);
            console.log("User data from API:", userData);
          } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false);
            setShippingAddresses([]); // Clear addresses on user fetch error
            return; // Stop execution if user data cannot be fetched
          }

          if (userData) {
            setUser(userData);
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setAddress(userData.address || "");
            setAbout(userData.about || "");
            setEmail(userData.emailAddress || "");
            setMobileNumber(userData.mobileNumber || "");

            // Fetch bank details (add error handling)
            try {
              console.log(
                "Fetching bank data for account holder:",
                userData.firstName || ""
              );
              const bankDataResponse = await searchUserBankDetails();
              console.log("Bank data response from API:", bankDataResponse);
              const userBankDetail = bankDataResponse.find(
                (detail) => detail.userDto?.id === userData.id
              );
              if (userBankDetail) {
                setBankDetails(userBankDetail);
                setSelectedBankId(userBankDetail.bankDto?.id || "");
                setBankSearch(userBankDetail.bankDto?.name || "");
                setSelectedBranchId(userBankDetail.branchDto?.id || "");
                setBranchSearch(userBankDetail.branchDto?.branchName || "");
                setAccountHolderName(userBankDetail.accountHolderName || "");
                setAccountNumber(userBankDetail.accountNumber || "");
                console.log("Bank details state set:", userBankDetail);
              } else {
                setBankDetails(null);
                setSelectedBankId("");
                setBankSearch("");
                setSelectedBranchId("");
                setBranchSearch("");
                setAccountHolderName("");
                setAccountNumber("");

                console.log("No bank details found for this user.");
              }
            } catch (error) {
              console.error("Error fetching bank details:", error);
              setBankDetails(null); // Ensure bank details state is clear on error
            }

            console.log("User state updated:", {
              firstName: userData.firstName,
              lastName: userData.lastName,
              address: userData.address,
              about: userData.about,
              email: userData.emailAddress,
              mobileNumber: userData.mobileNumber,
            });

            // Now that user data is loaded, fetch shipping addresses using the fetched user ID
            if (userData?.id) {
              await fetchShippingAddresses(userData.id);
            } else {
              console.error("User ID not available after fetching user data.");
              setShippingAddresses([]); // Ensure shipping addresses are cleared if user ID is missing
            }

            // Initialize birthday and gender from userData
            if (userData.dateOfBirth) {
              const [year, month, day] = userData.dateOfBirth.split("-");
              setBirthdayDay(day || "");
              setBirthdayMonth(month || "");
              setBirthdayYear(year || "");
            }
            setGender(userData.gender || "");
          }
        } else {
          console.log("No userEmail from decoded token.");
          setShippingAddresses([]); // Clear shipping addresses if no user email
          setLoading(false);
          return; // Stop execution if no user email
        }
      } else {
        console.log("No accessToken found.");
        setShippingAddresses([]); // Clear shipping addresses if no access token
        setLoading(false);
        return; // Stop execution if no access token
      }

      // Fetch banks and branches (add error handling)
      try {
        console.log("Fetching banks and branches...");
        const banksData = await getAllBanksBySearch();
        setBanks(banksData);
        setFilteredBanks(banksData);
        console.log("Banks fetched:", banksData.length);

        const branchesData = await getAllBranchesBySearch();
        setBranches(branchesData);
        setFilteredBranches(branchesData);
        console.log("Branches fetched:", branchesData.length);
      } catch (error) {
        console.error("Error fetching initial data (banks/branches):", error);
        setBanks([]); // Clear banks/branches state on error
        setFilteredBanks([]);
        setBranches([]);
        setFilteredBranches([]);
      }

      setLoading(false);
      console.log("setLoading(false) called");
    };
    fetchUserAndData();
  }, []); // Empty dependency array means this runs once on mount

  // Effect for filtering banks
  useEffect(() => {
    if (bankSearch.trim() === "") {
      setFilteredBanks(banks);
      if (!bankDetails) {
        setSelectedBankId("");
      }
    } else {
      const filtered = banks.filter((bank) =>
        bank.name.toLowerCase().includes(bankSearch.toLowerCase())
      );
      setFilteredBanks(filtered);
    }
  }, [bankSearch, banks, bankDetails]);

  // Effect for filtering branches
  useEffect(() => {
    if (branchSearch.trim() === "") {
      setFilteredBranches(branches);
      if (!bankDetails) {
        setSelectedBranchId("");
      }
    } else {
      const filtered = branches.filter((branch) =>
        branch.branchName.toLowerCase().includes(branchSearch.toLowerCase())
      );
      setFilteredBranches(filtered);
    }
  }, [branchSearch, branches, bankDetails]);

  const handleProfileUpdate = async () => {
    setUpdateStatus("Updating...");
    // Compose dateOfBirth string if all fields are present
    let dateOfBirth = null;
    if (birthdayYear && birthdayMonth && birthdayDay) {
      dateOfBirth = `${birthdayYear}-${birthdayMonth.padStart(
        2,
        "0"
      )}-${birthdayDay.padStart(2, "0")}`;
    }
    const updatedUserData = {
      ...user,
      firstName: firstName,
      lastName: lastName,
      address: address,
      about: about,
      dateOfBirth: dateOfBirth,
      gender: gender,
    };
    const result = await updateUser(updatedUserData);
    if (result && result.status) {
      setUpdateStatus("Profile updated successfully!");
      setUser(updatedUserData);
    } else {
      setUpdateStatus("Failed to update profile.");
      setError(result?.errorDescription || "An error occurred.");
    }
    setTimeout(() => setUpdateStatus(""), 3000);
    setTimeout(() => setError(null), 3000);
  };

  const handleBankSelect = (bank) => {
    setSelectedBankId(bank.id);
    setBankSearch(bank.name);
    setIsBankDropdownOpen(false);
    if (bankDetailsError && bankDetailsError.includes("bank")) {
      setBankDetailsError(null);
    }
  };

  const handleBankInputChange = (e) => {
    const value = e.target.value;
    setBankSearch(value);
    if (!isBankDropdownOpen && value.length > 0) {
      setIsBankDropdownOpen(true);
    }
    if (banks.find((b) => b.id === parseInt(selectedBankId))?.name !== value) {
      setSelectedBankId("");
    }
    if (bankDetailsError && bankDetailsError.includes("bank")) {
      setBankDetailsError(null);
    }
  };

  const handleClearBankSelection = () => {
    setSelectedBankId("");
    setBankSearch("");
    setFilteredBanks(banks);
    if (bankDetailsError && bankDetailsError.includes("bank")) {
      setBankDetailsError(null);
    }
  };

  // New handlers for Branch dropdown
  const handleBranchSelect = (branch) => {
    setSelectedBranchId(branch.id);
    setBranchSearch(branch.branchName);
    setIsBranchDropdownOpen(false);
    if (bankDetailsError && bankDetailsError.includes("branch")) {
      setBankDetailsError(null);
    }
  };

  const handleBranchInputChange = (e) => {
    const value = e.target.value;
    setBranchSearch(value);
    if (!isBranchDropdownOpen && value.length > 0) {
      setIsBranchDropdownOpen(true);
    }
    if (
      branches.find((b) => b.id === parseInt(selectedBranchId))?.branchName !==
      value
    ) {
      setSelectedBranchId("");
    }
    if (bankDetailsError && bankDetailsError.includes("branch")) {
      setBankDetailsError(null);
    }
  };

  const handleClearBranchSelection = () => {
    setSelectedBranchId("");
    setBranchSearch("");
    setFilteredBranches(branches);
    if (bankDetailsError && bankDetailsError.includes("branch")) {
      setBankDetailsError(null);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isBankDropdownOpen &&
        event.target.closest(".bank-dropdown-container") === null
      ) {
        setIsBankDropdownOpen(false);
        if (
          selectedBankId &&
          banks.find((b) => b.id === parseInt(selectedBankId))?.name !==
            bankSearch
        ) {
          setBankSearch("");
          setSelectedBankId("");
        }
      }
      if (
        isBranchDropdownOpen &&
        event.target.closest(".branch-dropdown-container") === null
      ) {
        setIsBranchDropdownOpen(false);
        if (
          selectedBranchId &&
          branches.find((b) => b.id === parseInt(selectedBranchId))
            ?.branchName !== branchSearch
        ) {
          setBranchSearch("");
          setSelectedBranchId("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isBankDropdownOpen,
    selectedBankId,
    bankSearch,
    isBranchDropdownOpen,
    selectedBranchId,
    branchSearch,
    banks,
    branches,
  ]);

  // Set initial search values and selected IDs when bankDetails is loaded or updated
  useEffect(() => {
    if (bankDetails) {
      setBankSearch(bankDetails.bankDto?.name || "");
      setSelectedBankId(bankDetails.bankDto?.id || "");
      setBranchSearch(bankDetails.branchDto?.branchName || "");
      setSelectedBranchId(bankDetails.branchDto?.id || "");
      setAccountHolderName(bankDetails.accountHolderName || "");
      setAccountNumber(bankDetails.accountNumber || "");
    } else {
      setBankSearch("");
      setSelectedBankId("");
      setBranchSearch("");
      setSelectedBranchId("");
      setAccountHolderName("");
      setAccountNumber("");
    }
    setBankDetailsError(null);
    setBankDetailsStatus("");
  }, [bankDetails]);

  // Clear search and selection when switching away from bank tab or when bankDetails becomes null
  useEffect(() => {
    if (activeTab !== "bank" || !bankDetails) {
      setBankSearch("");
      setSelectedBankId("");
      setBranchSearch("");
      setSelectedBranchId("");
      setIsBankDropdownOpen(false);
      setIsBranchDropdownOpen(false);
      setBankDetailsError(null);
      setBankDetailsStatus("");
      setSavingBankDetails(false);
      setIsEditingBankDetails(false);
    }
  }, [activeTab, bankDetails]);

  const handleSaveBankDetails = async () => {
    setSavingBankDetails(true);
    setBankDetailsStatus("Saving...");
    setBankDetailsError(null);

    // Validation
    if (!accountHolderName.trim()) {
      setBankDetailsError("Please enter account holder name.");
      setSavingBankDetails(false);
      setTimeout(() => setBankDetailsError(null), 3000);
      return;
    }
    if (!accountNumber.trim()) {
      setBankDetailsError("Please enter account number.");
      setSavingBankDetails(false);
      setTimeout(() => setBankDetailsError(null), 3000);
      return;
    }
    if (!selectedBankId) {
      setBankDetailsError("Please select a bank.");
      setSavingBankDetails(false);
      setTimeout(() => setBankDetailsError(null), 3000);
      return;
    }
    if (!selectedBranchId) {
      setBankDetailsError("Please select a branch.");
      setSavingBankDetails(false);
      setTimeout(() => setBankDetailsError(null), 3000);
      return;
    }

    // Build payload
    const bankDetailsPayload = {
      accountHolderName: accountHolderName,
      accountNumber: accountNumber,
      createdAt: new Date().toISOString(),
      userDto: { id: user.id },
      bankDto: { id: parseInt(selectedBankId) },
      branchDto: { id: parseInt(selectedBranchId) },
      isActive: true, // boolean, not 1/0
    };

    // Call save API
    const result = await saveUserBankDetails(bankDetailsPayload);

    if (result && result.status) {
      setBankDetailsStatus("Bank details saved successfully!");
      // Refresh bank details from backend
      const bankDataResponse = await searchUserBankDetails();
      const userBankDetail = bankDataResponse.find(
        (detail) => detail.userDto?.id === user.id
      );
      if (userBankDetail) {
        setBankDetails(userBankDetail);
        setSelectedBankId(userBankDetail.bankDto?.id || "");
        setBankSearch(userBankDetail.bankDto?.name || "");
        setSelectedBranchId(userBankDetail.branchDto?.id || "");
        setBranchSearch(userBankDetail.branchDto?.branchName || "");
        setAccountHolderName(userBankDetail.accountHolderName || "");
        setAccountNumber(userBankDetail.accountNumber || "");
      }
    } else {
      setBankDetailsError(
        result?.errorDescription || "Failed to save bank details."
      );
      setBankDetailsStatus("");
    }
    setSavingBankDetails(false);
    setTimeout(() => setBankDetailsStatus(""), 3000);
    setTimeout(() => setBankDetailsError(null), 3000);
  };

  const handleUpdateBankDetails = async () => {
    setSavingBankDetails(true);
    setBankDetailsStatus("Updating...");
    setBankDetailsError(null);

    // Validation (same as above)
    if (!accountHolderName.trim()) {
      setBankDetailsError("Please enter account holder name.");
      setSavingBankDetails(false);
      setTimeout(() => setBankDetailsError(null), 3000);
      return;
    }
    if (!accountNumber.trim()) {
      setBankDetailsError("Please enter account number.");
      setSavingBankDetails(false);
      setTimeout(() => setBankDetailsError(null), 3000);
      return;
    }
    if (!selectedBankId) {
      setBankDetailsError("Please select a bank.");
      setSavingBankDetails(false);
      setTimeout(() => setBankDetailsError(null), 3000);
      return;
    }
    if (!selectedBranchId) {
      setBankDetailsError("Please select a branch.");
      setSavingBankDetails(false);
      setTimeout(() => setBankDetailsError(null), 3000);
      return;
    }

    // Build payload
    const bankDetailsPayload = {
      id: bankDetails.id,
      accountHolderName: accountHolderName,
      accountNumber: accountNumber,
      createdAt: bankDetails.createdAt,
      userDto: { id: user.id },
      bankDto: { id: parseInt(selectedBankId) },
      branchDto: { id: parseInt(selectedBranchId) },
      isActive: bankDetails.isActive,
    };

    // Call update API
    const result = await updateUserBankDetails(bankDetailsPayload);

    if (result && result.status) {
      setBankDetailsStatus("Bank details updated successfully!");
      // Refresh bank details from backend
      const bankDataResponse = await searchUserBankDetails();
      const userBankDetail = bankDataResponse.find(
        (detail) => detail.userDto?.id === user.id
      );
      if (userBankDetail) {
        setBankDetails(userBankDetail);
        setSelectedBankId(userBankDetail.bankDto?.id || "");
        setBankSearch(userBankDetail.bankDto?.name || "");
        setSelectedBranchId(userBankDetail.branchDto?.id || "");
        setBranchSearch(userBankDetail.branchDto?.branchName || "");
        setAccountHolderName(userBankDetail.accountHolderName || "");
        setAccountNumber(userBankDetail.accountNumber || "");
      }
      setIsEditingBankDetails(false);
    } else {
      setBankDetailsError(
        result?.errorDescription || "Failed to update bank details."
      );
      setBankDetailsStatus("");
    }
    setSavingBankDetails(false);
    setTimeout(() => setBankDetailsStatus(""), 3000);
    setTimeout(() => setBankDetailsError(null), 3000);
  };

  const handleCancelEdit = () => {
    setIsEditingBankDetails(false);
    if (bankDetails) {
      setAccountHolderName(bankDetails.accountHolderName || "");
      setAccountNumber(bankDetails.accountNumber || "");
      setSelectedBankId(bankDetails.bankDto?.id || "");
      setBankSearch(bankDetails.bankDto?.name || "");
      setSelectedBranchId(bankDetails.branchDto?.id || "");
      setBranchSearch(bankDetails.branchDto?.branchName || "");
    }
    setBankDetailsError(null);
    setBankDetailsStatus("");
    setSavingBankDetails(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "province") {
      handleProvinceSelect(value);
    } else if (name === "district") {
      handleDistrictSelect(value);
    } else {
      if (isAddingShippingAddress) {
        setNewShippingAddress({
          ...newShippingAddress,
          [name]: value,
        });
      } else if (editingAddressId) {
        setEditingShippingAddress({
          ...editingShippingAddress,
          [name]: value,
        });
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (isAddingShippingAddress) {
      setNewShippingAddress({
        ...newShippingAddress,
        [name]: checked,
      });
    } else if (editingAddressId) {
      setEditingShippingAddress({
        ...editingShippingAddress,
        [name]: checked,
      });
    }
  };

  const handleDistrictSelect = (district) => {
    if (isAddingShippingAddress) {
      setNewShippingAddress({
        ...newShippingAddress,
        district: district,
      });
    } else if (editingAddressId) {
      setEditingShippingAddress({
        ...editingShippingAddress,
        district: district,
      });
    }
    setShowDistrictDropdown(false);
  };

  const handleProvinceSelect = (province) => {
    if (isAddingShippingAddress) {
      setNewShippingAddress((prev) => ({
        ...prev,
        province: province,
        district: "",
      })); // Clear district when province changes
      // Filter districts based on selected province
      const relatedDistricts =
        provinceDistrictData.find((item) => item.province === province)
          ?.districts || [];
      setFilteredDistricts(relatedDistricts);
      +setShowDistrictDropdown(false); // Close district dropdown after province selection
    } else if (editingAddressId) {
      setEditingShippingAddress((prev) => ({
        ...prev,
        province: province,
        district: "",
      })); // Clear district when province changes
      // Filter districts based on selected province
      const relatedDistricts =
        provinceDistrictData.find((item) => item.province === province)
          ?.districts || [];
      setFilteredDistricts(relatedDistricts);
      +setShowDistrictDropdown(false); // Close district dropdown after province selection
    }
    setShowProvinceDropdown(false);
    setFilteredProvinces(provinces); // Reset province filter
  };

  const handleAddShippingAddressClick = () => {
    setIsAddingShippingAddress(true);
    setEditingAddressId(null);
    setEditingShippingAddress(null);
    setNewShippingAddress({
      address: "",
      city: "",
      postalCode: "",
      district: "",
      province: "",
      isPrimary: false,
      name: "", // Add name field
      mobileNumber: "", // Add mobileNumber field
    });
    setFilteredDistricts(districts);
    setFilteredProvinces(provinces);
  };

  const handleEditShippingAddressClick = (address) => {
    setIsAddingShippingAddress(false);
    setIsEditingShippingAddress(true);
    setEditingAddressId(address.id);
    setEditingShippingAddress({ ...address });
    setFilteredDistricts(districts);
    setFilteredProvinces(provinces);
  };

  const handleSaveNewShippingAddress = async () => {
    // Manual validation for required fields
    if (
      !newShippingAddress.address.trim() ||
      !newShippingAddress.name.trim() ||
      !newShippingAddress.mobileNumber.trim() ||
      !newShippingAddress.province.trim() ||
      !newShippingAddress.district.trim() ||
      !newShippingAddress.postalCode.trim()
    ) {
      setShippingAddressStatus("Please fill in all required fields.");
      setTimeout(() => setShippingAddressStatus(""), 3000);
      return;
    }
    // Mobile number validation: must be exactly 10 digits
    if (!/^[0-9]{10}$/.test(newShippingAddress.mobileNumber)) {
      setShippingAddressStatus("Mobile number must be exactly 10 digits.");
      setTimeout(() => setShippingAddressStatus(""), 3000);
      return;
    }
    setSavingShippingAddress(true);

    // Check for a previously deleted (inactive) address with the same details (case-insensitive, trimmed)
    const normalize = str => (str || "").trim().toLowerCase();
    const match = shippingAddresses.find(addr =>
      !addr.isActive &&
      normalize(addr.address) === normalize(newShippingAddress.address) &&
      normalize(addr.district) === normalize(newShippingAddress.district) &&
      normalize(addr.province) === normalize(newShippingAddress.province) &&
      normalize(addr.postalCode) === normalize(newShippingAddress.postalCode) &&
      normalize(addr.name) === normalize(newShippingAddress.name) &&
      normalize(addr.mobileNumber) === normalize(newShippingAddress.mobileNumber)
    );

    if (match) {
      // Reactivate the address instead of creating a new one
      const payload = {
        ...match,
        ...newShippingAddress,
        isActive: true,
        userDto: { id: user.id },
        country: undefined,
      };
      const response = await updateShippingAddress(payload);
      if (response && response.status) {
        setIsAddingShippingAddress(false);
        setNewShippingAddress({
          address: "",
          city: "",
          postalCode: "",
          district: "",
          province: "",
          isPrimary: shippingAddresses.length === 0 ? true : false,
          name: "",
          mobileNumber: "",
          isActive: 1,
        });
        if (user && user.id) {
          await fetchShippingAddresses(user.id);
        }
        setSavingShippingAddress(false);
        return;
      }
      // handle error if needed
    }

    // First, unset any other primary addresses if the new one is primary
    if (newShippingAddress.isPrimary) {
      const currentlyPrimary = shippingAddresses.find(
        (address) => address.isPrimary
      );
      if (currentlyPrimary) {
        console.log("Unsetting previous primary address:", currentlyPrimary.id);
        // Create a payload to unset isPrimary
        const unsetPrimaryPayload = {
          ...currentlyPrimary,
          isPrimary: false,
          // Ensure userDto is included for the update API
          userDto: { id: user.id },
          // Explicitly set country to undefined if it exists in the original data
          country: undefined,
        };
        // Explicitly include name, mobileNumber, and address if they exist in the original data
        if (currentlyPrimary.name)
          unsetPrimaryPayload.name = currentlyPrimary.name;
        if (currentlyPrimary.mobileNumber)
          unsetPrimaryPayload.mobileNumber = currentlyPrimary.mobileNumber;
        if (currentlyPrimary.address)
          unsetPrimaryPayload.address = currentlyPrimary.address;

        try {
          const updateResponse = await updateShippingAddress(
            unsetPrimaryPayload
          );
          if (updateResponse && !updateResponse.status) {
            console.error(
              "Failed to unset previous primary address:",
              updateResponse.errorDescription
            );
            // Decide how to handle this error - perhaps stop the save process or warn the user
            setSavingShippingAddress(false);
            return; // Stop if unsetting failed critically
          }
        } catch (err) {
          console.error(
            "Error calling updateShippingAddress to unset primary:",
            err
          );
          setSavingShippingAddress(false);
          return; // Stop on API error
        }
      }
    }

    const payload = {
      ...newShippingAddress,
      createdAt: new Date().toISOString(),
      userDto: { id: user.id },
      // Country field removed as per request and from state
      country: undefined, // Explicitly set to undefined to ensure it's not sent
      isActive: 1, // Add isActive field with value 1
    };
    // Ensure name and mobileNumber are included in the payload if they exist in newShippingAddress
    if (newShippingAddress.name) payload.name = newShippingAddress.name;
    if (newShippingAddress.mobileNumber)
      payload.mobileNumber = newShippingAddress.mobileNumber;

    // Also ensure address is not undefined if it was empty string initially
    if (newShippingAddress.address)
      payload.address = newShippingAddress.address;

    const response = await saveShippingAddress(payload);
    if (response && response.status) {
      console.log("Shipping address saved successfully:", response);
      setIsAddingShippingAddress(false);
      setNewShippingAddress({
        address: "",
        city: "", // City field removed as per request
        postalCode: "",
        // Country field removed as per request
        district: "",
        province: "",
        isPrimary: shippingAddresses.length === 0 ? true : false, // Set as primary by default if it's the first address
        name: "", // Add name field
        mobileNumber: "", // Add mobileNumber field
        isActive: 1,
      });
      if (user && user.id) {
        await fetchShippingAddresses(user.id);
      }
    } else {
      console.error(
        "Error saving shipping address:",
        response?.errorDescription || "Failed to save shipping address."
      );
      // Handle save error
    }
    setSavingShippingAddress(false);
  };

  const handleUpdateShippingAddress = async () => {
    if (!editingShippingAddress) return;
    // Manual validation for required fields
    if (
      !editingShippingAddress.address.trim() ||
      !editingShippingAddress.name.trim() ||
      !editingShippingAddress.mobileNumber.trim() ||
      !editingShippingAddress.province.trim() ||
      !editingShippingAddress.district.trim() ||
      !editingShippingAddress.postalCode.trim()
    ) {
      setShippingAddressStatus("Please fill in all required fields.");
      setTimeout(() => setShippingAddressStatus(""), 3000);
      return;
    }
    // Mobile number validation: must be exactly 10 digits
    if (!/^[0-9]{10}$/.test(editingShippingAddress.mobileNumber)) {
      setShippingAddressStatus("Mobile number must be exactly 10 digits.");
      setTimeout(() => setShippingAddressStatus(""), 3000);
      return;
    }
    setSavingShippingAddress(true);
    // First, unset any other primary addresses if the updated one is primary
    if (editingShippingAddress.isPrimary) {
      const currentlyPrimary = shippingAddresses.find(
        (address) =>
          address.isPrimary && address.id !== editingShippingAddress.id
      );
      if (currentlyPrimary) {
        console.log(
          "Unsetting previous primary address on update:",
          currentlyPrimary.id
        );
        // Create a payload to unset isPrimary
        const unsetPrimaryPayload = {
          ...currentlyPrimary,
          isPrimary: false,
          // Ensure userDto is included for the update API
          userDto: { id: user.id },
          // Explicitly set country to undefined if it exists in the original data
          country: undefined,
        };
        // Explicitly include name, mobileNumber, and address if they exist in the original data
        if (currentlyPrimary.name)
          unsetPrimaryPayload.name = currentlyPrimary.name;
        if (currentlyPrimary.mobileNumber)
          unsetPrimaryPayload.mobileNumber = currentlyPrimary.mobileNumber;
        if (currentlyPrimary.address)
          unsetPrimaryPayload.address = currentlyPrimary.address;

        try {
          const updateResponse = await updateShippingAddress(
            unsetPrimaryPayload
          );
          if (updateResponse && !updateResponse.status) {
            console.error(
              "Failed to unset previous primary address on update:",
              updateResponse.errorDescription
            );
            // Decide how to handle this error
            setSavingShippingAddress(false);
            return; // Stop if unsetting failed critically
          }
        } catch (err) {
          console.error(
            "Error calling updateShippingAddress to unset primary on update:",
            err
          );
          setSavingShippingAddress(false);
          return; // Stop on API error
        }
      }
    }

    const payload = {
      ...editingShippingAddress,
      id: editingShippingAddress.id, // Ensure id is present
      userDto: { id: user.id },
      // Country field removed as per request and from state
      country: undefined, // Explicitly set to undefined to ensure it's not sent
    };
    // Ensure name and mobileNumber are included in the payload if they exist in editingShippingAddress
    if (editingShippingAddress.name) payload.name = editingShippingAddress.name;
    if (editingShippingAddress.mobileNumber)
      payload.mobileNumber = editingShippingAddress.mobileNumber;
    // Also ensure address is not undefined if it was empty string initially
    if (editingShippingAddress.address)
      payload.address = editingShippingAddress.address;

    console.log("Shipping address update payload:", payload);
    const response = await updateShippingAddress(payload);

    if (response && response.status) {
      console.log("Shipping address updated successfully:", response);
      setEditingAddressId(null);
      setEditingShippingAddress(null);
      setIsEditingShippingAddress(false);
      if (user && user.id) {
        await fetchShippingAddresses(user.id);
      }
    } else {
      console.error(
        "Error updating shipping address:",
        response?.errorDescription || "Failed to update shipping address."
      );
      // Handle update error
    }
    setSavingShippingAddress(false);
  };

  const handleCancelAddShippingAddress = () => {
    setIsAddingShippingAddress(false);
    setNewShippingAddress({
      address: "",
      city: "",
      postalCode: "",
      district: "",
      province: "",
      isPrimary: false,
      name: "",
      mobileNumber: "",
    });
  };

  const handleCancelEditShippingAddress = () => {
    setEditingAddressId(null);
    setEditingShippingAddress(null);
    setFilteredDistricts(districts);
    setFilteredProvinces(provinces);
  };

  // Add state for filteredDistricts in the component
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  // When province changes in add/edit form, update filteredDistricts
  useEffect(() => {
    if (isAddingShippingAddress && newShippingAddress.province) {
      const found = provinceDistrictData.find(
        (p) => p.province === newShippingAddress.province
      );
      setFilteredDistricts(found ? found.districts : []);
    } else if (editingAddressId && editingShippingAddress?.province) {
      const found = provinceDistrictData.find(
        (p) => p.province === editingShippingAddress.province
      );
      setFilteredDistricts(found ? found.districts : []);
    } else {
      setFilteredDistricts([]);
    }
  }, [
    isAddingShippingAddress,
    newShippingAddress.province,
    editingAddressId,
    editingShippingAddress?.province,
  ]);
  // Handler to disable two-step verification
  const handleDisableTwoStep = async () => {
    if (
      !window.confirm(
        "Are you sure you want to disable 2-step verification? This will make your account less secure."
      )
    ) {
      return;
    }
    const updatedUser = { ...user, twoStepVerification: false };
    const response = await updateUser(updatedUser);
    if (response && response.status) {
      setUser((prev) => ({ ...prev, twoStepVerification: false }));
      setShippingAddressStatus("Two-step verification disabled.");
      setTimeout(() => setShippingAddressStatus(""), 3000);
    } else {
      setShippingAddressStatus("Failed to disable two-step verification.");
      setTimeout(() => setShippingAddressStatus(""), 3000);
    }
  };

  useEffect(() => {
    if (activeTab === "shipping-address" && user?.id) {
      fetchShippingAddresses(user.id);
    }
  }, [activeTab, user]);

  // Add this useEffect to listen for a custom event to refresh shipping addresses
  useEffect(() => {
    const handler = () => {
      if (activeTab === "shipping-address" && user?.id) {
        fetchShippingAddresses(user.id);
      }
    };
    window.addEventListener("refresh-shipping-addresses", handler);
    return () => window.removeEventListener("refresh-shipping-addresses", handler);
  }, [activeTab, user]);

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (error && !user) {
    return (
      <div className="text-red-500 text-center">
        Error loading profile: {error}
      </div>
    );
  }

  if (!user) {
    return <div className="text-center">User not found. Please log in.</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-2 py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6 self-start">Settings</h2>
              <nav className="flex flex-col gap-2 w-full">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setSecurityPage && setSecurityPage(null);
                    }}
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
            {activeTab === "profile" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Profile details</h3>
                <div className="mb-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-base font-medium mb-2">
                      Your photo
                    </span>
                    <img
                      src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&color=fff&size=160`}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mb-2"
                    />
                    <button className="border border-[#1E90FF] text-[#1E90FF] rounded px-4 py-1 font-medium hover:bg-[#e6f3ff] transition">
                      Choose photo
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <span className="block font-medium mb-1">
                          First Name
                        </span>
                        <input
                          type="text"
                          className="border rounded px-3 py-2 w-full"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block font-medium mb-1">
                          Last Name
                        </span>
                        <input
                          type="text"
                          className="border rounded px-3 py-2 w-full"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="block font-medium mb-1">About you</span>
                      <textarea
                        className="border rounded px-3 py-2 w-full min-h-[60px]"
                        placeholder="Tell us more about yourself and your style"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-700">
                  Address
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
                  <div>
                    {/* <span className="block font-medium mb-1">Address</span> */}
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full max-w-xs"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Birthday Section */}
                    <div className="flex-1">
                      <span className="block font-medium mb-2 text-gray-700">
                        Birthday
                      </span>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200"
                            placeholder="Day"
                            maxLength="2"
                            value={birthdayDay}
                            onChange={(e) =>
                              setBirthdayDay(
                                e.target.value.replace(/[^0-9]/g, "")
                              )
                            }
                          />
                        </div>
                        <div className="flex-[2]">
                          <select
                            className="w-full border rounded-lg px-4 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200"
                            value={birthdayMonth}
                            onChange={(e) => setBirthdayMonth(e.target.value)}
                          >
                            <option value="">Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </select>
                        </div>
                        <div className="flex-[1.5]">
                          <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200"
                            placeholder="Year"
                            maxLength="4"
                            value={birthdayYear}
                            onChange={(e) =>
                              setBirthdayYear(
                                e.target.value.replace(/[^0-9]/g, "")
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gender Section */}
                    <div className="flex-1">
                      <span className="block font-medium mb-2 text-gray-700">
                        Gender
                      </span>
                      <select
                        className="w-full border rounded-lg px-4 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition-all duration-200"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  {updateStatus && (
                    <span className="mr-4 text-sm text-green-600">
                      {updateStatus}
                    </span>
                  )}
                  {error && (
                    <span className="mr-4 text-sm text-red-500">{error}</span>
                  )}
                  <button
                    className="px-6 py-2 bg-[#1E90FF] text-white rounded-lg font-medium hover:bg-[#1876cc] transition"
                    onClick={handleProfileUpdate}
                  >
                    Update profile
                  </button>
                </div>
              </div>
            )}
            {activeTab === "account" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Account settings</h3>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
                  <div>
                    <span className="block font-medium mb-1">Email</span>
                    <div className="flex gap-2 items-center">
                      <input
                        type="email"
                        className="border rounded px-3 py-2 w-full max-w-xs"
                        value={email}
                        readOnly
                      />
                      {/* <button className="border border-[#1E90FF] text-[#1E90FF] rounded px-4 py-1 font-medium hover:bg-[#e6f3ff] transition">Change</button> */}
                    </div>
                  </div>
                  <div>
                    <span className="block font-medium mb-1">Phone number</span>
                    <div className="flex gap-2 items-center">
                      <input
                        type="tel"
                        className="border rounded px-3 py-2 w-full max-w-xs"
                        value={mobileNumber}
                        readOnly
                      />
                      <button className="border border-[#1E90FF] text-[#1E90FF] rounded px-4 py-1 font-medium hover:bg-[#e6f3ff] transition">
                        Verify
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="block font-medium mb-1">
                      Whatsapp Number
                    </span>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="border rounded px-3 py-2 w-full max-w-xs"
                        value={user.whatsappNumber || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <span className="block font-medium mb-1">Full name</span>
                      <input
                        type="text"
                        className="border rounded px-3 py-2 w-full max-w-xs"
                        value={`${firstName} ${lastName}`}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-[#1E90FF] text-white rounded-lg font-medium hover:bg-[#1876cc] transition">
                    Save
                  </button>
                </div>
              </div>
            )}
            {activeTab === "bank" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Bank Details</h3>
                {bankDetails ? (
                  isEditingBankDetails ? (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
                      <p className="text-gray-700">
                        Edit your bank details below.
                      </p>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <span className="block font-medium mb-1">
                            Account Holder Name
                          </span>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={accountHolderName}
                            onChange={(e) =>
                              setAccountHolderName(e.target.value)
                            }
                            placeholder="Enter account holder name"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="block font-medium mb-1">
                            Account Number
                          </span>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <span className="block font-medium mb-1">Bank</span>
                          <div className="relative bank-dropdown-container flex items-center w-full">
                            <input
                              type="text"
                              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1E90FF] pr-8"
                              value={bankSearch}
                              onChange={handleBankInputChange}
                              placeholder="Select a bank"
                              onFocus={() => setIsBankDropdownOpen(true)}
                            />
                            {(bankSearch || selectedBankId) && (
                              <button
                                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={handleClearBankSelection}
                                type="button"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                            )}
                            {isBankDropdownOpen && filteredBanks.length > 0 && (
                              <div
                                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                                style={{ top: "100%" }}
                              >
                                <div className="max-h-60 overflow-y-auto">
                                  {filteredBanks.map((bank) => (
                                    <div
                                      key={bank.id}
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => handleBankSelect(bank)}
                                    >
                                      {bank.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {isBankDropdownOpen &&
                              filteredBanks.length === 0 &&
                              bankSearch.length > 0 && (
                                <div
                                  className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                                  style={{ top: "100%" }}
                                >
                                  <div className="px-4 py-2 text-gray-500">
                                    No banks found
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="block font-medium mb-1">Branch</span>
                          <div className="relative branch-dropdown-container flex items-center w-full">
                            <input
                              type="text"
                              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1E90FF] pr-8"
                              value={branchSearch}
                              onChange={handleBranchInputChange}
                              placeholder="Select a branch"
                              onFocus={() => setIsBranchDropdownOpen(true)}
                            />
                            {(branchSearch || selectedBranchId) && (
                              <button
                                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={handleClearBranchSelection}
                                type="button"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                            )}
                            {isBranchDropdownOpen &&
                              filteredBranches.length > 0 && (
                                <div
                                  className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                                  style={{ top: "100%" }}
                                >
                                  <div className="max-h-60 overflow-y-auto">
                                    {filteredBranches.map((branch) => (
                                      <div
                                        key={branch.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                          handleBranchSelect(branch)
                                        }
                                      >
                                        {branch.branchName}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            {isBranchDropdownOpen &&
                              filteredBranches.length === 0 &&
                              branchSearch.length > 0 && (
                                <div
                                  className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                                  style={{ top: "100%" }}
                                >
                                  <div className="px-4 py-2 text-gray-500">
                                    No branches found
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      {bankDetailsError && (
                        <span className="text-red-500 text-sm">
                          {bankDetailsError}
                        </span>
                      )}
                      {bankDetailsStatus && (
                        <span className="text-green-600 text-sm">
                          {bankDetailsStatus}
                        </span>
                      )}
                      <div className="flex justify-end gap-4 mt-4">
                        <button
                          className="rounded-lg px-6 py-2 border border-[#1E90FF] text-[#1E90FF] font-medium hover:bg-[#e6f3ff] transition"
                          onClick={handleCancelEdit}
                          disabled={savingBankDetails}
                        >
                          Cancel
                        </button>
                        <button
                          className="rounded-lg px-6 py-2 bg-[#1E90FF] text-white font-medium hover:bg-[#1876cc] transition"
                          onClick={handleUpdateBankDetails}
                          disabled={savingBankDetails}
                        >
                          {savingBankDetails
                            ? "Updating..."
                            : "Update Bank Details"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <span className="block font-medium mb-1">
                            Account Holder Name
                          </span>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={bankDetails.accountHolderName}
                            readOnly
                          />
                        </div>
                        <div className="flex-1">
                          <span className="block font-medium mb-1">
                            Account Number
                          </span>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={bankDetails.accountNumber}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <span className="block font-medium mb-1">
                            Bank Name
                          </span>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={bankDetails.bankDto?.name || "N/A"}
                            readOnly
                          />
                        </div>
                        <div className="flex-1">
                          <span className="block font-medium mb-1">
                            Branch Name
                          </span>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={bankDetails.branchDto?.branchName || "N/A"}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="rounded-lg px-6 py-2 bg-[#1E90FF] text-white font-medium hover:bg-[#1876cc] transition"
                          onClick={() => {
                            setIsEditingBankDetails(true);
                            if (bankDetails) {
                              setSelectedBankId(bankDetails.bankDto?.id || "");
                              setBankSearch(bankDetails.bankDto?.name || "");
                              setSelectedBranchId(bankDetails.branchDto?.id || "");
                              setBranchSearch(bankDetails.branchDto?.branchName || "");
                            }
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-4">
                    <p className="text-gray-700">
                      No bank details found. Please add your bank details.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <span className="block font-medium mb-1">
                          Account Holder Name
                        </span>
                        <input
                          type="text"
                          className="border rounded px-3 py-2 w-full"
                          value={accountHolderName}
                          onChange={(e) => setAccountHolderName(e.target.value)}
                          placeholder="Enter account holder name"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block font-medium mb-1">
                          Account Number
                        </span>
                        <input
                          type="text"
                          className="border rounded px-3 py-2 w-full"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="Enter account number"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <span className="block font-medium mb-1">Bank</span>
                        <div className="relative bank-dropdown-container flex items-center w-full">
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1E90FF] pr-8"
                            value={bankSearch}
                            onChange={handleBankInputChange}
                            placeholder="Select a bank"
                            onFocus={() => setIsBankDropdownOpen(true)}
                          />
                          {(bankSearch || selectedBankId) && (
                            <button
                              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                              onClick={handleClearBankSelection}
                              type="button"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          )}
                          {isBankDropdownOpen && filteredBanks.length > 0 && (
                            <div
                              className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                              style={{ top: "100%" }}
                            >
                              <div className="max-h-60 overflow-y-auto">
                                {filteredBanks.map((bank) => (
                                  <div
                                    key={bank.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleBankSelect(bank)}
                                  >
                                    {bank.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {isBankDropdownOpen &&
                            filteredBanks.length === 0 &&
                            bankSearch.length > 0 && (
                              <div
                                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                                style={{ top: "100%" }}
                              >
                                <div className="px-4 py-2 text-gray-500">
                                  No banks found
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="block font-medium mb-1">Branch</span>
                        <div className="relative branch-dropdown-container flex items-center w-full">
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1E90FF] pr-8"
                            value={branchSearch}
                            onChange={handleBranchInputChange}
                            placeholder="Select a branch"
                            onFocus={() => setIsBranchDropdownOpen(true)}
                          />
                          {(branchSearch || selectedBranchId) && (
                            <button
                              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                              onClick={handleClearBranchSelection}
                              type="button"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                ></path>
                              </svg>
                            </button>
                          )}
                          {isBranchDropdownOpen &&
                            filteredBranches.length > 0 && (
                              <div
                                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                                style={{ top: "100%" }}
                              >
                                <div className="max-h-60 overflow-y-auto">
                                  {filteredBranches.map((branch) => (
                                    <div
                                      key={branch.id}
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => handleBranchSelect(branch)}
                                    >
                                      {branch.branchName}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          {isBranchDropdownOpen &&
                            filteredBranches.length === 0 &&
                            branchSearch.length > 0 && (
                              <div
                                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                                style={{ top: "100%" }}
                              >
                                <div className="px-4 py-2 text-gray-500">
                                  No branches found
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {bankDetailsError && (
                      <span className="text-red-500 text-sm">
                        {bankDetailsError}
                      </span>
                    )}
                    {bankDetailsStatus && (
                      <span className="text-green-600 text-sm">
                        {bankDetailsStatus}
                      </span>
                    )}
                    <button
                      className="rounded-lg px-6 py-2 bg-[#1E90FF] text-white font-medium hover:bg-[#1876cc] transition"
                      onClick={handleSaveBankDetails}
                      disabled={savingBankDetails}
                    >
                      {savingBankDetails ? "Saving..." : "Save Bank Details"}
                    </button>
                  </div>
                )}
              </div>
            )}
            {activeTab === "shipping-address" && (
              <div>
                <h3 className="text-xl font-bold mb-6">Shipping Addresses</h3>
                {shippingAddressStatus && (
                  <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 text-center font-medium">
                    {shippingAddressStatus}
                  </div>
                )}
                {shippingAddresses.length === 0 &&
                !isAddingShippingAddress &&
                !editingAddressId &&
                shippingAddresses.filter(addr => addr.isActive).length <= 5 ? (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      No shipping addresses found.
                    </p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-[#1E90FF] text-white rounded hover:bg-[#1876cc] transition-colors"
                      onClick={handleAddShippingAddressClick}
                    >
                      Add New Shipping Address
                    </button>
                  </div>
                ) : isAddingShippingAddress || editingAddressId ? (
                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Street address
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={
                            isAddingShippingAddress
                              ? newShippingAddress.address
                              : editingShippingAddress?.address || ""
                          }
                          onChange={handleInputChange}
                          autoComplete="street-address"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={
                            isAddingShippingAddress
                              ? newShippingAddress.name
                              : editingShippingAddress?.name || ""
                          }
                          onChange={handleInputChange}
                          autoComplete="name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="mobileNumber"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Mobile Number
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="mobileNumber"
                          id="mobileNumber"
                          value={
                            isAddingShippingAddress
                              ? newShippingAddress.mobileNumber
                              : editingShippingAddress?.mobileNumber || ""
                          }
                          onChange={handleInputChange}
                          autoComplete="tel"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 sm:col-start-1">
                      <label
                        htmlFor="province"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Province
                      </label>
                      <div className="mt-2">
                        <select
                          name="province"
                          id="province"
                          value={
                            isAddingShippingAddress
                              ? newShippingAddress.province
                              : editingShippingAddress?.province || ""
                          }
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                          autoComplete="address-level1"
                          required
                        >
                          <option value="" disabled>
                            Select Province
                          </option>
                          {provinceDistrictData.map((p) => (
                            <option key={p.province} value={p.province}>
                              {p.province}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="district"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        District
                      </label>
                      <div className="mt-2">
                        <select
                          name="district"
                          id="district"
                          value={
                            isAddingShippingAddress
                              ? newShippingAddress.district
                              : editingShippingAddress?.district || ""
                          }
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                          autoComplete="address-level2"
                          required
                          disabled={
                            !(isAddingShippingAddress
                              ? newShippingAddress.province
                              : editingShippingAddress?.province)
                          }
                        >
                          <option value="" disabled>
                            Select District
                          </option>
                          {filteredDistricts.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        ZIP / Postal code
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="postalCode"
                          id="postal-code"
                          value={
                            isAddingShippingAddress
                              ? newShippingAddress.postalCode
                              : editingShippingAddress?.postalCode || ""
                          }
                          onChange={handleInputChange}
                          autoComplete="postal-code"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="isPrimary"
                            name="isPrimary"
                            type="checkbox"
                            checked={
                              isAddingShippingAddress
                                ? newShippingAddress.isPrimary
                                : editingShippingAddress?.isPrimary || false
                            }
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="isPrimary"
                            className="font-medium text-gray-900"
                          >
                            Set as Primary Address
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-6 mt-4">
                      {isAddingShippingAddress ? (
                        <button
                          type="button"
                          className="bg-[#1E90FF] text-white px-6 py-2 rounded hover:bg-[#1876cc] transition-colors mr-2"
                          onClick={handleSaveNewShippingAddress}
                        >
                          Save Shipping Address
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="bg-[#1E90FF] text-white px-6 py-2 rounded hover:bg-[#1876cc] transition-colors mr-2"
                          onClick={handleUpdateShippingAddress}
                        >
                          Update Shipping Address
                        </button>
                      )}
                      <button
                        type="button"
                        className="px-4 py-2 border border-[#1E90FF] text-[#1E90FF] rounded hover:bg-[#e6f2ff] transition-colors"
                        onClick={
                          isAddingShippingAddress
                            ? handleCancelAddShippingAddress
                            : handleCancelEditShippingAddress
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display list of addresses
                  <div className="mt-4">
                    {shippingAddresses.filter(address => address.isActive).map((address) => (
                      <div
                        key={address.id}
                        className="border rounded-md p-3 mb-4"
                      >
                        <p className="text-base font-semibold text-gray-900">
                          {address.name}
                          {address.mobileNumber && (
                            <span className="text-gray-500 font-normal ml-2">| {address.mobileNumber}</span>
                          )}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 flex-wrap">
                            <div>
                              <p className="text-sm text-gray-700">
                                {address.address}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.district}, {address.province}, {address.postalCode}
                              </p>
                            </div>
                            {address.isPrimary && (
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="p-2 rounded hover:bg-red-100"
                              title="Delete Address"
                              onClick={async () => {
                                const payload = { ...address, isActive: false };
                                await updateShippingAddress(payload);
                                if (user && user.id) await fetchShippingAddresses(user.id);
                              }}
                            >
                              {/* Simple bucket SVG icon */}
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M9.75 11.25v4.5m4.5-4.5v4.5M4.5 7.5h15m-10.125 0V5.25A1.5 1.5 0 0110.875 3.75h2.25a1.5 1.5 0 011.5 1.5V7.5" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1 bg-[#1E90FF] text-white rounded hover:bg-[#1876cc] text-xs ml-4 transition-colors"
                              onClick={() => handleEditShippingAddressClick(address)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!isAddingShippingAddress && !editingAddressId && shippingAddresses.filter(addr => addr.isActive).length < 5 && (
                      <button
                        type="button"
                        className="mt-4 px-4 py-2 bg-[#1E90FF] text-white rounded hover:bg-[#1876cc] transition-colors"
                        onClick={handleAddShippingAddressClick}
                      >
                        Add New Shipping Address
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab === "privacy" && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                  Privacy settings
                </h3>
                <div className="bg-white/80 backdrop-blur rounded-xl shadow p-2 md:p-4 flex flex-col gap-3 md:gap-4">
                  <style>{`
                    .toggle-switch {
                      position: relative;
                      display: inline-block;
                      width: 40px;
                      height: 22px;
                    }
                    .toggle-switch input { display: none; }
                    .slider {
                      position: absolute;
                      cursor: pointer;
                      top: 0; left: 0; right: 0; bottom: 0;
                      background: #e5e7eb;
                      transition: .4s;
                      border-radius: 9999px;
                    }
                    .slider:before {
                      position: absolute;
                      content: "";
                      height: 18px;
                      width: 18px;
                      left: 2px;
                      bottom: 2px;
                      background: white;
                      transition: .4s;
                      border-radius: 50%;
                      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                    }
                    input:checked + .slider {
                      background: #1E90FF;
                    }
                    input:checked + .slider:before {
                      transform: translateX(18px);
                    }
                  `}</style>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <div>
                      <span className="block font-semibold text-gray-900">
                        Feature my items in marketing campaigns for a chance to
                        sell faster
                      </span>
                      <span className="block text-gray-500 text-sm">
                        This allows to showcase my items on social media and
                        other websites. The increased visibility could lead to
                        quicker sales.
                      </span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <span className="font-semibold text-gray-900">
                      Notify owners when I favourite their items
                    </span>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <span className="font-semibold text-gray-900">
                      Allow third-party tracking
                    </span>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm min-h-[64px]">
                    <span className="font-semibold text-gray-900 flex-1">
                      Allow E-Com to personalise my feed and search results by
                      evaluating my preferences, settings, previous purchases
                      and usage of E-Com website and app
                    </span>
                    <label className="toggle-switch self-center">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <span className="font-semibold text-gray-900">
                      Allow E-Com to display my recently viewed items on my
                      Homepage.
                    </span>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm">
                    <span className="block font-semibold text-gray-900">
                      Download account data
                    </span>
                    <span className="block text-gray-500 text-sm">
                      Request a copy of your E-Com account data.
                    </span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "security" && !securityPage && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                  Keep your account secure
                </h3>
                <div className="bg-white/80 backdrop-blur rounded-xl shadow p-2 md:p-4 flex flex-col gap-3 md:gap-4">
                  <button
                    onClick={() => setSecurityPage("confirm")}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm hover:shadow-md border border-transparent hover:border-[#1E90FF] transition group focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E90FF]/10 text-[#1E90FF] text-lg">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M16 12v1a4 4 0 0 1-8 0v-1" />
                        <path d="M12 16v2" />
                        <circle cx="12" cy="8" r="4" />
                      </svg>
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-base font-semibold text-[#1E90FF] group-hover:underline">
                        Confirm change
                      </span>
                      <span className="block text-gray-500 text-sm">
                        Keep your email up to date.
                      </span>
                    </span>
                  </button>
                  <button
                    onClick={() => setSecurityPage("password")}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm hover:shadow-md border border-transparent hover:border-[#1E90FF] transition group focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E90FF]/10 text-[#1E90FF] text-lg">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-base font-semibold text-[#1E90FF] group-hover:underline">
                        Password
                      </span>
                      <span className="block text-gray-500 text-sm">
                        Protect your account with a stronger password.
                      </span>
                    </span>
                  </button>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f3f6fd] to-[#eaf1fb] shadow-sm border border-transparent">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1E90FF]/10 text-[#1E90FF] text-lg">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 19v-6" />
                        <circle cx="12" cy="7" r="4" />
                        <path d="M5 21h14" />
                      </svg>
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-base font-semibold text-[#1E90FF] group-hover:underline">
                        2-step verification
                      </span>
                      <span className="block text-gray-500 text-sm">
                        Confirm new logins with a 6-digit code.
                      </span>
                    </span>
                    {user?.twoStepVerification === true ? (
                      <button
                        onClick={handleDisableTwoStep}
                        className="ml-4 px-4 py-2 rounded bg-red-500 text-white font-semibold transition"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={() => setSecurityPage("verify")}
                        className="ml-4 px-4 py-2 rounded bg-[#1E90FF] text-white font-semibold transition"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "security" && securityPage === "confirm" && (
              <ConfirmChange
                onBack={() => setSecurityPage(null)}
                userEmail={email}
              />
            )}
            {activeTab === "security" && securityPage === "password" && (
              <ChangePassword onBack={() => setSecurityPage(null)} />
            )}
            {activeTab === "security" &&
              securityPage === "verify" &&
              !securitySubPage && (
                <VerifyPhone
                  onBack={() => setSecurityPage(null)}
                  onSwitchToEmail={() => setSecuritySubPage("email")}
                  userEmail={email}
                  onEnableTwoStep={() => {
                    setUser((prev) => ({ ...prev, twoStepVerification: true }));
                    setShippingAddressStatus("Two-step verification enabled.");
                    setTimeout(() => setShippingAddressStatus(""), 3000);
                    setSecurityPage(null);
                  }}
                />
              )}
            {activeTab === "security" &&
              securityPage === "verify" &&
              securitySubPage === "email" && (
                <VerifyEmail
                  onBack={() => setSecuritySubPage(null)}
                  onSwitchToPhone={() => setSecuritySubPage(null)}
                  userEmail={email}
                  onEnableTwoStep={() => {
                    setUser((prev) => ({ ...prev, twoStepVerification: true }));
                    setShippingAddressStatus("Two-step verification enabled.");
                    setTimeout(() => setShippingAddressStatus(""), 3000);
                    setSecurityPage(null);
                  }}
                />
              )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileEdit;
