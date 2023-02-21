import { ItemListOptionFilterFlight, ItemotherListSearchFlight } from '~/components/popover/Modal';

export const TOKEN = 'token';
export const VERSION_HOTEL_SERVICE = '1.0';

/// sevice gate ///
export const AUTH_SERVICE = 'AUTH_SERVICE';
export const CRM_SERVICE = 'CRM_SERVICE';
export const FLYX_SERVICE = 'FLYX_SERVICE';
export const HOTEL_SERVICE = 'HOTEL_SERVICE';
export const HMS_SERVICE = 'HMS_SERVICE';
export const PAYMENT_SERVICE = 'PAYMENT_SERVICE';
export const FINANCE_SERVICE = 'FINANCE_SERVICE';
export const PAYMENT_SERVICE_ACCOUNTING = 'PAYMENT_SERVICE_ACCOUNTING';
export const TRIPIONE_SERVICE = 'TRIPIONE_SERVICE';

/// sevice flight api ///
export const ACCOUNT_SERVICE = 'ACCOUNT_SERVICE';
/// frefix sevice gate///
export const PRE_URL_AUTH_SERVICE = '/auth';
export const PRE_URL_CRM_SERVICE = '/crm';
export const PRE_URL_FLYX_SERVICE = '/flyx';
export const PRE_URL_ACCOUNT_SERVICE = '/v3/account';
export const PRE_URL_HOTEL_SERVICE = '/hotels';
export const PRE_URL_HMS_SERVICE = '/hms-premium';
export const PRE_URL_PAYMENT_SERVICE = '/payment';
export const PRE_URL_FINANCE_SERVICE = '/finance';
export const PRE_URL_PAYMENT_SERVICE_ACCOUNTING = '/payment';
export const PRE_URL_TRIPIONE = '/tripione';
/// link ảnh google api ///
export const PRE_URL_GOOGLE_APIS_IMG = 'https://storage.googleapis.com/tripi-assets/crm_premium';

export const listImg = {
  bannerLoginUrl: `${PRE_URL_GOOGLE_APIS_IMG}/img_banner_loogin.png`,
  imgEmptyInvoiceFlight: `${PRE_URL_GOOGLE_APIS_IMG}/img_empty_invoice_flight.png`,
};
/// data save local storage ///
export const DEVICE_ID = 'device-id';
export const LAST_LINK_PREVIEW = 'last-link-preview';
export const LAST_FILTERS_FLIGHT_ONLINE = 'last-filters-flight-online';
export const LAST_FILTERS_HOTEL_ONLINE = 'last-filters-hotel-online';
export const LAST_DATA_BOOKING_FLIGHT_OFFLINE = 'last-data-booking-flight-offline';
export const IS_COLLAPSIBLE = 'isCollapsible';
export const IS_OPTIMIZE = 'isOptimize';

export const TIME_OUT_QUERY_API_FLIGHT_SEARCH = 800;
export const TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD = 300;

export type some = { [key: string]: any };

// routes
export const routes = {
  LOGIN: '/login',
  DASHBOARD: '/',
  LANDING: '/landing',
  SALE: 'sale',
  FLIGHT: 'flight',
  FLIGHT_ONLINE: 'online',
  FLIGHT_OFFLINE: 'offline',
  FLIGHT_RECONCILIATION_ERROR: 'reconciliation-error',
  FLIGHT_ADD_NEW_TICKET: 'add-new-offline-flight-ticket',
  HOTEL: 'hotel',
  HOTEL_ONLINE: 'online',
  HOTEL_OFFLINE: 'offline',
  MARKETING: 'marketing',
  MARKETING_BREAKING_NEWS: 'breaking-news',
  MARKETING_PROMOTION_CODE: 'promotion-code',
  OTHER: 'other',
  OTHER_SALE_MANAGER: 'manager',
  ANALYTICS: '/analytics',
  ADMIN: '/admin',
  EXAMPLE: '/example',
  APPROVAL: 'approval',
  PAYMENT_SUPPORT: 'payment-support',
  BANK_TRANSFER: 'bank-transfer',
  SUPPORT_TOOLS: 'support-tools',
  PAYMENT_TOOL: 'payment-tools',
  CREDIT_TRANSFER: 'credit-transfer',
};

export const ROLES_APP = {
  ANALYTICS_ROLE: 'analytics',
  ADMIN_ROLE: 'admin',
  SALE: 'sale',
};

export const MAIN_ROLES = {
  SALE: 'crm:sale',
  MARKETING: 'crm:sale-manager',
  OTHER: 'other',
  ADMIN: 'crm:admin',
  SUPPORT: 'support',
  ACCOUNTANT: 'crm:accountant',
  SALE_MANAGER: 'crm:sale-manager',
};

export const ROLE_TABLE = {
  [routes.ANALYTICS]: [ROLES_APP.ANALYTICS_ROLE, ROLES_APP.ADMIN_ROLE],
  [routes.ADMIN]: [ROLES_APP.ADMIN_ROLE],
  [routes.SALE]: [ROLES_APP.SALE],
};

