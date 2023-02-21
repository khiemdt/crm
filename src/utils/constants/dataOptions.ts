import { useAppSelector } from './../hook/redux';
import { Rule } from 'antd/lib/form';
import { ItemListOptionFilterFlight, ItemotherListSearchFlight } from '~/components/popover/Modal';
import {
  agentList,
  confirmStatusList,
  handlingStatusesFlight,
  handlingStatusesHotel,
  ItemListOptionFilterStatusFlight,
  otherListSearchFlight,
  otherListSearchHotel,
  paymentMethodsFlight,
  paymentStatusesHotel,
  paymentStatusFlight,
  payProviderStatusesHotel,
  providerInvoiceStatusHotel,
  providerStatusHotel,
  refundPaymentFilterHotel,
  routes,
} from '~/utils/constants/constant';

export const listOpenClose = [
  {
    id: 'OPEN',
    name: 'Mở cửa',
  },
  {
    id: 'CLOSE',
    name: 'Đóng cửa',
  },
];

export const listGender = [
  {
    code: 'M',
    name: 'Nam',
  },
  {
    code: 'F',
    name: 'Nữ',
  },
];

export const listAgeCategory = [
  {
    code: 'adult',
    name: 'Người lớn',
  },
  {
    code: 'children',
    name: 'Trẻ em',
  },
  {
    code: 'baby',
    name: 'Em bé',
  },
];
interface ListFilterDefault {
  name: string;
  key: string;
  rules?: Rule[];
}
export const listFilterDefault: ListFilterDefault[] = [
  {
    name: 'IDS_TEXT_ORDER_CODE',
    key: 'dealId',
  },
  {
    name: 'IDS_TEXT_BOOKING_CODE',
    key: 'bookingCode',
  },
  {
    name: 'IDS_TEXT_ID_BOOKER',
    key: 'userId',
  },
  {
    name: 'IDS_TEXT_PHONE_NUMBER',
    key: 'customerPhone',
    rules: [
      {
        max: 12,
        message: 'Số điện thoại tối đa 12 kí tự',
      },
      {
        pattern: /^[0-9+]*$/,
        message: 'Số điện thoại không hợp lệ',
      },
    ],
  },
  {
    name: 'IDS_TEXT_USER_NAME',
    key: 'customerName',
  },
  {
    name: 'IDS_TEXT_EMAIL',
    key: 'customerEmail',
    rules: [{ type: 'email', message: 'Email không hợp lệ' }],
  },
];

export interface ItemFilterAddFlight {
  name: string;
  key: string;
  type:
    | 'text'
    | 'date'
    | 'select'
    | 'radio'
    | 'addFileds'
    | 'selectSingle'
    | 'selectSubGroup'
    | 'autoSearch';
  keys?: string[];
  listOptions?: ItemListOptionFilterFlight[];
  isListOptionsDefault?: boolean;
  options?: ItemListOptionFilterStatusFlight[];
  listFields?: ItemotherListSearchFlight[];
}

export const listFilterAddFlight: ItemFilterAddFlight[] = [
  //hành trình chưa sp
  {
    name: 'IDS_TEXT_CODE_TIKET',
    key: 'ticketNumber',
    type: 'text',
  },
  {
    name: 'IDS_TEXT_FLIGHT_CODE',
    key: 'flightCode',
    type: 'text',
  },
  {
    name: 'IDS_TEXT_DATE_BOOKING_FLIGHT',
    key: 'createdDate',
    type: 'date',
    keys: ['createdFromDate', 'createdToDate'],
  },
  {
    name: 'IDS_TEXT_DATE_FLIGHT',
    key: 'departureDate',
    type: 'date',
    keys: ['departureFromDate', 'departureToDate'],
  },
  //---------------------------------------
  {
    name: 'IDS_TEXT_AIRLINE',
    key: 'airlineIds',
    type: 'select',
    listOptions: [],
    isListOptionsDefault: false,
  },
  {
    name: 'IDS_TEXT_SUPPLIER',
    key: 'agentList',
    type: 'select',
    listOptions: [],
    isListOptionsDefault: false,
  },
  //----------------------------------------
  //người xử ký và chưa sp
  {
    name: 'IDS_TEXT_HANDLING_STATUSES',
    key: 'handlingStatuses',
    type: 'select',
    listOptions: handlingStatusesFlight,
    isListOptionsDefault: true,
  },
  {
    name: 'IDS_TEXT_CONFIRM_STATUS',
    key: 'confirmStatus',
    type: 'radio',
    options: confirmStatusList,
  },
  {
    name: 'IDS_TEXT_PAYMENT_STATUS',
    key: 'paymentStatuses',
    type: 'select',
    listOptions: paymentStatusFlight,
    isListOptionsDefault: true,
  },
  {
    name: 'IDS_TEXT_PAYMENT_MENTHOD',
    key: 'paymentMethods',
    type: 'select',
    listOptions: paymentMethodsFlight,
    isListOptionsDefault: true,
  },
  {
    name: 'IDS_TEXT_OTHER_TEXT',
    key: 'others',
    type: 'addFileds',
    listFields: otherListSearchFlight,
  },
];

