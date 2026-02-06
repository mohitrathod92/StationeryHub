import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/wishlist', { productId });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

export const checkInWishlist = createAsyncThunk(
  'wishlist/checkInWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/wishlist/check/${productId}`);
      return { productId, inWishlist: response.data.inWishlist };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check wishlist');
    }
  }
);

interface WishlistItem {
  productId: string;
  product: any;
}

interface WishlistState {
  items: WishlistItem[];
  wishlistMap: Record<string, boolean>;
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  wishlistMap: {},
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.wishlistMap = {};
        action.payload.forEach((item: WishlistItem) => {
          state.wishlistMap[item.productId] = true;
        });
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add to Wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.wishlistMap[action.payload.productId] = true;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const productId = action.payload;
        state.items = state.items.filter((item) => item.productId !== productId);
        delete state.wishlistMap[productId];
      });

    // Check in Wishlist
    builder
      .addCase(checkInWishlist.fulfilled, (state, action) => {
        const { productId, inWishlist } = action.payload;
        if (inWishlist) {
          state.wishlistMap[productId] = true;
        } else {
          delete state.wishlistMap[productId];
        }
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
