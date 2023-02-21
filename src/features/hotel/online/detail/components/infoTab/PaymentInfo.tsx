import { Col, Divider, Row } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import SkeletonHotelDetailPaymentInfo from '~/features/flight/online/detail/components/SkeletonHotelDetailPaymentInfo';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';
import Agency from './paymentinfo/Agency';
import Customer from './paymentinfo/Customer';

interface IPaymentInfoProps {}

const PaymentInfo: React.FunctionComponent<IPaymentInfoProps> = (props) => {
  const bookingV2 = useAppSelector((state) => state.hotelReducer.hotelOnlineDetailV2);
  const { isLoadingV2 } = useAppSelector((state: some) => state?.hotelReducer);
  if (isLoadingV2) return <SkeletonHotelDetailPaymentInfo />;
  return (
    <Row className='hotel-detail-payment-info' gutter={10}>
      <Col span={8}>
        <Customer data={bookingV2.customerPriceInfo} />
      </Col>
      <Col span={8}>
        <div className='hotel-detail-payment-info-card'>
          <span className='hotel-detail-payment-info-title'>
            <FormattedMessage id='IDS_TEXT_HOTEL_PAYMENT' />
          </span>
          <Divider />
        </div>
      </Col>
      {bookingV2?.agencyPriceInfo?.agencyList.length && (
        <Col span={8}>
          <Agency data={bookingV2?.agencyPriceInfo?.agencyList[0]} />
        </Col>
      )}
    </Row>
  );
};

export default PaymentInfo;
