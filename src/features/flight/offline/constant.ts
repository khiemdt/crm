import { some } from '~/utils/constants/constant';

export const listFilterDefault: some[] = [
  {
    name: 'IDS_TEXT_ORDER_CODE',
    key: 'bookingId',
    rules: [
      {
        pattern: /^[0-9+]*$/,
        message: 'Mã đơn hàng không hợp lệ',
      },
    ],
  },
  {
    name: 'IDS_TEXT_PHONE_NUMBER_BOOKER',
    key: 'phoneNumber',
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
    name: 'IDS_TEXT_ID_USER',
    key: 'userId',
  },
];

export enum BookingOfflineStatus {
  success = 'success',
  completed = 'completed',
  holding = 'holding',
  awaitingPayment = 'awaiting-payment',
  awaiting = 'awaiting',
  awaiting_payment = 'awaiting_payment',
  rejected = 'rejected',
  cancelled = 'cancelled',
  failed = 'failed',
}

export interface IBookingOfflineFilter {
  caIds?: string[];
  date?: some;
  bookingId?: string;
  phoneNumber?: string;
  paymentStatus?: string;
}

export const defaultBookingOfflineFilterValue: IBookingOfflineFilter = {
  caIds: [],
  date: {},
  bookingId: undefined,
  phoneNumber: undefined,
  paymentStatus: undefined,
};

export const FLIGHT_BOOKING_OFFLINE_STATUS: some[] = [
  {
    id: BookingOfflineStatus.success,
    name: 'Thành công',
    color: '#007864',
    backGround: '#E9FCEE',
  },
  {
    id: BookingOfflineStatus.holding,
    name: 'Đang giữ tiền',
    color: '#FFB30F',
    backGround: '#FFFAEE',
  },
  {
    id: BookingOfflineStatus.awaiting,
    name: 'Chờ thanh toán',
    color: '#FFB30F',
    backGround: '#FFFAEE',
  },
  {
    id: BookingOfflineStatus.rejected,
    name: 'Từ chối',
    color: '#FF2C00',
    backGround: '#FFF0ED',
  },
  {
    id: BookingOfflineStatus.failed,
    name: 'Thanh toán thất bại',
    color: '#FF2C00',
    backGround: '#FFF0ED',
  },
];

export const PURCHASE_TYPES = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
};

export const purchaseTypes = [
  {
    value: PURCHASE_TYPES.PERSONAL,
    name: 'Cá nhân',
  },
  {
    value: PURCHASE_TYPES.BUSINESS,
    name: 'Doanh nghiệp',
  },
];
export const listFlightFormatName = {
  lastName: 'Họ ',
  firstName: 'Tên đệm và tên ',
  gender: 'Giới tính ',
  dobStr: 'Ngày sinh ',
  dob: 'Ngày sinh ',
  phone1: 'Số điện thoại ',
  passport: 'Số hộ chiếu ',
  passportExpiry: 'Ngày hết hạn hộ chiếu ',
  outboundTicketNo: 'Số vé chiều đi ',
  inboundTicketNo: 'Số vé chiều về ',
  email: 'Email ',
  departureTime: 'Thời gian khởi hành ',
  arrivalTime: 'Thời gian tới nơi ',
  fromAirport: 'Điểm đi ',
  toAirport: 'Điểm đến ',
  flightCode: 'Mã chuyến bay',
  agencyId: 'Nhà cung cấp ',
  airlineId: 'Hãng bay ',
  creatingSaleId: 'Người tạo ',
  finalPrice: 'Tiền thu khách ',
  paymentMethodId: 'Phương thức thanh toán ',
  paymentStatus: 'Trạng thái thanh toán ',
  pnrCode: 'Mã đặt chỗ ',
  processingTime: 'Ngày phát sinh ',
  saleId: 'Người xử lý ',
  signIn: 'SignIn ',
  status: 'Trạng thái ',
  totalNetPrice: 'Số tiền trả hãng ',
  type: 'Loại phát sinh ',
  note: 'Ghi chú ',
  isOutbound: 'Chiều xử lý ',
  GuestValidateResult: 'Thông tin hành khách',
  TicketValidateResult: 'Thông tin hành trình',
  BookingBaggageValidateResult: 'Thông tin hành lý',
  classOfService: 'Hạng đặt chỗ',
  ticketClass: 'Hạng vé',
  totalWeight: 'Hành lý',
  journeyIndex: 'Chiều bay',
  legIndex: 'Chặng',
  flightNumber: 'Số hiệu chuyến bay',
  ageCategory: 'Tuổi ',
  name: 'Hành khách ',
  eticket: 'Số vé',
  price: 'Tiền vé chênh',
  fee: 'Phí',
  marketingAirline: 'Hãng bán vé',
  operatingAirline: 'Hãng vận hành',
  airlineClassCode: 'Hạng vé',
  numAdults: 'Số người lớn',
  paymentInfo: 'Thông tin thanh toán',
  guestNum: 'Số hành khách',
  paymentMethodName: 'Phương thức thanh toán',
  GuestValidator: 'Thông tin hành khách',
  TicketValidator: 'Thông tin hành trình',
  BookingBaggageValidator: 'Thông tin hành lý',
};
