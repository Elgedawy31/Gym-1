export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  AUTH_TOKEN_KEY: "authToken",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
    },
    USERS: {
      UPDATE: (id?: string) => `/users/${id || 'me'}`,
      TOP_TRAINERS:"users/trainers?limit=3",
      // Add other user-related endpoints as needed
    },
    PRODUCTS: {
      GET_PRODUCTS: "/products",
      GET_HOME_PRODUCTS_BY_TYPE :(type: string, limit: number) => `/products?type=${type}&limit=${limit}`,
      GET_PRODUCTS_BY_TYPE: (type: string, limit: number, page: number = 1, category?: string) => `/products?type=${type}&limit=${limit}&page=${page}${category ? `&category=${encodeURIComponent(category)}` : ''}`,
      GET_PRODUCT_BY_ID: (id: string) => `/products/${id}`,
    },
    CART: {
      GET_CART: "/cart",
      ADD_TO_CART: "/cart",
      UPDATE_CART_ITEM: (productId: string) => `/cart/${productId}`,
      REMOVE_FROM_CART: (productId: string) => `/cart/${productId}`,
      CLEAR_CART: "/cart",
    },
    ORDERS: {
      CREATE_ORDER: "/orders",
      GET_MY_ORDERS: "/orders/me",
      GET_ORDER_BY_ID: (orderId: string) => `/orders/${orderId}`,
    },
    SUBSCRIPTION: {
      CREATE_SUBSCRIPTION: "/subscription",
      GET_MY_SUBSCRIPTION: "/subscription/me",
      GET_ALL_SUBSCRIPTION: (page: number = 1) => `/subscription?page=${page}`,
      UPDATE_SUBSCRIPTION: (subId: string) => `/subscription/${subId}`,
    },
    WORKOUT_PLANS: {
      GET_ALL_WORKOUT_PLANS: (page: number = 1) => `/workout-plans/all?page=${page}`,
      GET_WORKOUT_PLAN_BY_ID: (workoutPlanId: string) => `/workout-plans/${workoutPlanId}`,
      GET_WORKOUT_PLANS_BY_TRAINER: (trainerId: string) => `/workout-plans/trainer/${trainerId}`,
      CREATE_WORKOUT_PLAN: "/workout-plans",
      UPDATE_WORKOUT_PLAN: (workoutPlanId: string) => `/workout-plans/${workoutPlanId}`,
      DELETE_WORKOUT_PLAN: (workoutPlanId: string) => `/workout-plans/${workoutPlanId}`,
      SUBSCRIBE_TO_WORKOUT_PLAN: (workoutPlanId: string) => `/workout-plans/${workoutPlanId}/subscribe`,
    },
  },
};

