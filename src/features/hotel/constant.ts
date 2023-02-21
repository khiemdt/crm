import { some } from '~/utils/constants/constant';

export const defaultNoteModalValue = { type: null, open: false, name: null, modalWidth: null };

export const BOOKING_LOG_FIELDS = [
  { key: 'agencyId', title: 'Nhà cung cấp' },
  { key: 'partnerBookingCode', title: 'Mã đặt phòng' },
  { key: 'checkinCode', title: 'Mã đặt phòng' },
  { key: 'providerStatus', title: 'Trạng thái nhà cung cấp' },
  { key: 'confirmationTime', title: 'Thời gian xác nhận' },
  { key: 'hotelName', title: 'Tên khách sạn' },
  { key: 'checkIn', title: 'Ngày checkIn' },
  { key: 'checkOut', title: 'Ngày checkOut' },
  { key: 'surcharge', title: 'Giá bán phụ thu', typeValue: 'money' },
  { key: 'surchargeNet', title: 'Giá mua phụ thu', typeValue: 'money' },
  { key: 'discount', title: 'Giảm giá', typeValue: 'money' },
  { key: 'customerName', title: 'Người nhận phòng' },
  { key: 'totalPartnerPrice', title: 'Giá mua NCC', typeValue: 'money' },
  { key: 'serviceFee', title: 'Phí dịch vụ' },
  { key: 'paymentMethodFee', title: 'Phụ thu' },
  { key: 'paymentMethodId', title: 'Hình thức thanh toán của phụ thu' },
  { key: 'bookingType', title: 'Loại đơn hàng' },
  { key: 'rateType', title: 'Rate Type' },
  { key: 'hotelAddress', title: 'Địa chỉ khách sạn' },
  { key: 'cancelPolicies', title: 'Chính sách hoàn hủy' },
  { key: 'finalPriceFormatted', title: 'Tiền thanh toán' },
];

export const HOTEL_BOOKING_FIELDS = [
  { key: 'name', title: 'Tên khách sạn' },
  { key: 'address', title: 'Địa chỉ khách sạn' },
  { key: 'checkInTime', title: 'Giờ checkin' },
  { key: 'checkOutTime', title: 'Giờ checkout' },
];

export const ROOM_BOOKING_FIELDS = [
  { key: 'numNight', title: 'Số đêm phòng ' },
  { key: 'name', title: 'Tên phòng ' },
  { key: 'numAdult', title: 'Số người lớn phòng' },
  { key: 'numChildren', title: 'Số trẻ em phòng' },
  { key: 'freeBreakfast', title: 'Bữa Sáng phòng' },
  { key: 'contactName', title: 'Người nhận phòng' },
  { key: 'price', title: 'Giá phòng/đêm phòng', typeValue: 'money' },
  { key: 'netPrice', title: 'Giá mua NCC/đêm phòng', typeValue: 'money' },
  { key: 'contactPhoneNumber', title: 'SĐT người nhận phòng' },
  { key: 'customerName', title: 'Người nhận phòng' },
  { key: 'roomTitle', title: 'Tên phòng' },
  { key: 'pricePerNight', title: 'Giá phòng/đêm:' },
  { key: 'numRooms', title: 'Số phòng' },
  { key: 'childrenAges', title: 'Tuổi trẻ em phòng' },
];


export const getFieldObjectChange = (a: some, b: some) => {
  return Object.keys(a)
    .filter((key) => JSON.stringify(a[key]) !== JSON.stringify(b[key]))
    .sort();
};
