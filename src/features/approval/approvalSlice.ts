import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFlightRefundBookings } from '~/apis/approval';
import { SUCCESS_CODE } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { DEFAULT_PAGING } from '../flight/constant';

export interface IPaging {
  page: number;
  pageSize: number;
}

export interface SystemState {
  isLoading: boolean;
  flightRefundBookings: some[];
  flightRefundPaging: IPaging;
  flightRefundTotal: number;
  flightFilter: some;
  statusList: string[];
}

const initialState: SystemState = {
  isLoading: false,
  flightRefundBookings: [],
  flightRefundPaging: DEFAULT_PAGING,
  flightRefundTotal: 0,
  flightFilter: {},
  statusList: [],
};

export const fetFlightRefundBookings = createAsyncThunk(
  'system/fetFlightRefundBookings',
  async (query: some = {}) => {
    try {
      const {
        formData = { statuses: ['pending', 'approved', 'rejected'] },
        isFilter = true,
        paging = DEFAULT_PAGING,
      } = query;
      const { data } = await getFlightRefundBookings({
        ...formData,
        paging: {
          index: paging.page,
          size: paging.pageSize,
          total: paging.total || 1000,
        },
      });
      if (data.code === SUCCESS_CODE) {
        return await {
          requests: data.data.requests,
          flightPaging: isFilter ? DEFAULT_PAGING : paging,
          flightFilter: formData,
          total: data.data.total,
          statusList: !isEmpty(formData.statuses)
            ? formData.statuses
            : ['pending', 'approved', 'rejected'],
        };
      } else {
        return await {
          statusList: !isEmpty(formData.statuses)
            ? formData.statuses
            : ['pending', 'approved', 'rejected'],
        };
      }
    } catch (error) {}
  },
);

export const approvalSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    visibleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetFlightRefundBookings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetFlightRefundBookings.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.flightRefundBookings = action.payload.requests || [];
      state.flightRefundTotal = action.payload.total;
      state.flightFilter = action.payload.flightFilter;
      state.flightRefundPaging = action.payload.flightPaging;
      state.statusList = action.payload.statusList;
    });
  },
});

export const { visibleLoading } = approvalSlice.actions;

export default approvalSlice.reducer;
