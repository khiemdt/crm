import { Rule } from 'antd/lib/form';
interface ListFilterDefault {
  name: string;
  key: string;
  rules?: Rule[];
}
export const TRANSFER_STATUS_LIST: any[] = [
  {
    name: 'Thành công',
    id: 'SUCCESS',
    color: '#007864',
  },
  {
    name: 'Lỗi',
    id: 'ERROR',
    color: '#FF2C00',
  },
  {
    name: 'Hết hạn',
    id: 'EXPIRED',
    color: '#FF2C00',
  },
  {
    name: 'Cần kiểm tra',
    id: 'NEED_TO_CHECK',
    color: '#FFB30F',
  },
  {
    name: 'Chờ xử lý',
    id: 'IGNORED',
    color: '#FFB30F',
  },
];

export const findTransferStatus = (stt: string) =>
  TRANSFER_STATUS_LIST.find((el) => el.id === stt) || {};

export const TYPE_MODAL_BANK_TRANSFER = {
  NOTE: 'NOTE',
  MERGE_BOOKING: 'MERGE_BOOKING',
};

export const listFilterCreditHoldDefault: ListFilterDefault[] = [
  {
    name: 'IDS_TEXT_ORDER_CODE',
    key: 'bookingId',
  },
  {
    name: 'IDS_TEXT_ID_USER',
    key: 'userId',
  },
  {
    name: 'IDS_TEXT_CS_PROCESS_ORDER_HOTEL',
    key: 'saleId',
  },
];

export const ListAdditionType = [
  {
    id: 'Đổi tên',
    name: 'Đổi tên',
  },
  {
    id: 'Đổi vé',
    name: 'Đổi vé',
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
    id: 'Thêm xuất ăn',
    name: 'Thêm xuất ăn',
  },
  {
    id: 'Thêm chỗ ngồi',
    name: 'Thêm chỗ ngồi',
  },
  {
    id: 'Thêm hành lý',
    name: 'Thêm hành lý',
  },
  {
    id: 'Đổi ngày bay',
    name: 'Đổi ngày bay',
  },
];

export const ListPaymentStatusCreditHold = [
  {
    id: 'holding',
    name: 'Đang giữ tiền',
    color: '#FFB30F',
  },
  {
    id: 'awaiting-payment',
    name: 'Chờ thanh toán',
    color: '#FFB30F',
  },
  {
    id: 'completed',
    name: 'Đã thanh toán',
    color: '#007864',
  },
  {
    id: 'rejected',
    name: 'Từ chối',
    color: '#FF2C00',
  },
  {
    id: 'cancelled',
    name: 'Đã hủy',
    color: '#FF2C00',
  },
  {
    id: 'success',
    name: 'Thanh toán thành công',
    color: '#007864',
  },
  {
    id: 'failed',
    name: 'Thanh toán thất bại',
    color: '#FF2C00',
  },
  {
    id: 'waiting_payment',
    name: 'Chờ thanh toán',
    color: '#FFB30F',
  },
];
