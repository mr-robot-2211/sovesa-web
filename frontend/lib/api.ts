// Data Access Layer for all API calls

export interface UserData {
  name: string;
  email: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  student_id: string;
  tripId: string;
}

export interface UserStorageData {
  name: string;
  email: string;
  profile_photo?: string;
}

export interface UserUpdateData {
  email: string;
  name?: string;
  phone?: string;
  student_id?: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  student_id: string;
  courses?: string[];
  trips?: string[];
  volunteer?: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseUrl = '/api';

  // Generic fetch wrapper with error handling
  public async fetchApi<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! Status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
        message: data.message,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Store User Data
  async storeUser(userData: UserStorageData): Promise<ApiResponse> {
    // Validate required fields
    if (!userData.name || !userData.email) {
      return {
        success: false,
        error: 'Name and email are required',
      };
    }

    return this.fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Get User Data by Email
  async getUserByEmail(email: string): Promise<ApiResponse> {
    if (!email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    return this.fetchApi(`/users/${encodeURIComponent(email)}`);
  }

  // Get User Profile Data (including courses and trips)
  async getUserProfile(email: string): Promise<ApiResponse<UserProfileData>> {
    if (!email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    return this.fetchApi(`/users/${encodeURIComponent(email)}`);
  }

  // Update User Data
  async updateUser(userData: UserUpdateData): Promise<ApiResponse> {
    if (!userData.email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    return this.fetchApi('/users/update', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Course Registration with validation
  async registerCourse(registrationData: RegistrationData, isAuthenticated: boolean = false): Promise<ApiResponse> {
    // Check if user is authenticated
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'You must be logged in to register for courses',
      };
    }

    // Validate required fields
    if (!registrationData.name || !registrationData.email || !registrationData.phone || !registrationData.student_id) {
      return {
        success: false,
        error: 'All fields are required',
      };
    }

    return this.fetchApi('/courses-registration', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  // Trip Registration with validation
  async registerTrip(registrationData: RegistrationData, isAuthenticated: boolean = false): Promise<ApiResponse> {
    // Check if user is authenticated
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'You must be logged in to register for trips',
      };
    }

    // Validate required fields
    if (!registrationData.name || !registrationData.email || !registrationData.phone || !registrationData.student_id) {
      return {
        success: false,
        error: 'All fields are required',
      };
    }

    return this.fetchApi('/trips-registration', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  // Get Courses
  async getCourses(): Promise<ApiResponse> {
    return this.fetchApi('/courses');
  }

  // Get Trips
  async getTrips(): Promise<ApiResponse> {
    return this.fetchApi('/trips');
  }

  // Check if user is registered for a course
  async isUserRegisteredForCourse(email: string, courseId: string): Promise<ApiResponse<boolean>> {
    if (!email || !courseId) {
      return {
        success: false,
        error: 'Email and courseId are required',
      };
    }

    try {
      const userProfile = await this.getUserProfile(email);
      if (!userProfile.success || !userProfile.data) {
        return {
          success: false,
          error: 'Failed to fetch user profile',
        };
      }

      const userData = userProfile.data as UserProfileData;
      const isRegistered = userData.courses?.includes(courseId) || false;

      return {
        success: true,
        data: isRegistered,
      };
    } catch {
      return {
        success: false,
        error: 'Failed to check registration status',
      };
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Utility functions for common operations
export const apiUtils = {
  // Fetch data with loading state management
  async fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const result = await apiService.fetchApi<T>(endpoint);
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};
