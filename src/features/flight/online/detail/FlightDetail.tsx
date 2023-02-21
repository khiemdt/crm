import { Alert, BackTop, message, Tabs } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IconCaretUp } from '~/assets';
import { fetFlightBookingsDetail1, fetGeneralInfo } from '~/features/flight/flightSlice';
import InfoFlight from '~/features/flight/online/detail/components/detailBookingInfo/InfoFlight';
import HeaderFlight from '~/features/flight/online/detail/components/headerFlight/HeaderFlight';
import InvoiceFlight from '~/features/flight/online/detail/components/invoice/InvoiceFlight';
import NoteTabs from '~/features/flight/online/detail/components/note/NoteTabs';
import PaymentHistory from '~/features/flight/online/detail/components/PaymentHistory';
import SkeletonFlightDetail from '~/features/flight/online/detail/components/SkeletonFlightDetail';
import '~/features/flight/online/detail/FlightDetail.scss';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

const { TabPane } = Tabs;

const FlightDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { isLoading, flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);
  const isOptimize: boolean = useAppSelector((state) => state.systemReducer.isOptimize);
  const collapsible: boolean = useAppSelector((state) => state.systemReducer.collapsible);

  useEffect(() => {
    document.title = `Chi tiết đơn hàng vé máy bay online F${id}`;
    getFlightBookingsDetail();
  }, []);

  const getFlightBookingsDetail = async () => {
    const { payload } = await dispatch(fetFlightBookingsDetail1({ id: id }));
    if (!isEmpty(payload)) {
      dispatch(fetGeneralInfo({ caId: payload?.caInfo?.id }));
    }
  };

  if (isLoading) return <SkeletonFlightDetail />;
  if (isEmpty(flightOnlineDetail))
    return (
      <Alert message='Lỗi đơn hàng' description={`Không tồn tại mã đặt chỗ ${id}`} type='error' />
    );

  return (
    <div className='flight-detail-online'>
      <div
        className='content-flight'
        style={{
          width: !isOptimize ? '100%' : collapsible ? 'calc(100% - 550px)' : 'calc(100% - 340px)',
        }}
      >
        <HeaderFlight />
        <Tabs defaultActiveKey='1'>
          <TabPane tab='THÔNG TIN CHI TIẾT' key='1'>
            <InfoFlight />
          </TabPane>
          <TabPane tab='LỊCH SỬ THANH TOÁN' key='2'>
            <PaymentHistory />
          </TabPane>
        </Tabs>
      </div>
      <BackTop>
        <div className='btn-scroll-top'>
          <IconCaretUp />
        </div>
      </BackTop>
    </div>
  );
};
export default FlightDetail;
