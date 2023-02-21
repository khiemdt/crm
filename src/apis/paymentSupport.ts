import { CRM_SERVICE } from '~/utils/constants/constant';
import api from '~/utils/helpers/api';

export const getBankTransferTransactions = (data = {}) => {
  const option = {
    method: 'post',
    url: '/help-desk/bank-transfer/get-bank-transfer-transactions',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getOfflineAddition = (data = {}) => {
  const option = {
    method: 'post',
    url: '/flightBooking/getOfflineAddition',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

const switchEndPoint = (type: string) => {
  switch (type) {
    case 'reject':
      return '/flightBooking/rejectOfflineAdditionPayment';
    case 'confirm':
      return '/flightBooking/confirmOfflineAdditionPayment';
    default:
      return '/helpDesk/handleFlightBookingPostProcessing/updateStatus';
  }
};

export const fetresolveCreditHolding = (data = {}) => {
  const option = {
    method: 'post',
    url: '/credit/creditHolding/resolveCreditHolding',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const approveCreditHold = (data: any = {}) => {
  const option = {
    method: 'post',
    url: switchEndPoint(data.type),
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getHoldingCredit = (params = {}) => {
  const option = {
    method: 'get',
    url: '/credit/creditHolding/getHoldingCredit',
    params,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const checkHoldingHistory = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/checkHoldingHistory',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const changeLimitation = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/changeLimitation',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const fetGetBankTransferNote = (params = {}) => {
  const option = {
    method: 'get',
    url: '/help-desk/bank-transfer/get-help-desk-note',
    params,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const fetAddHelpDeskNote = (data = {}) => {
  const option = {
    method: 'post',
    url: '/help-desk/bank-transfer/add-help-desk-note',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const fetGetBankTransferRequests = (data = {}) => {
  const option = {
    method: 'post',
    url: '/help-desk/bank-transfer/get-bank-transfer-requests',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const fetResolveBankTransferTransaction = (data = {}) => {
  const option = {
    method: 'post',
    url: '/help-desk/bank-transfer/resolve-bank-transfer-transaction',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};
