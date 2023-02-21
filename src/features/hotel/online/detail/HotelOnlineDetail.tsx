import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InputBackTop from '~/components/backtop/InputBackTop';
import InvoiceFlight from '~/features/flight/online/detail/components/invoice/InvoiceFlight';
import SkeletonFlightDetail from '~/features/flight/online/detail/components/SkeletonFlightDetail';
import '~/features/flight/online/detail/FlightDetail.scss';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { fetHotelBookingsDetailInit, fetHotelBookingsDetailInitV2 } from '../../hotelSlice';
import AriseHotelBooking from './components/arise/AriseHotelBooking';
import HeaderHotel from './components/HeaderHotel';
import InfoBooking from './components/infoTab/InfoBooking';
import InfoHotel from './components/infoTab/InfoHotel';
import PaymentInfo from './components/infoTab/PaymentInfo';
import Tags from './components/infoTab/Tags';
import NoteHotelTabs from './components/note/NoteHotelTabs';
import VoucherTab from './components/voucherTab/VoucherTab';
import './HotelOnlineDetail.scss';
const { TabPane } = Tabs;

const HotelOnlineDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: some) => state?.hotelReducer);

  const onChange = (key: string) => {
    console.log(key);
  };

  useEffect(() => {
    document.title = `Chi tiết đơn hàng khách sạn online H${id}`;
    getFlightBookingsDetail();
    getFlightBookingsDetailV2();
  }, []);

  const getFlightBookingsDetail = async () => {
    const { payload } = await dispatch(fetHotelBookingsDetailInit({ id }));
  };

  const getFlightBookingsDetailV2 = async () => {
    const { payload } = await dispatch(fetHotelBookingsDetailInitV2({ id }));
  };

  if (isLoading) return <SkeletonFlightDetail />;

  return (
    <div className='flight-detail-online hotel-detail-online'>
      <div className='content-hotel'>
        <HeaderHotel />
        <Tabs defaultActiveKey='1' onChange={onChange}>
          <TabPane tab='THÔNG TIN CHI TIẾT' key='1'>
            <InfoBooking />
            <InfoHotel />
            <PaymentInfo />
            <Tags />
          </TabPane>
          <TabPane tab='VOUCHER' key='2'>
            <VoucherTab />
          </TabPane>
          <TabPane tab='HÓA ĐƠN' key='3'>
            <InvoiceFlight id={id} module='hotel' />
          </TabPane>
          <TabPane tab='PHÁT SINH THÊM' key='4'>
            <AriseHotelBooking id={id} />
          </TabPane>
        </Tabs>
      </div>
      <NoteHotelTabs />
      <InputBackTop />
    </div>
  );
};
export default HotelOnlineDetail;