export const listFilterAddHotel: ItemFilterAddFlight[] = [
  //hành trình chưa sp
  {
    name: 'IDS_TEXT_CODE_ORDER',
    key: 'orderId',
    type: 'text',
  },
  {
    name: 'IDS_TEXT_CODE_ORDER_HOTEL',
    key: 'bookingCode',
    type: 'text',
  },
  {
    name: 'IDS_TEXT_HOTEL',
    key: 'hotelName',
    type: 'autoSearch',
  },
  {
    name: 'IDS_TEXT_HOTEL_ID',
    key: 'rootHotelId',
    type: 'text',
  },
  {
    name: 'IDS_TEXT_DATE_ORDER_HOTEL',
    key: 'createdDate',
    type: 'date',
    keys: ['createdFromDate', 'createdToDate'],
  },
  {
    name: 'IDS_TEXT_DATE_CHECK_IN_ORDER_HOTEL',
    key: 'checkIn',
    type: 'date',
    keys: ['checkinFromDate', 'checkinToDate'],
  },
  {
    name: 'IDS_TEXT_DATE_CHECK_OUT_ORDER_HOTEL',
    key: 'checkOut',
    type: 'date',
    keys: ['checkOutFromDate', 'checkOutToDate'],
  },
  {
    name: 'IDS_TEXT_DATE_PAYMENT_ORDER_HOTEL',
    key: 'paymentDate',
    type: 'date',
    keys: ['paymentFromDate', 'paymentToDate'],
  },
  // //---------------------------------------
  {
    name: 'IDS_TEXT_CS_PROCESS_ORDER_HOTEL',
    key: 'handler',
    type: 'selectSingle',
    listOptions: [],
    isListOptionsDefault: false,
  },
  {
    name: 'IDS_TEXT_TYPE_HOTEL',
    key: 'hotelCategories',
    type: 'select',
    listOptions: [],
    isListOptionsDefault: false,
  },
  {
    name: 'IDS_TEXT_SUB_TYPE_HOTEL',
    key: 'hotelSubCategories',
    type: 'selectSubGroup',
    listOptions: [],
    isListOptionsDefault: false,
  },
  {
    name: 'IDS_TEXT_SHOW_ICON_BOOKER_HOTEL',
    key: 'showMemberBookings',
    type: 'selectSingle',
    isListOptionsDefault: true,
    listOptions: [{ name: 'Hiển thị booker con', id: true }],
  },
  {
    name: 'IDS_TEXT_HAVE_PHONE_CONTACT_HOTEL',
    key: 'filterHasPhone',
    type: 'selectSingle',
    isListOptionsDefault: true,
    listOptions: [{ name: 'Có số điện thoại liên hệ', id: true }],
  },
  {
    name: 'IDS_TEXT_PAYMENT_MENTHOD',
    key: 'paymentMethods',
    type: 'select',
    listOptions: paymentMethodsFlight,
    isListOptionsDefault: true,
  },
  {
    name: 'IDS_TEXT_STATUS_ORDER_HOTEL',
    key: 'paymentStatuses',
    type: 'select',
    listOptions: paymentStatusesHotel,
    isListOptionsDefault: true,
  },
  {
    name: 'IDS_TEXT_STATUS_PROCESS_HOTEL',
    key: 'handlingStatuses',
    type: 'select',
    listOptions: handlingStatusesHotel,
    isListOptionsDefault: true,
  },
  {
    name: 'IDS_TEXT_STATUS_SEND_PAYMENT_VENDER_HOTEL',
    key: 'payProviderStatuses',
    type: 'select',
    listOptions: payProviderStatusesHotel,
    isListOptionsDefault: true,
  },
  // {
  //   name: 'IDS_TEXT_STATUS_REFUND_PRICE_HOTEL',
  //   key: 'refundPaymentFilter',
  //   type: 'select',
  //   listOptions: refundPaymentFilterHotel,
  //   isListOptionsDefault: true,
  // },
  {
    name: 'IDS_TEXT_STATUS_INVOICE_VENDER_HOTEL',
    key: 'providerInvoiceStatus',
    type: 'selectSingle',
    listOptions: providerInvoiceStatusHotel,
    isListOptionsDefault: true,
  },
  {
    name: 'IDS_TEXT_STATUS_VENDER_HOTEL',
    key: 'providerStatus',
    type: 'selectSingle',
    listOptions: providerStatusHotel,
    isListOptionsDefault: true,
  },
  {
    name: 'IDS_TEXT_FILTER_ORTHER_HOTEL',
    key: 'others',
    type: 'addFileds',
    listFields: otherListSearchHotel,
  },
];

