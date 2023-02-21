import { Col, Skeleton } from 'antd';
import '~/features/flight/online/detail/FlightDetail.scss';

const SkeletonHotelDetailPaymentInfo = () => {
  return (
    <Col className='flight-detail-online' style={{ gap: 10 }}>
      <Skeleton active paragraph={{ rows: 8 }} />
      <Skeleton active paragraph={{ rows: 8 }} />
      <Skeleton active paragraph={{ rows: 8 }} />
    </Col>
  );
};
export default SkeletonHotelDetailPaymentInfo;
