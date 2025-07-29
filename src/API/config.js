import axios from "axios";

export const BASE_BACKEND_URL = "http://localhost:8080";
//export const BASE_BACKEND_URL = "https://ecombe-production.up.railway.app";

export const getAccessToken = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_BACKEND_URL}/user/login`, {
      username,
      password,
    });

    if (response.data.responseDto?.accessToken) {
      const accessToken = response.data.responseDto.accessToken;
      localStorage.setItem("accessToken", accessToken);
      return { success: true, token: accessToken };
    }

    const errorMessage = response.data.responseDto || response.data.errorDescription;

    if (errorMessage) {
      if (errorMessage.toLowerCase().includes("not exists")) {
        return { success: false, error: "email_not_found" };
      } else if (errorMessage.toLowerCase().includes("bad credentials")) {
        return { success: false, error: "incorrect_password" };
      }
    }

    return { success: false, error: "general_error" };
  } catch (err) {
    return { success: false, error: "general_error" };
  }
};

export const getUserByEmail = async (email) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.get(
      `${BASE_BACKEND_URL}/user/getByEmailAddress?emailAddress=${email}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.responseDto?.length > 0) {
      const user = response.data.responseDto[0];
      if (user.branchDto?.countryDto?.priceSymbol) {
        localStorage.setItem("priceSymbol", user.branchDto.countryDto.priceSymbol);
      }
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const forgotPassword = async (email) => {
  const response = await axios.post(
    `${BASE_BACKEND_URL}/auth/forgot-password`,
    { email },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(
    `${BASE_BACKEND_URL}/auth/reset-password`,
    { token, newPassword },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );
  return response.data;
};

export const sendEmailVerification = async (email) => {
  try {
    // Ensure the backend expects the key "emailAddress" as string in the body
    const response = await axios.post(
      `${BASE_BACKEND_URL}/user/emailTokenSend`,
      {
        email: email
       
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (response.data) {
      // Some backends send string message, others send objects — adapt accordingly
      if (
        typeof response.data === "string" &&
        (response.data.toLowerCase().includes("success") || response.data.toLowerCase().includes("sent"))
      ) {
        return { success: true, message: response.data };
      }

      // If backend sends object with success key
      if (response.data.success) {
        return { success: true, message: response.data.message || "Verification email sent." };
      }

      return { error: response.data.message || response.data };
    }

    return { error: "Failed to send verification email" };
  } catch (error) {
    console.error("Email verification error:", error.response?.data || error.message);

    if (error.response?.data) {
      const errorData = error.response.data;
      return {
        error: errorData.message || errorData.error || "An unexpected error occurred. Please try again.",
      };
    }
    return { error: "Failed to connect to the server. Please try again." };
  }
};

export const verifyEmailToken = async (email, token) => {
  try {
    const response = await axios.post(
      `${BASE_BACKEND_URL}/user/verifyEmailToken`,
      {
        emailAddress: email,
        token: token,
        type: "VERIFICATION",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (response.data) {
      if (
        typeof response.data === "string" &&
        (response.data.toLowerCase().includes("success") || response.data.toLowerCase().includes("verified"))
      ) {
        return { success: true, message: response.data };
      }

      if (response.data.success) {
        return { success: true, message: response.data.message || "Email verified successfully." };
      }

      return { error: response.data.message || response.data };
    }
    return { error: "Failed to verify email" };
  } catch (error) {
    console.error("Token verification error:", error.response?.data || error.message);

    if (error.response?.data) {
      const errorData = error.response.data;
      return {
        error: errorData.message || errorData.error || "An unexpected error occurred. Please try again.",
      };
    }
    return { error: "Failed to connect to the server. Please try again." };
  }
};

export const updateUser = async (userData) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return { status: false, errorDescription: "No access token" };
        }
        const decodedToken = decodeJwt(accessToken);
        const userRole = decodedToken?.roles[0]?.authority;
        if (userRole !== "ROLE_ADMIN" && userRole !== "ROLE_MANAGER") {
            return { status: false, errorDescription: "Not authorized" };
        }
        if (!userData.id) {
            return { status: false, errorDescription: "Missing user id" };
        }
        const response = await axios.post(`${BASE_BACKEND_URL}/user/update`, userData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            status: false,
            errorDescription: error.response?.data?.errorDescription || "An error occurred while updating the user."
        };
    }
};