export const subRouteSelected = [
  {
    pathname: `/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_ONLINE}`,
  },
  {
    pathname: `/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_OFFLINE}`,
  },
  {
    pathname: `/${routes.SALE}/${routes.HOTEL}/${routes.FLIGHT_ONLINE}`,
  },
  {
    pathname: `/${routes.SALE}/${routes.HOTEL}/${routes.FLIGHT_OFFLINE}`,
  },
  {
    pathname: `/${routes.MARKETING}/${routes.MARKETING_BREAKING_NEWS}`,
  },
  {
    pathname: `/${routes.MARKETING}/${routes.MARKETING_PROMOTION_CODE}`,
  },
  {
    pathname: `/${routes.OTHER}/${routes.OTHER_SALE_MANAGER}`,
  },
  {
    pathname: `/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_RECONCILIATION_ERROR}`,
  },
];

export const listPostProcessingEdit = [
  {
    id: 'Đổi vé',
    name: 'Đổi vé',
  },
  {
    id: 'Đổi tên',
    name: 'Đổi tên',
  },
  {
    id: 'Tách code',
    name: 'Tách code',
  },
  {
    id: 'Thêm hành lý',
    name: 'Thêm hành lý',
  },
  {
    id: 'Thêm suất ăn',
    name: 'Thêm suất ăn',
  },
  {
    id: 'Thêm chỗ ngồi',
    name: 'Thêm chỗ ngồi',
  },
  {
    id: 'Thêm em bé',
    name: 'Thêm em bé',
  },
  {
    id: 'Thêm bảo hiểm',
    name: 'Thêm bảo hiểm',
  },
  {
    id: 'Thu chênh lệch giá vé',
    name: 'Thu chênh lệch giá vé',
  },
  {
    id: 'EMD - Bảo Lưu',
    name: 'EMD - Bảo Lưu',
  },
];

export const listPostProcessingFly = [
  {
    id: 1,
    name: 'Chiều đi',
  },
  {
    id: 0,
    name: 'Chiều về',
  },
  {
    id: 2,
    name: 'Cả đơn hàng',
  },
];

