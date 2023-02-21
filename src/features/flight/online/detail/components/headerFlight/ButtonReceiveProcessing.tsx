import { Button, message } from 'antd';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { handleBooking } from '~/apis/flight';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

const ButtonReceiveProcessing: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const userInfo: some = useAppSelector((state) => state?.systemReducer?.userInfo);
  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);
  const getProcess = (key: string) => {
    switch (key) {
      case 'waiting':
        return <span>Nhận xử lý</span>;
      default:
        return <span>{flightOnlineDetail?.lastSaleName} Đang xử lý</span>;
    }
  };

  const fetHandleBooking = async (queryParams: object) => {
    try {
      const { data } = await handleBooking(queryParams);
      if (data.code === 200) {
        message.success(
          intl.formatMessage({ id: 'IDS_TEXT_RECEIVE_SUCCESSFUL_BOOKING_PROCESSING' }),
        );
        dispatch(fetFlightBookingsDetail({ filters: { dealId: flightOnlineDetail?.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isHandlingStatus = flightOnlineDetail?.handlingStatus === 'waiting';
  const handleReceiveProcessing = () => {
    if (isHandlingStatus) {
      fetHandleBooking({
        bookingId: flightOnlineDetail?.id,
        bookingType: 'flight',
      });
    }
  };

  return (
    <Button
      type='primary'
      className={isHandlingStatus ? 'btn-receive-processing' : 'btn-processing'}
      onClick={handleReceiveProcessing}
    >
      {getProcess(flightOnlineDetail?.handlingStatus)}
    </Button>
  );
};

export default ButtonReceiveProcessing;
