import api from '~/utils/helpers/api';
import { CRM_SERVICE, FLYX_SERVICE, ACCOUNT_SERVICE } from './../utils/constants/constant';

export const loginAccountViaFbGg = (data = {}, headers = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/auth/loginOauth',
    data,
    noAuthentication: true,
    serVice: CRM_SERVICE,
    headers,
  };
  return api(option);
};

// api up ảnh
export const uploadImagePublic = (data = {}) => {
  const option = {
    method: 'post',
    url: '/photos/upload',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getUserInfo = () => {
  const option = {
    method: 'get',
    url: '/helpDesk/auth/validateAccessToken',
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getAvailableAgents = () => {
  const option = {
    method: 'get',
    url: '/helpDesk/getAvailableAgents',
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const logoutAuth = () => {
  const option = {
    method: 'delete',
    url: '/helpDesk/auth/logout',
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getAllowAgents = () => {
  const option = {
    method: 'get',
    url: '/helpDesk/getAllowAgents',
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getAirlines = () => {
  const option = {
    method: 'get',
    url: '/guru/airlines',
    serVice: FLYX_SERVICE,
  };
  return api(option);
};

export const getAllCountries = () => {
  const option = {
    method: 'get',
    url: '/getAllCountries',
    serVice: ACCOUNT_SERVICE,
  };
  return api(option);
};
