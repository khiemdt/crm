import { Button, message } from 'antd';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { cancelHandlingBooking } from '~/apis/flight';
import { IconArrow2way, IconEmail, IconSms } from '~/assets';
import SmsEmailModal from '~/features/flight/components/modal/SmsEmailModal';
import { MODAL_KEY_EMAIL, MODAL_KEY_SMS } from '~/features/flight/constant';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import BreadcrumbDetailFlight from '~/features/flight/online/detail/components/headerFlight/BreadcrumbDetailFlight';
import ButtonAssignee from '~/features/flight/online/detail/components/headerFlight/ButtonAssignee';
import ButtonReceiveProcessing from '~/features/flight/online/detail/components/headerFlight/ButtonReceiveProcessing';
import { visibleOptimize } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

const HeaderFlight = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const userInfo: some = useAppSelector((state) => state?.systemReducer?.userInfo);
  const isOptimize: boolean = useAppSelector((state) => state.systemReducer.isOptimize);

  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);

  const [modal, setModal] = useState<some>({
    type: undefined,
    open: false,
    item: {},
  });

  const cancelHandelBooking = async () => {
    try {
      const { data } = await cancelHandlingBooking({
        bookingId: flightOnlineDetail?.id,
        bookingType: 'flight',
      });
      if (data.code === 200) {
        message.success('Hủy xử lý Booking thành công!');
        dispatch(fetFlightBookingsDetail({ filters: { dealId: flightOnlineDetail?.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelModelEmail = () => {
    setModal({
      type: MODAL_KEY_EMAIL,
      open: true,
      item: flightOnlineDetail,
    });
  };

  const handelModelSMS = () => {
    setModal({
      type: MODAL_KEY_SMS,
      open: true,
      item: flightOnlineDetail,
    });
  };

  const getProcess = (key: string) => {
    switch (key) {
      case 'waiting':
        return;

      case 'handling':
        return (
          <div className='text-handle'>
            {flightOnlineDetail?.lastSaleId === userInfo?.id ? (
              <span className='color-done'>
                Được xử lý bởi <small>{flightOnlineDetail?.lastSaleName}</small>
              </span>
            ) : (
              <span className='color-blue'>
                Được xử lý bởi <small>{flightOnlineDetail?.lastSaleName}</small>
              </span>
            )}
          </div>
        );

      case 'finish':
        return (
          <div className='text-handle'>
            <span className='color-done'>
              Được xử lý bởi <small>{flightOnlineDetail?.lastSaleName}</small>
            </span>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <div>
      <BreadcrumbDetailFlight />
      <div className='wrapper-header-title'>
        <div className='bookedInfo'>
          <h2 style={{ marginBottom: 5 }}>
            {intl.formatMessage({ id: 'IDS_TEXT_ORDER_DETAILS' })}: {flightOnlineDetail?.orderCode}
          </h2>
          <div className='text-grey'>
            {flightOnlineDetail?.orderId && (
              <span> {`Order: ${flightOnlineDetail?.orderId} - `}</span>
            )}
            {flightOnlineDetail?.parentId && (
              <span>
                Tách từ{' '}
                <a
                  className='text-blue'
                  target={'_blank'}
                  href={`/sale/flight/online/${flightOnlineDetail?.parentId}`}
                >
                  {flightOnlineDetail?.parentId} -
                </a>
              </span>
            )}
            <span>
              {' '}
              CA: <b className='text-success'>{flightOnlineDetail?.caInfo?.name}</b>{' '}
            </span>
          </div>
        </div>

        <div className='wrapper-header-button'>
          <ButtonReceiveProcessing />
          {flightOnlineDetail?.lastSaleId === userInfo?.id &&
            flightOnlineDetail.handlingStatus == 'handling' && (
              <Button onClick={cancelHandelBooking}>Hủy xử lý</Button>
            )}

          <ButtonAssignee typeBooking='flight' idBooking={flightOnlineDetail?.id} />
          <Button onClick={handelModelEmail}>
            <IconEmail />
            <FormattedMessage id='IDS_TEXT_SEND_EMAIL' />
          </Button>
          <Button onClick={handelModelSMS}>
            <IconSms />
            <FormattedMessage id='IDS_TEXT_SEND_SMS' />
          </Button>
          <Button
            onClick={() => {
              dispatch(visibleOptimize(!isOptimize));
            }}
          >
            <IconArrow2way />
          </Button>
        </div>
      </div>
      <SmsEmailModal modal={modal} setModal={setModal} />
    </div>
  );
};
export default HeaderFlight;
