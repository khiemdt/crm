import InputBackTop from '~/components/backtop/InputBackTop';
import Filters from '~/features/hotel/online/components/Filters';
import ContentData from '~/features/hotel/online/components/ContentData';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '~/utils/hook/redux';
import { useEffect } from 'react';
import { isEmpty } from '~/utils/helpers/helpers';
import { fetHotelBookings, fetstaticData } from '../hotelSlice';
import './HotelOnline.scss';
const HotelOnline = () => {
  let location = useLocation();
  const dispatch = useAppDispatch();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = 'Danh sách đơn hàng khách sạn online';
    dispatch(
      fetHotelBookings({
        formData: getPramsQuery()?.formTemp,
        isFilter: false,
        paging: getPramsQuery()?.paging,
      }),
    );
    dispatch(fetstaticData());
  }, []);

  const getPramsQuery = () => {
    let formTemp = {};
    let paging = {
      page: 1,
      pageSize: 10,
    };
    if (!isEmpty(location.search)) {
      let createdDate = {};
      let checkIn = {};
      let checkOut = {};
      let paymentDate = {};
      for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (
          param === 'filedAdds' ||
          param === 'agentList' ||
          param === 'handlingStatuses' ||
          param === 'paymentStatuses' ||
          param === 'paymentMethods' ||
          param === 'others' ||
          param === 'payProviderStatuses' ||
          param === 'refundPaymentFilter'
        ) {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(String),
          };
        } else if (
          param === 'caIds' ||
          param === 'hotelCategories' ||
          param === 'hotelSubCategories'
        ) {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(Number),
          };
        } else if (param === 'createdFromDate' || param === 'createdToDate') {
          createdDate = {
            ...createdDate,
            [param]: value,
          };
        } else if (param === 'checkinFromDate' || param === 'checkinToDate') {
          checkIn = {
            ...checkIn,
            [param]: value,
          };
        } else if (param === 'checkOutFromDate' || param === 'checkOutToDate') {
          checkOut = {
            ...checkOut,
            [param]: value,
          };
        } else if (param === 'paymentFromDate' || param === 'paymentToDate') {
          paymentDate = {
            ...paymentDate,
            [param]: value,
          };
        } else if (param === 'confirmStatus' || param === 'showMemberBookings') {
          formTemp = {
            ...formTemp,
            [param]: value === 'true' ? true : false,
          };
        } else if (param === 'page' || param === 'pageSize') {
          paging = {
            ...paging,
            [param]: value,
          };
        } else {
          formTemp = {
            ...formTemp,
            [param]: value,
          };
        }
      }
      if (!isEmpty(createdDate)) {
        formTemp = {
          ...formTemp,
          createdDate,
        };
      }
      if (!isEmpty(checkIn)) {
        formTemp = {
          ...formTemp,
          checkIn,
        };
      }
      if (!isEmpty(checkOut)) {
        formTemp = {
          ...formTemp,
          checkOut,
        };
      }
      if (!isEmpty(paymentDate)) {
        formTemp = {
          ...formTemp,
          paymentDate,
        };
      }
      return { formTemp, paging };
    }
  };

  return (
    <div className='container-flight-online container-hotel-online'>
      <span className='title'>Danh sách đặt phòng khách sạn</span>
      <Filters />
      <ContentData />
      <InputBackTop />
    </div>
  );
};
export default HotelOnline;
