import React from 'react';
import { some } from '~/utils/constants/constant';
import {
  IconHotelBill,
  IconHotelCalendar,
  IconHotelCommit,
  IconHotelOrderTemporary,
  IconHotelPaymentInfo,
  IconHotelRefresh,
  IconHotelRefresh_1,
  IconHotelReset,
  IconHotelSearch,
  IconHotelVisaCardPayable,
} from '~/assets';

const MENU_MANIPULATION = [
  {
    icon: <IconHotelBill />,
    name: 'Gia hạn CI-CO',
  },
  {
    icon: <IconHotelCalendar />,
    name: 'Check commit',
  },
  {
    icon: <IconHotelCommit />,
    name: 'Yêu cầu thanh toán NCC',
  },
  {
    icon: <IconHotelOrderTemporary />,
    name: 'Xuất hóa đơn',
  },
  {
    icon: <IconHotelPaymentInfo />,
    name: 'Hủy đơn hàng',
  },
  {
    icon: <IconHotelRefresh />,
    name: 'Tìm kiếm xung quanh',
  },
  {
    icon: <IconHotelRefresh_1 />,
    name: 'Lịch sử thanh toán',
  },
  {
    icon: <IconHotelReset />,
    name: 'Lịch sử thay đổi thông tin đặt phòng',
  },
  {
    icon: <IconHotelSearch />,
    name: 'Work logs',
  },
  {
    icon: <IconHotelVisaCardPayable />,
    name: 'Work logs',
  },
];

const Manipulation = () => {
  return (
    <div className='wrapper-manipulation'>
      {MENU_MANIPULATION?.map((val: some, index: number) => {
        return (
          <div className='manipulation-item'>
            <div className='manipulation-'>{val?.icon}</div>
            <span>{val?.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Manipulation;
