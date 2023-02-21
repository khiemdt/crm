import { combineReducers } from '@reduxjs/toolkit';
import systemReducer from '~/features/systems/systemSlice';
import flightReducer from '~/features/flight/flightSlice';
import hotelReducer from '~/features/hotel/hotelSlice';
import approvalReducer from '~/features/approval/approvalSlice';
import bankTransferReducer from '~/features/payment_support/PaymentSlice';

const rootReducer = combineReducers({
  systemReducer,
  flightReducer,
  hotelReducer,
  approvalReducer,
  bankTransferReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
