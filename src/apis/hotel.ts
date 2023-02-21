import api from '~/utils/helpers/api';
import { CRM_SERVICE, HMS_SERVICE, HOTEL_SERVICE, PAYMENT_SERVICE } from './../utils/constants/constant';

export const hotelBookingRequests = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/hotelBookingRequests',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const staticData = () => {
  const option = {
    method: 'get',
    url: '/helpDesk/hotel/static-data',
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const searchHotel = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/search-hotel',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getBookingDetailHotel = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/hotelBooking/getBookingDetail',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getBookingDetailHotelV2 = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/hotelBooking/get-booking-detail-v2',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const assignBooking = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/assignBooking',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getHotelBookingSms = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/getHotelBookingSms',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const additions = (data = {}) => {
  const option = {
    method: 'post',
    url: '/crm/booking/additions',
    serVice: HOTEL_SERVICE,
    data,
  };
  return api(option);
};

export const sendSmsToCustomer = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/sendSmsToCustomer',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const confirmAdditions = (data = {}) => {
  const option = {
    method: 'post',
    url: '/crm/booking/addition/confirm',
    serVice: HOTEL_SERVICE,
    data,
  };
  return api(option);
};

export const tagsHotel = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/tag',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const cpaymentStatusAdditions = (data = {}) => {
  const option = {
    method: 'post',
    url: '/crm/booking/addition/payment-status',
    serVice: HOTEL_SERVICE,
    data,
  };
  return api(option);
};

export const getAllAgencies = () => {
  const option = {
    method: 'get',
    url: '/helpDesk/all-agencies',
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const providerInfo = (data = {}) => {
  const option = {
    method: 'post',
    url: '/crm/provider-info',
    serVice: HMS_SERVICE,
    data,
  };
  return api(option);
};

export const getSurchargePaymentMethods = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/bookingAddition/getSurchargePaymentMethods',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getHotelBookingRoomNightDetail = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/bookingAddition/get-hotel-booking-room-night-detail',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getAllBookingAdditionType = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/bookingAddition/getAllBookingAdditionType',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getProviderInfoInBooking = (params = {}) => {
  const option = {
    method: 'get',
    url: '/crm/get-provider-info-in-booking',
    serVice: HMS_SERVICE,
    params,
  };
  return api(option);
};
export const searchReservationCode = (data = {}) => {
  const option = {
    method: 'post',
    url: '/v3/search-reservation-code',
    serVice: HOTEL_SERVICE,
    data,
  };
  return api(option);
};

export const uploadHotelNoteImage = (params = {}, data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/uploadImage',
    serVice: CRM_SERVICE,
    data,
    params,
  };
  return api(option);
};

export const getContactHotelCrm = (params = {}) => {
  const option = {
    method: 'get',
    url: '/help-desk/get-contact-hotel-crm',
    serVice: HMS_SERVICE,
    params,
  };
  return api(option);
};
export const deleteHotelBookingNoteImages = (id: number, params: {}) => {
  const option = {
    method: 'post',
    url: `/helpDesk/deleteImage/${id}`,
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getBookingHistoryTransaction = (params = {}) => {
  const option = {
    method: 'get',
    url: '/internal/transaction-history',
    serVice: PAYMENT_SERVICE,
    params,
  };
  return api(option);
};

export const getBookingHistoryLog = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/hotelBooking/getHotelBookingDetailLog',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};
export const additionHotel = (data = {}) => {
  const option = {
    method: 'post',
    url: `/crm/booking/addition`,
    serVice: HOTEL_SERVICE,
    data,
  };
  return api(option);
};
