import '~/features/flight/online/detail/FlightDetail.scss';
import { Skeleton } from 'antd';

const SkeletonFlightDetail = () => {
  return (
    <div className='flight-detail-online'>
      <div className='content-flight'>
        <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 50 }} />
        <Skeleton active paragraph={{ rows: 8 }} style={{ marginBottom: 50 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
      <div className='note-flight'>
        <div className='content'>
          <Skeleton active paragraph={{ rows: 4 }} style={{ marginBottom: 50 }} />
          <Skeleton active paragraph={{ rows: 5 }} />
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    </div>
  );
};
export default SkeletonFlightDetail;
