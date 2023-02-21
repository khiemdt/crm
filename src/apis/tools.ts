import api from '~/utils/helpers/api';
import {
  CRM_SERVICE,
  FINANCE_SERVICE,
  PAYMENT_SERVICE_ACCOUNTING,
  some,
  TRIPIONE_SERVICE,
} from './../utils/constants/constant';
export const fetGetBankList = (data = {}) => {
  const option = {
    method: 'post',
    url: `/management/account/getBankList`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const fetChangeEnableBankList = (data = {}) => {
  const option = {
    method: 'post',
    url: `/management/account/changeEnableBankList`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const findBankTransferRequest = (data = {}) => {
  const option = {
    method: 'post',
    url: `/help-desk/bank-transfer/find-bank-transfer-request`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};
