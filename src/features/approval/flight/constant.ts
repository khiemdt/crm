import { some } from '~/utils/constants/constant';

export enum FlightRefundStatus {
  approved = 'approved',
  pending = 'pending',
  rejected = 'rejected',
}

export const FLIGHT_REFUND_STATUS: some[] = [
  {
    id: FlightRefundStatus.approved,
    name: 'IDS_TEXT_FLIGHT_REFUND_STATUS_APPROVED',
    color: '#007864',
    backGround: '#E9FCEE',
    label: 'Đã duyệt',
  },
  {
    id: FlightRefundStatus.pending,
    name: 'Chờ duyệt',
    color: '#FFB30F',
    backGround: '#FFF0ED',
    label: 'Chờ duyệt',
  },
  {
    id: FlightRefundStatus.rejected,
    name: 'IDS_TEXT_FLIGHT_REFUND_STATUS_REJECTED',
    color: '#FF2C00',
    backGround: '#FFF0ED',
    label: 'Từ chối',
  },
];

export const FLIGHT_APPROVAL_STATUS: some[] = [
  { id: 1, name: 'Void-vé - Void-vé', refundType: 'VOID', type: 'Void vé' },
  { id: 2, name: 'Đơn lỗi - Đơn lỗi', refundType: 'VOID', type: 'Đơn lỗi' },
  {
    id: 3,
    name: 'Hoàn vé - Hoàn theo điều kiện từ yêu cầu của khách',
    refundType: 'CUSTOMER_CONDITIONAL_REFUND',
    type: 'Hoàn vé',
  },
  {
    id: 4,
    name: 'Hoàn vé - Hoàn theo điều kiện',
    refundType: 'CONDITIONAL_REFUND',
    type: 'Hoàn vé',
  },
  { id: 5, name: 'Hoàn vé - Hoàn bảo lưu', refundType: 'RESERVED_REFUND', type: 'Hoàn vé' },
  { id: 6, name: 'Hoàn vé - Hoàn SC', refundType: 'SC_REFUND', type: 'Hoàn vé' },
  { id: 7, name: 'Hoàn vé - Hoàn khác', refundType: 'OTHER_REFUND', type: 'Hoàn vé' },
  {
    id: 8,
    name: 'Hoàn vé - Hoàn xuất vé lỗi',
    refundType: 'CONFIRM_FAILED_REFUND',
    type: 'Hoàn vé',
  },
  { id: 9, name: 'Hoàn vé - Hoàn bảo hiểm', refundType: 'INSURANCE_REFUND', type: 'Hoàn vé' },
  {
    id: 10,
    name: 'Hoàn vé - Hoàn gói dịch vụ',
    refundType: 'BENEFIT_PACKAGE_REFUND',
    type: 'Hoàn vé',
  },
];
