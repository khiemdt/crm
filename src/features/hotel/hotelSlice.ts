import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getBookingDetailHotel, getBookingDetailHotelV2, hotelBookingRequests, staticData } from '~/apis/hotel';
import { BookingsOnlineType, PagingOnline } from '~/features/flight/online/Modal';
import { some } from '~/utils/constants/constant';
import { adapterQueryHotel } from '~/utils/helpers/helpers';
import { defaultNoteModalValue } from './constant';

export interface AllowAgentType {
  code: string;
  id: number;
  name: string;
}


export interface SystemState {
  isLoading: boolean;
  isLoadingV2: boolean;
  bookingsOnline: BookingsOnlineType[];
  pagingOnline: PagingOnline;
  filterOnline: some;
  hotelOnlineDetail: some;
  hotelOnlineDetailV2: some;
  totalBookingsOnline: number;
  staticData: some;
  noteModalManipulation: some;
}

const initialState: SystemState = {
  isLoading: false,
  isLoadingV2: false,
  bookingsOnline: [],
  totalBookingsOnline: 0,
  filterOnline: {},
  pagingOnline: {
    page: 1,
    pageSize: 10,
  },
  hotelOnlineDetail: {},
  hotelOnlineDetailV2: {},
  staticData: {},
  noteModalManipulation: defaultNoteModalValue,
};

export const fetHotelBookings = createAsyncThunk(
  'system/fetHotelBookings',
  async (query: some = {}) => {
    try {
      const { formData = {}, isFilter = true, paging = { page: 1, pageSize: 10 } } = query;
      const dataQuery = adapterQueryHotel(formData, paging);
      const { data } = await hotelBookingRequests(dataQuery);
      if (data.code === 200) {
        return await {
          total: data?.total,
          bookings: data.data,
          pagingOnline: isFilter
            ? {
                page: 1,
                pageSize: 10,
              }
            : paging,
          filterOnline: formData,
        };
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  },
);

export const fetHotelBookingsDetailInit = createAsyncThunk(
  'system/fetFlightBookingsDetail',
  async (query: some = {}) => {
    try {
      const { data } = await getBookingDetailHotel(query);
      if (data.code === 200) {
        return await data.data;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  },
);

export const fetHotelBookingsDetailInitV2 = createAsyncThunk(
  'system/fetFlightBookingsDetailV2',
  async (query: some = {}) => {
    try {
      const { data } = await getBookingDetailHotelV2(query);
      if (data.code === 200) {
        return await data.data;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  },
);

export const fetstaticData = createAsyncThunk('system/fetstaticData', async () => {
  try {
    const { data } = await staticData();
    if (data.code === 200) {
      return await data.data;
    }
  } catch (error) {
    console.log(error);
  }
});

export const setActionModalInfo = createAsyncThunk(
  'system/setActionModalInfo',
  async (data: some) => {
    return data;
  },
);

export const hotelSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    visibleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetHotelBookings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetHotelBookings.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.bookingsOnline = action.payload.bookings;
      state.pagingOnline = action.payload.pagingOnline;
      state.filterOnline = action.payload.filterOnline;
      state.totalBookingsOnline = action.payload.total;
    });
    builder.addCase(fetstaticData.fulfilled, (state, action: PayloadAction<any>) => {
      state.staticData = action.payload;
    });
    builder.addCase(fetHotelBookingsDetailInit.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetHotelBookingsDetailInit.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.hotelOnlineDetail = action.payload;
    });
    builder.addCase(fetHotelBookingsDetailInitV2.pending, (state) => {
      state.isLoadingV2 = true;
    });
    builder.addCase(fetHotelBookingsDetailInitV2.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoadingV2 = false;
      state.hotelOnlineDetailV2 = action.payload;
    });
    builder.addCase(setActionModalInfo.fulfilled, (state, action: PayloadAction<any>) => {
      state.noteModalManipulation = action.payload;
    });
  },
});

export const { visibleLoading } = hotelSlice.actions;

export default hotelSlice.reducer;