// list data option cho ô search flight
//trạng thái thanh toán
export const paymentStatusFlight: ItemListOptionFilterFlight[] = [
  { name: 'Thành công', id: 'success' },
  { name: 'Hoàn thành', id: 'completed' },
  { name: 'Hoàn trả', id: 'refunded' },
  { name: 'Chờ thanh toán', id: 'pending' },
  { name: 'Thất bại', id: 'failed' },
];

// trạng thái xử lý
export const handlingStatusesFlight: ItemListOptionFilterFlight[] = [
  { name: 'Chưa xử lý', id: 'waiting' },
  { name: 'Đang xử lý', id: 'handling' },
  { name: 'Đã xử lý', id: 'finish' },
];
// Phương thức thanh toán
export const paymentMethodsFlight: ItemListOptionFilterFlight[] = [
  { name: 'Visa, Master Card', id: 'VM' },
  { name: 'Thẻ JCB', id: 'JCB' },
  { name: 'ATM nội địa', id: 'ATM' },
  { name: 'Chuyển khoản', id: 'BT' },
  { name: 'Tiền mặt', id: 'CA' },
  { name: 'Giữ chỗ', id: 'PL' },
  { name: 'Credit', id: 'CD' },
  { name: 'QR-PAY', id: 'QR' },
  { name: 'Thanh toán Ví VNPAY', id: 'VNPAYWALLET' },
  { name: 'Kredivo', id: 'KREDIVO' },
];
// Nhà cung cấp
export const agentList: ItemListOptionFilterFlight[] = [
  { name: 'VN', id: 'VN' },
  { name: 'QH', id: 'QH' },
  { name: 'VJ', id: 'VJ' },
  { name: '1G', id: '1G' },
  { name: '1A', id: '1A' },
  { name: 'VJR', id: 'VJR' },
  { name: 'QHR', id: 'QHR' },
  { name: 'VUR', id: 'VUR' },
  { name: 'KWR', id: 'KWR' },
];
export interface ItemListOptionFilterStatusFlight {
  name: string;
  id: boolean;
}
// Trạng thái đặt vé
export const confirmStatusList: ItemListOptionFilterStatusFlight[] = [
  { name: 'Đã xác nhận', id: true },
  { name: 'Chưa xác nhận', id: false },
];
// lua chon khac
export const otherListSearchFlight: ItemotherListSearchFlight[] = [
  {
    name: 'Tài khoản booker',
    key: 'byBooker',
    defaultValue: false,
  },
  {
    name: 'Bỏ test booking',
    key: 'removeTest',
    defaultValue: true,
  },
  {
    name: 'Hiển thị booker con',
    key: 'showMemberBookings',
    defaultValue: false,
  },
  {
    name: 'Booking đã nhận',
    key: 'myHandlingBooking',
    defaultValue: false,
  },
  {
    name: 'Đơn hàng offline',
    key: 'offlineBooking',
    defaultValue: false,
  },
  {
    name: 'Hiển thị số lượng',
    key: 'showTotalOfBookings',
    defaultValue: false,
  },
];

export const paymentStatusesHotel = [
  { name: 'Thành công', id: 'success' },
  { name: 'Chờ thanh toán', id: 'waiting' },
  { name: 'Thất bại', id: 'fail' },
];
export const handlingStatusesHotel = [
  { name: 'Chưa xử lý', id: 'waiting' },
  { name: 'Đang xử lý', id: 'handling' },
  { name: 'Đã xử lý', id: 'finish' },
];
export const payProviderStatusesHotel = [
  { name: 'Chưa tạo', id: 'notsent' },
  { name: 'Chờ xử lý', id: 'pending' },
  { name: 'Đã thanh toán', id: 'success' },
  { name: 'Từ chối', id: 'fail' },
];
export const providerInvoiceStatusHotel = [
  { name: 'Chờ xác nhận từ kế toán', id: 'waiting_confirmation' },
  { name: 'Chưa có bản mềm', id: 'not_available' },
  { name: 'Kế toán đã xác nhận', id: 'confirmed' },
];
export const providerStatusHotel = [
  { name: 'Từ chối', id: 'fail' },
  { name: 'Đã xác nhận', id: 'success' },
  { name: 'Chưa xác nhận', id: 'pending' },
];
export const refundPaymentFilterHotel = [
  { name: 'Đã thanh toán', id: ['paid'] },
  { name: 'Bị từ chối', id: ['rejected'] },
  { name: 'Hủy yêu cầu', id: ['cancelled'] },
  {
    name: 'Đang xử lí',
    id: ['pending', 'success', 'failed', 'refunded', 'approved', 'approved-payment'],
  },
];
// lua chon khac
export const otherListSearchHotel: ItemotherListSearchFlight[] = [
  {
    name: 'Chưa gửi thanh toán NCC',
    key: 'hasPayment',
    defaultValue: false,
  },
  {
    name: 'Chưa gửi thanh toán hoàn tiền',
    key: 'hasRefund',
    defaultValue: false,
  },
  {
    name: 'Booking đã nhận',
    key: 'myHandlingBooking',
    defaultValue: false,
  },
];

export const MAIN_MODULE = [
  {
    id: 'hotel',
    name: 'Khách sạn',
  },
  {
    id: 'flight',
    name: 'Vé máy bay',
  },
];