export const listSignIn = [
  {
    id: 'Tripi',
    name: 'Tripi',
  },
  {
    id: 'Vntravel',
    name: 'Vntravel',
  },
  // {
  //   id: 'Én Việt',
  //   name: 'Én Việt',
  // },
  // {
  //   id: 'Nam Thanh',
  //   name: 'Nam Thanh',
  // },
  // {
  //   id: 'Hi Vọng',
  //   name: 'Hi Vọng',
  // },
  {
    id: 'Biển Đông (ES)',
    name: 'Biển Đông (ES)',
  },
  {
    id: 'Vnpay',
    name: 'Vnpay',
  },
  {
    id: 'TranViet',
    name: 'TranViet',
  },
  {
    id: 'KIWI',
    name: 'KIWI',
  },
  {
    id: 'Kaotours',
    name: 'Kaotours',
  },
  {
    id: 'Cat tour',
    name: 'Cat tour',
  },
  {
    id: 'Hoàng Gia Việt',
    name: 'Hoàng Gia Việt',
  },
  {
    id: 'EZ',
    name: 'EZ',
  },
  {
    id: 'Vietjet MyTour',
    name: 'Vietjet MyTour',
  },
  {
    id: 'Hồng Ngọc Hà',
    name: 'Hồng Ngọc Hà',
  },
  {
    id: 'Nhà cung cấp khác',
    name: 'Nhà cung cấp khác',
  },
];
export const listTicketClassCode = [
  {
    id: 'business',
    name: 'Business',
  },
  {
    id: 'economy',
    name: 'Economy',
  },
];

export const listGenderContact = [
  {
    id: 'Mr',
    name: 'Ông',
  },
  {
    id: 'Mrs',
    name: 'Bà',
  },
];

export const listFilterDefaultHotel: ListFilterDefault[] = [
  {
    name: 'IDS_TEXT_ORDER_CODE',
    key: 'dealId',
  },
  {
    name: 'IDS_TEXT_PHONE_NUMBER',
    key: 'customerPhone',
    rules: [
      {
        max: 12,
        message: 'Số điện thoại tối đa 12 kí tự',
      },
      {
        pattern: /^[0-9+]*$/,
        message: 'Số điện thoại không hợp lệ',
      },
    ],
  },
  {
    name: 'IDS_TEXT_USER_NAME',
    key: 'customerName',
  },
  {
    name: 'IDS_TEXT_EMAIL',
    key: 'customerEmail',
    rules: [{ type: 'email', message: 'Email không hợp lệ' }],
  },
  {
    name: 'IDS_TEXT_ID_BOOKER',
    key: 'userId',
  },
];

export const listVoidPostProcessingEdit = [
  {
    id: 'Void vé',
    name: 'Void vé',
  },
  {
    id: 'Hoàn vé',
    name: 'Hoàn vé',
  },
  {
    id: 'Đơn lỗi',
    name: 'Đơn lỗi',
  },
];

export const listTypeVoidPostProcessingEdit = [
  {
    id: 'Hoàn theo điều kiện từ yêu cầu của khách',
    name: 'Hoàn theo điều kiện từ yêu cầu của khách',
  },
  {
    id: 'Theo điều kiện',
    name: 'Theo điều kiện',
  },
  {
    id: 'Bảo lưu',
    name: 'Bảo lưu',
  },
  {
    id: 'SC',
    name: 'SC',
  },
  {
    id: 'Khác',
    name: 'Khác',
  },
];

const listStatus = [
  {
    id: 'INIT',
    name: 'Chờ xác nhận',
  },
  {
    id: 'CONFIRM',
    name: 'Đã xác nhận',
  },
  {
    id: 'REJECT',
    name: 'Từ chối',
  },
];

export const listFilterAddReconciliation: ItemFilterAddFlight[] = [
  {
    name: 'IDS_TEXT_STATUS_PROCESS_HOTEL',
    key: 'statuses',
    type: 'select',
    listOptions: listStatus,
    isListOptionsDefault: true,
  },
  {
    name: 'IDS_TEXT_ERROR_TYPE',
    key: 'errorTagIds',
    type: 'select',
    listOptions: [],
    isListOptionsDefault: false,
  },
  {
    name: 'IDS_TEXT_DIFF_PROCESSING',
    key: 'solutionIds',
    type: 'select',
    listOptions: [],
    isListOptionsDefault: false,
  },
  {
    name: 'IDS_TEXT_DEPARTMENT_PROCESSING',
    key: 'departments',
    type: 'select',
    listOptions: [],
    isListOptionsDefault: false,
  },
  {
    name: 'IDS_TEXT_CODE_PNR',
    key: 'pnr',
    type: 'text',
  },
  {
    name: 'IDS_TEXT_DATE_REC',
    key: 'reconcileDate',
    type: 'date',
    keys: ['reconcileDateFrom', 'reconcileDateTo'],
  },
];
