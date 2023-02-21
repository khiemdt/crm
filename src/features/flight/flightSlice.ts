import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import {
  getFlightBookingPostProcessing,
  getFlightBookings,
  getFlightBookingsDetailNew,
  getFlightBookingsOffline,
  getGeneralInfo,
  getSalesList,
} from '~/apis/flight';
import { DEFAULT_PAGING } from '~/features/flight/constant';
import { BookingsOnlineType, PagingOnline } from '~/features/flight/online/Modal';
import { some } from '~/utils/constants/constant';
import { DATE_FORMAT_BACK_END } from '~/utils/constants/moment';
import { adapterQueryFlight } from '~/utils/helpers/helpers';

export interface AllowAgentType {
  code: string;
  id: number;
  name: string;
}

export interface SystemState {
  isLoading: boolean;
  bookingsOnline: BookingsOnlineType[];
  pagingOnline: PagingOnline;
  filterOnline: some;
  flightOnlineDetail: some;
  bookingsOffline: BookingsOnlineType[];
  pagingOffline: PagingOnline;
  filterOffline: some;
  total: number;
  salesList: some[];
  generalInfo: some;
  flightBookingPostProcessing: some;
  totalBookingsOnline: number;
  agencies: some[];
}

const initialState: SystemState = {
  isLoading: false,
  bookingsOnline: [],
  totalBookingsOnline: 0,
  filterOnline: {},
  pagingOnline: {
    page: 1,
    pageSize: 10,
  },
  bookingsOffline: [],
  filterOffline: {},
  pagingOffline: {
    page: 1,
    pageSize: 10,
  },
  flightOnlineDetail: {},
  total: 0,
  salesList: [],
  generalInfo: {},
  flightBookingPostProcessing: {},
  agencies: [],
};

export const fetFlightBookings = createAsyncThunk(
  'system/fetFlightBookings',
  async (query: some = {}) => {
    try {
      const { formData = {}, isFilter = true, paging = { page: 1, pageSize: 10 } } = query;
      const dataQuery = adapterQueryFlight(formData, paging);
      const { data } = await getFlightBookings(dataQuery);
      if (data.code === 200) {
        return await {
          total: data?.data?.total,
          bookings: data.data.bookings,
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

export const fetFlightBookingsDetail = createAsyncThunk(
  'system/fetFlightBookingsDetail',
  async (query: some = {}) => {
    const params = {
      id: query?.filters?.dealId,
    };
    try {
      const { data } = await getFlightBookingsDetailNew(params);
      if (data.code === 200) {
        return await data.data.bookings[0];
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  },
);

export const fetFlightBookingsDetail1 = createAsyncThunk(
  'system/fetFlightBookingsDetail1',
  async (query: some = {}) => {
    try {
      const { data } = await getFlightBookingsDetailNew(query);
      if (data.code === 200) {
        return await data.data.bookings[0];
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  },
);

export const fetFlightBookingOffline = createAsyncThunk(
  'system/fetFlightBookingOffline',
  async (query: some = {}) => {
    try {
      const { formData = {}, isFilter = true, paging = DEFAULT_PAGING } = query;
      const { data } = await getFlightBookingsOffline({
        ...formData,
        page: paging.page,
        pageSize: paging.pageSize,
        createdFrom: formData?.createdFrom
          ? moment(formData?.createdFrom, DATE_FORMAT_BACK_END).toDate()
          : undefined,
        createdTo: formData?.createdTo
          ? moment(formData?.createdTo, DATE_FORMAT_BACK_END).toDate()
          : undefined,
      });
      if (data.code === 200) {
        return await {
          bookings: data.data,
          pagingOffline: isFilter
            ? {
                page: 1,
                pageSize: 10,
              }
            : paging,
          filterOffline: formData,
          total: data.recordsTotal,
        };
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  },
);

export const fetSalesList = createAsyncThunk('system/fetSalesList', async () => {
  try {
    const { data } = await getSalesList();
    if (data.code === 200) {
      const cars = data.data.filter(
        (v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i,
      );
      return await cars;
    }
    return [];
  } catch (error) {
    console.log(error);
  }
});

export const fetGeneralInfo = createAsyncThunk(
  'system/fetGeneralInfo',
  async (query: some = {}) => {
    try {
      const { data } = await getGeneralInfo(query);
      if (data.code === 200) {
        return await data.data;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  },
);

export const fetFlightBookingPostProcessing = createAsyncThunk(
  'system/fetFlightBookingPostProcessing',
  async (query: some = {}) => {
    try {
      const { data } = await getFlightBookingPostProcessing(query);
      if (data.code === 200) {
        return await data.data;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  },
);

export const flightSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    visibleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetFlightBookings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetFlightBookings.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.bookingsOnline = action.payload.bookings;
      state.pagingOnline = action.payload.pagingOnline;
      state.filterOnline = action.payload.filterOnline;
      state.totalBookingsOnline = action.payload.total;
    });
    builder.addCase(fetFlightBookingsDetail1.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetFlightBookingsDetail1.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.flightOnlineDetail = action.payload;
    });
    builder.addCase(fetFlightBookingsDetail.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.flightOnlineDetail = action.payload;
    });
    builder.addCase(fetFlightBookingOffline.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetFlightBookingOffline.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.bookingsOffline = action.payload.bookings || [];
      state.pagingOffline = action.payload.pagingOffline;
      state.filterOffline = action.payload.filterOffline;
      state.total = action.payload.total;
    });
    builder.addCase(fetSalesList.fulfilled, (state, action: PayloadAction<any>) => {
      state.salesList = action.payload;
    });
    builder.addCase(fetGeneralInfo.fulfilled, (state, action: PayloadAction<any>) => {
      state.generalInfo = action.payload;
    });
    builder.addCase(
      fetFlightBookingPostProcessing.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.flightBookingPostProcessing = action.payload;
      },
    );
  },
});

export const { visibleLoading } = flightSlice.actions;

export default flightSlice.reducer;
