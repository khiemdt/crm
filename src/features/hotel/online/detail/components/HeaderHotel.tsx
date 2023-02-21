import { Breadcrumb, Button, message } from 'antd';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { assignBooking } from '~/apis/hotel';
import {
  IconBreadCrumb,
  IconHotelAdd,
  IconHotelChecked,
  IconHotelEmail,
  IconHotelOut,
  IconSms,
} from '~/assets';
import { getLocationHref } from '~/features/flight/constant';
import ButtonAssignee from '~/features/flight/online/detail/components/headerFlight/ButtonAssignee';
import { fetHotelBookingsDetailInit } from '~/features/hotel/hotelSlice';
import SmsModal from '~/features/hotel/online/components/SmsEmail/SmsModal';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import EmailModal from '../../components/SmsEmail/EmailModal';

const getSalesName = (salesList?: some, id?: number) => {
  return salesList?.find((val: some) => val?.id === id)?.name;
};

export const MODAL_SMS = 'MODAL_SMS';
export const MODAL_EMAIL = 'MODAL_EMAIL';

const HeaderHotel = () => {
  const [modal, setModal] = useState<some>({
    type: null,
    open: false,
  });
  const salesList: some[] = useAppSelector((state) => state.flightReducer.salesList);

  const { id } = useParams();
  const navigate = useNavigate();
  let location = useLocation();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((state) => state.systemReducer);
  const hotelOnlineDetail = useAppSelector((state) => state.hotelReducer?.hotelOnlineDetail);

  const isProcessing = userInfo?.id === hotelOnlineDetail?.lastSaleId;

  const handleClose = () => {
    setModal({
      type: null,
      open: false,
    });
  };

  const fetAssignBooking = async (queryParams: object) => {
    try {
      const { data } = await assignBooking(queryParams);
      if (data.code === 200) {
        message.success('Đăng kí nhận xử lý thành công !');
        dispatch(fetHotelBookingsDetailInit({ id }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateReminderTicket = () => {
    window.open(
      getLocationHref() == 'dev'
        ? 'https://chat-dev.tripi.vn/'
        : 'https://chat-portal.vntravelgroup.com' +
            '/ticket/ticket-timer?paramKey=bookingId&value=F' +
            hotelOnlineDetail?.id +
            '&displayName=Mã%20đơn&20hàng&link=' +
            encodeURIComponent(window.location.href),
      '_blank',
    );
  };

  const handleRegisterProcessing = () => {
    !isProcessing &&
      fetAssignBooking({
        bookingId: id,
        bookingType: 'hotel',
        saleId: userInfo?.id,
      });
  };

  return (
    <div>
      <div className='breadcrumb'>
        <Breadcrumb>
          <Breadcrumb.Item className='no-pointer'>
            <IconBreadCrumb />
          </Breadcrumb.Item>
          <Breadcrumb.Item className='no-pointer'>Khách sạn</Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() =>
              navigate(
                location.pathname.includes('online')
                  ? '/sale/flight/online'
                  : '/sale/flight/offline',
              )
            }
          >
            <FormattedMessage
              id={
                location.pathname.includes('online')
                  ? 'IDS_TEXT_FLIGHT_ONLINE'
                  : 'IDS_TEXT_FLIGHT_OFFLINE'
              }
            />
          </Breadcrumb.Item>
          <Breadcrumb.Item className='breadcrumb-detail no-pointer'>
            <FormattedMessage id='IDS_TEXT_ORDER_DETAILS' />
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className='wrapper-header-title'>
        <div className='bookedInfo'>
          <h2>
            Mã đơn hàng: H{hotelOnlineDetail?.id}
            {hotelOnlineDetail?.orderId && (
              <span>
                ( <small style={{ color: '#677072' }}>{hotelOnlineDetail?.orderId}</small>)
              </span>
            )}
          </h2>
          <span className='color-done'>
            Được xử lý bởi <small>{getSalesName(salesList, hotelOnlineDetail?.lastSaleId)}</small>
          </span>
        </div>
        <div className='wrapper-header-button'>
          <Button
            className={isProcessing ? 'button-processing' : undefined}
            type='default'
            icon={<IconHotelChecked />}
            size='small'
            onClick={handleRegisterProcessing}
          >
            {isProcessing ? 'Đang xử lý' : 'Đăng ký xử lý'}
          </Button>
          <ButtonAssignee
            typeBooking='hotel'
            idBooking={hotelOnlineDetail?.id}
            icon={<IconHotelOut />}
          />
          <Button
            type='default'
            icon={<IconHotelEmail />}
            size='small'
            onClick={() => {
              setModal({
                type: MODAL_EMAIL,
                open: true,
              });
            }}
          >
            Gửi lại email xác nhận
          </Button>
          <Button
            type='default'
            icon={<IconSms />}
            size='small'
            onClick={() => {
              setModal({
                type: MODAL_SMS,
                open: true,
              });
            }}
          >
            Gửi lại SMS tới khách hàng
          </Button>
          <Button
            type='default'
            icon={<IconHotelAdd />}
            size='small'
            onClick={handleCreateReminderTicket}
          >
            Tạo ticket nhắc việc
          </Button>
        </div>
      </div>
      {modal?.type === MODAL_SMS && (
        <SmsModal open={modal?.open} bookingId={hotelOnlineDetail?.id} handleClose={handleClose} />
      )}
      {modal?.type === MODAL_EMAIL && (
        <EmailModal
          booking={hotelOnlineDetail}
          open={modal?.open}
          handleClose={handleClose}
          isShowPaymentGuide={
            hotelOnlineDetail?.paymentStatus && hotelOnlineDetail?.paymentStatus != 'success'
          }
        />
      )}
    </div>
  );
};
export default HeaderHotel;
