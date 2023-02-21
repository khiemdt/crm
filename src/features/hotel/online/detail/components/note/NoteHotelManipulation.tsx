import { Col, Divider, Row } from 'antd';
import * as React from 'react';
import {
  IconBookingHistory,
  IconCalendar,
  IconCommit,
  IconInfoRefresh,
  IconInvoice,
  IconOrderRejected,
  IconPaymentHistory,
  IconSearchAround,
  IconVisaCard,
  IconWorkLogs,
} from '~/assets';
import PaymentHistory from '~/features/flight/online/detail/components/PaymentHistory';
import { defaultNoteModalValue } from '~/features/hotel/constant';
import { setActionModalInfo } from '~/features/hotel/hotelSlice';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import NoteActionModal from './ActionModal';
import BookingHistory from './BookingHistory';

interface INoteHotelManipulationProps {}

enum INoteHotelManipulationAction {
  ciCo = 'ci-co',
  commitChecked = 'commitChecked',
  nccPayment = 'nccPayment',
  invoice = 'invoice',
  bookingRejected = 'bookingRejected',
  editInfo = 'editInfo',
  searchAround = 'searchAround',
  paymentHistory = 'paymentHistory',
  bookingHistory = 'bookingHistory',
  workLogs = 'workLogs',
}

const NoteHotelManipulation: React.FunctionComponent<INoteHotelManipulationProps> = (props) => {
  const dispatch = useAppDispatch();
  const { type, open, name, modalWidth }: some = useAppSelector(
    (state) => state.hotelReducer.noteModalManipulation,
  );

  const mainActionItemList: some[] = [
    { icon: <IconCalendar />, name: 'Gia hạn CI-CO', type: INoteHotelManipulationAction.ciCo },
    {
      icon: <IconCommit />,
      name: 'Check commit',
      type: INoteHotelManipulationAction.commitChecked,
    },
    {
      icon: <IconVisaCard />,
      name: 'Yêu cầu thanh toán NCC',
      type: INoteHotelManipulationAction.nccPayment,
    },
    {
      icon: <IconInvoice />,
      name: 'Xuất hóa đơn',
      type: INoteHotelManipulationAction.invoice,
    },
    {
      icon: <IconOrderRejected />,
      name: 'Hủy đơn hàng',
      type: INoteHotelManipulationAction.bookingRejected,
    },
    {
      icon: <IconInfoRefresh />,
      name: 'Sửa thông tin',
      type: INoteHotelManipulationAction.editInfo,
    },
    {
      icon: <IconSearchAround />,
      name: 'Tìm kiếm xung quanh',
      type: INoteHotelManipulationAction.searchAround,
    },
  ];

  const subActionItemList: some[] = [
    {
      icon: <IconPaymentHistory />,
      name: 'Lịch sử thanh toán',
      type: INoteHotelManipulationAction.paymentHistory,
      component: <PaymentHistory />,
      modalWidth: 1200,
    },
    {
      icon: <IconBookingHistory />,
      name: 'Lịch sử thay đổi thông tin đặt phòng',
      type: INoteHotelManipulationAction.bookingHistory,
      component: <BookingHistory />,
      modalWidth: 1200,
    },
    { icon: <IconWorkLogs />, name: 'Work logs', type: INoteHotelManipulationAction.workLogs },
  ];

  const getMenuItem = (item: some) => {
    return (
      <Row
        key={item?.type}
        className={`hotel-note-menu-item ${item?.type === type ? 'active-item' : ''}`}
        onClick={() => {
          dispatch(
            setActionModalInfo({
              type: item?.type,
              open: true,
              name: item.name,
              modalWidth: item.modalWidth,
            }),
          );
        }}
      >
        <Col span={3}>{item?.icon}</Col>
        <Col span={21} style={{ paddingTop: 2 }}>
          {item?.name}
        </Col>
      </Row>
    );
  };

  const handleCloseModal = () => {
    dispatch(setActionModalInfo({ ...defaultNoteModalValue, modalWidth: modalWidth || null }));
  };

  return (
    <div className='hotel-note-manipulation'>
      {mainActionItemList?.map((item: some) => {
        return getMenuItem(item);
      })}
      <Divider />
      {subActionItemList?.map((item: some) => {
        return getMenuItem(item);
      })}
      <NoteActionModal title={name} width={modalWidth} open={open} onClose={handleCloseModal}>
        {[...mainActionItemList, ...subActionItemList]?.find((item: some) => item.type === type)
          ?.component || <></>}
      </NoteActionModal>
    </div>
  );
};

export default NoteHotelManipulation;
