import api from '~/utils/helpers/api';
import {
  CRM_SERVICE,
  FINANCE_SERVICE,
  PAYMENT_SERVICE_ACCOUNTING,
  some,
  TRIPIONE_SERVICE,
} from './../utils/constants/constant';

export const getFlightBookings = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/getFlightBookings',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getFlightBookingsDetailNew = (data: some = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/getFlightBookingDetail/' + data?.id,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getActiveBankTransferList = (params = {}) => {
  const option = {
    method: 'get',
    url: '/checkout/getActiveBankTransferList',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getSupportPaySms = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/supportpaysms',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const updateSupportPaySms = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/supportpaysms',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getConfirmationSms = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/getConfirmationSms',
    serVice: CRM_SERVICE,
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

export const getBookerRequests = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/getBookerRequests',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getVatInvoiceDetail = (params = {}) => {
  const option = {
    method: 'get',
    url: '/vat-invoices/requests/detail',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const deleteVatInvoiceDetail = (params = {}) => {
  const option = {
    method: 'put',
    url: '/vat-invoices/requests/cancel',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getActiveBenefitPackages = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/getActiveBenefitPackages',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getVatInvoiceOrder = (params = {}) => {
  const option = {
    method: 'get',
    url: '/vat-invoices/orders',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const updateBookingPriceDetails = (data = {}) => {
  const option = {
    method: 'post',
    url: '/flight/updateBookingPriceDetails',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const supportPayMail = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/supportpaymail',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const validateBookingInfoByReservation = (data = {}) => {
  const option = {
    method: 'post',
    url: '/flights/validateBookingInfoByReservation',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const fetchPatchBookingInfoByReservation = (data = {}) => {
  const option = {
    method: 'post',
    url: '/flights/patchBookingInfoByReservation',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getPaymentGuideEmail = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/getPaymentGuideEmail',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getConfirmationEmail = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/getConfirmationEmail',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const sendEmail = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/sendEmail',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getEnterpriseInfo = (data = {}) => {
  const option = {
    method: 'post',
    url: '/utils/getEnterpriseInfo',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const requestVatInvoices = (data = {}) => {
  const option = {
    method: 'post',
    url: '/vat-invoices/requests',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const paymentTransactionHistory = (params = {}) => {
  const option = {
    method: 'get',
    url: '/payment/internal/transaction-history',
    params,
  };
  return api(option);
};

export const handleBooking = (data = {}) => {
  const option = {
    method: 'post',
    url: 'helpDesk/handleBooking',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const cancelHandlingBooking = (data = {}) => {
  const option = {
    method: 'post',
    url: 'helpDesk/cancelHandlingBooking',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getSalesList = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/getSalesList',
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

export const updateFlightGuestInfo = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/updateFlightGuestInfo',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const updateFlightBookerInfo = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/updateFlightBookerInfo',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const purchasingFlight = (data = {}, id: number) => {
  const option = {
    method: 'post',
    url: '/helpdesk/flight/purchasing?booking_id=' + id,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const editHoldingTimeFlight = (data = {}) => {
  const option = {
    method: 'post',
    url: '/flight/editHoldingTime',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const adminBookInsurance = (data = {}) => {
  const option = {
    method: 'post',
    url: 'insurance/adminBookInsurance',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const rebookFlightSingleTicket = (data = {}) => {
  const option = {
    method: 'post',
    url: 'helpDesk/rebookFlightSingleTicket',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const rebookFlightBooking = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/rebookFlightBooking',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const findTicketsFlight = (data = {}) => {
  const option = {
    method: 'post',
    url: '/flights/helpDesk/findTickets',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const editNoteToCustomer = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/flight/editNoteToCustomer',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const updateItineraryInfo = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/updateItineraryInfo',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const updateFlightPNRCodes = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/updateFlightPNRCode',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getTagFlightBookingDetail = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/tag',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const updateBookingTag = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/updateBookingTag',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};
export const updateFlightBookingCodes = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/updateFlightBookingCode',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const fetchUpdateFlightTaskBookStatus = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/updateFlightTaskBookStatus',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getBookingTags = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/getBookingTags',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const checkDividable = (params = {}) => {
  const option = {
    method: 'get',
    url: '/flight/checkDividable',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const divideBooking = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/divideBooking',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const voidFlightSingleTicket = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/voidFlightSingleTicket',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const voidedItinerary = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/voidedItinerary',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const bankTransfer = (data = {}) => {
  const option = {
    method: 'post',
    url: '/help-desk/bank-transfer/get-bank-transfer-transactions',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const createPayment = (data = {}) => {
  const option = {
    method: 'post',
    url: '/help-desk/create-payment',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const paymentMethods = (params = {}) => {
  const option = {
    method: 'get',
    url: '/help-desk/payment/payment-methods',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const confirmFlightSingleTicket = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/confirmFlightSingleTicket',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const voidVnaTicketByPnr = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/utilities/voidVnaTicketByPnr',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getFlightBookingsOffline = (data = {}) => {
  const option = {
    method: 'post',
    url: '/flightBooking/getOfflineBooking',
    data,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const assignFlightOfflineBooking = (data = {}) => {
  const option = {
    method: 'post',
    url: '/flightBooking/reassignOfflineBooking',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const deleteFlightOfflineBooking = (data = {}) => {
  const option = {
    method: 'post',
    url: '/flightBooking/deleteOfflineBooking',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const addNewFlightSearchRequestOffline = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/offlineBooking/addNewFlightSearchRequest',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};
export const approveFlightOfflineBooking = (data = {}, type: string) => {
  const option = {
    method: 'post',
    url:
      type == 'confirm'
        ? '/flightBooking/confirmOfflinePayment'
        : '/flightBooking/rejectOfflinePayment',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const searchUsers = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/search-users',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};
export const createFlightBookingNote = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/addBookingRemark',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getFlightBookingPostProcessing = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/getFlightBookingPostProcessing',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getFlightBookingNote = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/getBookingRemark',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getGeneralInfo = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/postProcessing/getGeneralInfo',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const fetchGetByPassApproval = (params = {}) => {
  const option = {
    method: 'get',
    url: '/public/crm/user/policy',
    serVice: TRIPIONE_SERVICE,
    params,
  };
  return api(option);
};

export const fetchTripsByUser = (params = {}) => {
  const option = {
    method: 'get',
    url: '/public/crm/trips/by-user',
    serVice: TRIPIONE_SERVICE,
    params,
  };
  return api(option);
};

export const fetchCheckOverBudget = (data = {}) => {
  const option = {
    method: 'post',
    url: '/public/crm/trips/check-over-budget',
    serVice: TRIPIONE_SERVICE,
    data,
  };
  return api(option);
};

export const changeBookingVoidability = (params = {}) => {
  const option = {
    method: 'get',
    url: '/flights/changeBookingVoidability',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const actionFlightBookingNoteImages = (method: 'get' | 'post', value: some = {}) => {
  const option = {
    method,
    url: '/help-desk/booking/assets',
    serVice: CRM_SERVICE,
  };
  return method !== 'post' ? api({ ...option, params: value }) : api({ ...option, data: value });
};

export const deleteFlightBookingNoteImages = (id: number) => {
  const option = {
    method: 'delete',
    url: `/help-desk/booking/assets/${id}`,
    serVice: CRM_SERVICE,
    data: {},
  };
  return api(option);
};
export const interpolateAdditionalPostProcessing = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/interpolateAdditionalPostProcessing',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getBankTransferTransactionsPostProcessing = (id: number) => {
  const option = {
    method: 'get',
    url: '/helpDesk/getBankTransferTransactionsPostProcessing/' + id,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const addFlightBookingPostProcessing = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/addFlightBookingPostProcessing',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getBookingWorkLogs = (params = {}) => {
  const option = {
    method: 'get',
    url: '/helpDesk/getWorkLogsOfBooking',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const deleteFlightPostProcessing = (params = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/deleteFlightPostProcessing',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const editFlightPostProcessing = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/editFlightPostProcessing',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getTransInfoPostProcessing = (id: number) => {
  const option = {
    method: 'get',
    url: `/helpDesk/getTransInfoPostProcessing/${id}`,
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const handleFlightBookingPostProcessing = (data = {}) => {
  const option = {
    method: 'post',
    url: `/helpDesk/handleFlightBookingPostProcessing/updateStatus`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getOfflineFlightSearching = (params = {}) => {
  const option = {
    method: 'get',
    url: `/flightBooking/getOfflineFlightSearching`,
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getFlightSearchRequestCreatorBody = (data = {}) => {
  const option = {
    method: 'post',
    url: `/helpDesk/offlineBooking/getFlightSearchRequestCreatorBody`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getFlightBaggageList = (data = {}) => {
  const option = {
    method: 'post',
    url: `/helpDesk/offlineBooking/getFlightBaggageList`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const retrievePnr = (data = {}) => {
  const option = {
    method: 'post',
    url: `/flights/retrievePnr`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const addNewOfflineFlightBooking = (data = {}) => {
  const option = {
    method: 'post',
    url: `/helpDesk/offlineBooking/addNewOfflineFlightBooking`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const updateOflineSearchingInfo = (data = {}) => {
  const option = {
    method: 'post',
    url: `/flightBooking/updateOflineSearchingInfo`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const checkCode = (data = {}) => {
  const option = {
    method: 'post',
    url: `/help-desk/check-code`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const createPreviewRefundRequest = (params = {}) => {
  const option = {
    method: 'post',
    url: `/helpDesk/createPreviewRefundRequest`,
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const refundPaymentMethod = (params = {}) => {
  const option = {
    method: 'get',
    url: `/refundPaymentMethod`,
    serVice: FINANCE_SERVICE,
    params,
  };
  return api(option);
};

export const updateRefundRequest = (data = {}) => {
  const option = {
    method: 'post',
    url: `/booking/createRefundBooking`,
    serVice: PAYMENT_SERVICE_ACCOUNTING,
    data,
  };
  return api(option);
};

export const getAllBank = (params = {}) => {
  const option = {
    method: 'get',
    url: `/helpDesk/getAllBank`,
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getAllBankCode = (params = {}) => {
  const option = {
    method: 'get',
    url: `/management/account/getAllBankCode`,
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const fetchLookupUserBy = (params = {}) => {
  const option = {
    method: 'get',
    url: `/helpDesk/lookupUserBy`,
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const fetchEditUserOfBooking = (data = {}) => {
  const option = {
    method: 'post',
    url: `/helpDesk/editUserOfBooking`,
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const clearPromotionCode = (data = {}) => {
  const option = {
    method: 'post',
    url: '/helpDesk/clearPromotionCode',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getErrorTags = () => {
  const option = {
    method: 'get',
    url: '/common/error-tags',
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getErrorTagsSolutions = () => {
  const option = {
    method: 'get',
    url: '/common/error-tags/solutions',
    serVice: CRM_SERVICE,
  };
  return api(option);
};

export const getErrorTagsStatus = (data = {}) => {
  const option = {
    method: 'put',
    url: '/reconcile/schedules/error-tags/status',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getErrorTagsHandling = (data = {}) => {
  const option = {
    method: 'put',
    url: '/reconcile/schedules/error-tags/handling',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getErrorTagsReconcile = (params = {}) => {
  const option = {
    method: 'get',
    url: '/reconcile/schedules/error-tags',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const updateErrorTagsReconcile = (data = {}) => {
  const option = {
    method: 'put',
    url: '/reconcile/schedules/error-tags',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};
export const getReconlitionDetail = (params = {}) => {
  const option = {
    method: 'get',
    url: '/reconcile/schedules/error-tags/detail',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const getNotes = (params = {}) => {
  const option = {
    method: 'get',
    url: '/bo-notes',
    serVice: CRM_SERVICE,
    params,
  };
  return api(option);
};

export const addNotes = (data = {}) => {
  const option = {
    method: 'post',
    url: '/bo-notes/add',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};

export const getHistoryLog = (data = {}) => {
  const option = {
    method: 'post',
    url: '/bo/common/user-update-logs',
    serVice: CRM_SERVICE,
    data,
  };
  return api(option);
};
