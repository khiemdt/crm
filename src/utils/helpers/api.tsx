import Qs from 'qs';
import axios from 'axios';
import cookie from 'js-cookie';

import * as constants from '~/utils/constants/constant';
import { isEmpty, getAppHash, getPlatform, getDeviceInfo } from '~/utils/helpers/helpers';

const request = axios.create();

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

request.interceptors.response.use(
  (response) => {
    if (response?.data?.code === 401) {
      cookie.remove(constants.TOKEN);
      window.location.href = '/login';
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      cookie.remove(constants.TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error.response || { data: {} });
  },
);

const getBaseUrl = (serVice = '') => {
  switch (serVice) {
    case constants.AUTH_SERVICE:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_GATE}${constants.PRE_URL_AUTH_SERVICE}`;
    case constants.CRM_SERVICE:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_GATE}${constants.PRE_URL_CRM_SERVICE}`;
    case constants.FLYX_SERVICE:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_GATE}${constants.PRE_URL_FLYX_SERVICE}`;
    case constants.HOTEL_SERVICE:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_GATE}${constants.PRE_URL_HOTEL_SERVICE}`;
    case constants.HMS_SERVICE:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_GATE}${constants.PRE_URL_HMS_SERVICE}`;
    case constants.ACCOUNT_SERVICE:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_FLIGHT_API}${constants.PRE_URL_ACCOUNT_SERVICE}`;
    case constants.PAYMENT_SERVICE:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_GATE}${constants.PRE_URL_PAYMENT_SERVICE}`;
    case constants.FINANCE_SERVICE:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_ACCOUNTING_PAYMENT}${
        constants.PRE_URL_FINANCE_SERVICE
      }`;
    case constants.PAYMENT_SERVICE_ACCOUNTING:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_ACCOUNTING_PAYMENT}${
        constants.PRE_URL_PAYMENT_SERVICE_ACCOUNTING
      }`;
    case constants.TRIPIONE_SERVICE:
      return `${import.meta.env.VITE_PUBLIC_DOMAIN_GATE}${constants.PRE_URL_TRIPIONE}`;
    default:
      return import.meta.env.VITE_PUBLIC_DOMAIN_GATE;
  }
};

const api = (options: any = {}) => {
  if (!options.noAuthentication) {
    if (!isEmpty(cookie.get(constants.TOKEN))) {
      options.headers = {
        ...options.headers,
        ['login_token']: `${cookie.get(constants.TOKEN)}`,
      };
    }
  }
  options.headers = {
    ...options.headers,
    deviceInfo: getDeviceInfo(),
    lang: 'vi',
    ['Accept-Language']: 'vi',
    platform: getPlatform(),
    appId: import.meta.env.VITE_PUBLIC_APP_ID,
    appHash: getAppHash(),
    version: constants.VERSION_HOTEL_SERVICE,
  };
  return request({
    baseURL: getBaseUrl(options.serVice),
    ...options,
    paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'repeat' }),
    headers: {
      ...options.headers,
    },
  });
};

export default api;
