import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getBankTransferTransactions, getOfflineAddition } from '~/apis/paymentSupport';
import { some } from '../../utils/constants/constant';
import { DEFAULT_PAGING, SUCCESS_CODE } from '../flight/constant';

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
  holdingCredit: some[];
}

const initialState: SystemState = {
  isLoading: false,
  flightRefundBookings: [],
  flightRefundPaging: DEFAULT_PAGING,
  flightRefundTotal: 0,
  flightFilter: {},
  holdingCredit: [],
};

export const fetGetBankTransfer = createAsyncThunk(
  'system/fetGetBankTransfer',
  async (query: some = {}) => {
    try {
      const { formData = {}, isFilter = true, paging = DEFAULT_PAGING } = query;
      const { data } = await getBankTransferTransactions({
        ...formData,
        page: paging.page,
        size: paging.pageSize,
      });
      if (data.code === SUCCESS_CODE) {
        return await {
          requests: data?.data?.bankTransferTransactionList,
          flightPaging: isFilter ? DEFAULT_PAGING : paging,
          total: data.data.total,
        };
      } else {
        return [];
      }
    } catch (error) {}
  },
);

export const fetGetHoldingCredit = createAsyncThunk(
  'system/fetGetHoldingCredit',
  async (query: some = {}) => {
    try {
      const { formData = {}, isFilter = true, paging = DEFAULT_PAGING } = query;
      const { data } = await getOfflineAddition({
        ...formData,
        page: paging.page,
        pageSize: paging.pageSize,
      });
      if (data.code === SUCCESS_CODE) {
        return await {
          requests: data?.data,
          flightPaging: isFilter ? DEFAULT_PAGING : paging,
          total: data.recordsTotal,
          flightFilter: formData,
        };
      } else {
        return [];
      }
    } catch (error) {}
  },
);

export const paymentSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    visibleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetGetBankTransfer.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetGetBankTransfer.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.flightRefundBookings = action.payload.requests || [];
      state.flightRefundTotal = action.payload.total;
      state.flightFilter = action.payload.flightFilter;
      state.flightRefundPaging = action.payload.flightPaging;
    });
    builder.addCase(fetGetHoldingCredit.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetGetHoldingCredit.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.flightRefundBookings = action.payload.requests || [];
      state.flightRefundTotal = action.payload.total;
      state.flightFilter = action.payload.flightFilter;
      state.flightRefundPaging = action.payload.flightPaging;
    });
  },
});

export const { visibleLoading } = paymentSlice.actions;

export default paymentSlice.reducer;
