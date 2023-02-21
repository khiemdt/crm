import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getAirlines, getAllCountries, getAllowAgents, getUserInfo } from '~/apis/system';
import { IS_COLLAPSIBLE, IS_OPTIMIZE, some } from '~/utils/constants/constant';

export interface AllowAgentType {
  code: string;
  id: number;
  name: string;
}
export interface AirlinesType {
  code: string;
  id: number;
  name: string;
  logo: string;
}
export interface SystemState {
  locale: string;
  isLoading: boolean;
  userInfo: some;
  collapsible: boolean;
  allowAgents: AllowAgentType[];
  airlines: AirlinesType[];
  countries: some[];
  isOptimize: boolean;
}

const initialState: SystemState = {
  locale: 'vi',
  isLoading: false,
  userInfo: {},
  collapsible: localStorage.getItem(IS_COLLAPSIBLE) === 'true',
  isOptimize: localStorage.getItem(IS_OPTIMIZE) === 'false',
  allowAgents: [],
  airlines: [],
  countries: [],
};

export const fetUserInfoAsync = createAsyncThunk('system/fetUser', async () => {
  const { data } = await getUserInfo();
  return await data.data;
});

export const fetAllowAgents = createAsyncThunk('system/fetCa', async () => {
  try {
    const { data } = await getAllowAgents();
    return await data.data;
  } catch (error) {
    console.log(error);
  }
});

export const fetAirlines = createAsyncThunk('system/fetAirlines', async () => {
  try {
    const { data } = await getAirlines();
    return await data.data.items;
  } catch (error) {
    console.log(error);
  }
});

export const fetAllCountries = createAsyncThunk('system/fetAllCountries', async () => {
  try {
    const { data } = await getAllCountries();
    return await data.data.countries;
  } catch (error) {
    console.log(error);
  }
});

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    visibleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<object>) => {
      state.userInfo = action.payload;
    },
    visiblecollaps: (state, action: PayloadAction<boolean>) => {
      state.collapsible = action.payload;
    },
    visibleOptimize: (state, action: PayloadAction<boolean>) => {
      state.isOptimize = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetUserInfoAsync.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetUserInfoAsync.fulfilled, (state, action: PayloadAction<object>) => {
      state.isLoading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(fetUserInfoAsync.rejected, (state, action) => {
      if (action.payload) {
        state.isLoading = false;
      } else {
        state.isLoading = false;
      }
    });
    builder.addCase(fetAllowAgents.fulfilled, (state, action: PayloadAction<AllowAgentType[]>) => {
      state.allowAgents = action.payload;
    });
    builder.addCase(fetAirlines.fulfilled, (state, action: PayloadAction<AirlinesType[]>) => {
      state.airlines = action.payload;
    });
    builder.addCase(fetAllCountries.fulfilled, (state, action: PayloadAction<some[]>) => {
      state.countries = action.payload;
    });
  },
});

export const { visibleLoading, setUserInfo, visiblecollaps, visibleOptimize } = systemSlice.actions;

export default systemSlice.reducer;
