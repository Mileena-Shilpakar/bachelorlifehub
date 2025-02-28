// services/authService.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Login function
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/user/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    // Store tokens in localStorage
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);

    // Store user info
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user.id);  // Assuming the user object contains an `id` field


    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message || 'Failed to login' };
  }
};

// Register function
export const registerUser = async (firstName, lastName, email, password) => {
  try {
    const response = await fetch(`${API_URL}/user/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Registration failed');
    }

    // Store tokens in localStorage
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);

    // Store user info
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message || 'Failed to register' };
  }
};

// Get user profile function
export const getUserProfile = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return { success: false, message: 'User not authenticated' };
  }

  try {
    const response = await fetch(`${API_URL}/user/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to fetch user profile');
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Profile fetch error:', error);
    return { success: false, message: error.message || 'Failed to fetch profile' };
  }
};
