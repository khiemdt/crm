import { Col, Row } from 'antd';
import { FC } from 'react';
import { IconInfomation, IconLocation, IconMonitor } from '~/assets';
import { some } from '~/utils/constants/constant';
import {
  getBookStatusHotel,
  getPaymentStatusHotel,
  getProviderStatusHotelHotel,
} from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';

const InfoBooking: FC = (props: some) => {
  const booking = useAppSelector((state) => state.hotelReducer.hotelOnlineDetail);
  const baseInfo = [
    {
      name: 'Checkin Code:',
      value: () => {
        return <span className='text-main'>{booking.checkInCode}</span>;
      },
    },
    {
      name: 'CA:',
      value: () => {
        return <span>{booking.caInfo?.name}</span>;
      },
    },
    {
      name: 'Loại đơn hàng:',
      value: () => {
        return <span>{booking.hotelBookingType || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Loại hợp đồng',
      value: () => {
        return <span>{booking.hotelRate?.contract || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Bao gồm VAT:',
      value: () => {
        return <span>{booking.hotelRate?.vatIncluded ? 'Yes' : 'No'}</span>;
      },
    },
    {
      name: 'Hình thức thanh toán:',
      value: () => {
        return <span>{booking.hotelRate?.paymentType || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Loại thanh toán cho NCC:',
      value: () => {
        return <span>{booking.hotelRate?.commitType || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Loại giảm giá:',
      value: () => {
        return <span>{booking.hotelRate?.priceType || 'Không có dữ liệu'}</span>;
      },
    },
  ];
  const statusBookingInfo = [
    {
      name: 'Ngày đặt phòng:',
      value: () => {
        return <span>{booking.bookingDate}</span>;
      },
    },
    {
      name: 'Trạng thái đặt phòng:',
      value: () => {
        const status = getBookStatusHotel(booking.bookingStatus);
        return (
          <span
            className='border-status'
            style={{
              backgroundColor: status?.backGround,
              color: status?.color,
            }}
          >{`${status?.title}`}</span>
        );
      },
    },
    {
      name: 'Trạng thái thanh toán:',
      value: () => {
        const status = getPaymentStatusHotel(booking.paymentStatus);
        return (
          <span
            className='border-status'
            style={{
              backgroundColor: status?.backGround,
              color: status?.color,
            }}
          >{`${status?.title}`}</span>
        );
      },
    },
    {
      name: 'Thời gian thanh toán',
      value: () => {
        return <span>{booking.orderCompletedDate || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Trạng thái NCC:',
      value: () => {
        const status = getProviderStatusHotelHotel(booking.providerStatus);
        return (
          <span
            className='border-status'
            style={{
              backgroundColor: status?.backGround,
              color: status?.color,
            }}
          >{`${status?.title}`}</span>
        );
      },
    },
    {
      name: 'Nguồn hàng:',
      value: () => {
        return (
          <span className='text-danger'>
            {booking.originSupplier}
            {booking.partnerBookingCode && (
              <span>
                {' '}
                | <span>{booking.partnerBookingCode}</span>
              </span>
            )}
          </span>
        );
      },
    },
    {
      name: 'Phương thức thanh toán:',
      value: () => {
        return <span>{booking.paymentMethod}</span>;
      },
    },
    {
      name: 'Loại đơn:',
      value: () => {
        return <span>{booking.isOnline ? 'Online' : 'Offline'}</span>;
      },
    },
    {
      name: 'Dynamic Pricing:',
      value: () => {
        return (
          <span className={booking.totalDynamicPrice ? 'text-success' : ''}>
            {booking.totalDynamicPrice ? 'Yes' : 'No'}
          </span>
        );
      },
    },
  ];
  return (
    <Row className='info-booking-hotel'>
      <Col span={8}>
        {baseInfo.map((info, indx) => (
          <div className='item-box' key={indx}>
            <span className='title'>{info.name} </span>
            <span>
              <info.value />
            </span>
          </div>
        ))}
      </Col>
      <Col span={8} style={{ paddingLeft: 16 }}>
        {statusBookingInfo.map((info, indx) => (
          <div className='item-box' key={indx}>
            <span className='title'>{info.name} </span>
            <span>
              <info.value />
            </span>
          </div>
        ))}
      </Col>
      <Col span={8}>
        <div className='booker-box'>
          <Row className='booker-box-info'>
            <span className='text-grey'>Booker:</span>
            <b>{booking.userInfo?.name}</b>
            <IconInfomation style={{ cursor: 'pointer' }} />
          </Row>
          <Row className='booker-box-info'>
            <span>Booker ID:</span>
            <span> {booking.userInfo?.id}</span>
          </Row>
          <Row
            className='booker-box-info'
            style={{ borderTop: '0.5px solid #D9DBDC', padding: '10px 0px', marginTop: '10px' }}
          >
            <span className='text-grey'>Thông tin người đặt:</span>
            <b>{booking.customerName}</b>
          </Row>
          <Row className='booker-box-info'>
            <span className='text-main'>{booking.customerPhone}</span>
            <span>|</span>
            <span className='text-main'>{booking.customerEmail}</span>
          </Row>
          {booking.customerAddress && (
            <Row className='booker-box-info'>
              <IconLocation />
              <span>{booking.customerAddress}</span>
            </Row>
          )}
          {booking.deviceInfo && (
            <Row className='booker-box-info'>
              <IconMonitor />
              <span>{booking.deviceInfo}</span>
            </Row>
          )}
        </div>
      </Col>
    </Row>
  );
};
export default InfoBooking;
