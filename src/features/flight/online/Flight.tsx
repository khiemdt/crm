import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useSearchParams } from 'react-router-dom';
import InputBackTop from '~/components/backtop/InputBackTop';
import { fetFlightBookings } from '~/features/flight/flightSlice';
import ContentData from '~/features/flight/online/component/ContentData';
import Filter from '~/features/flight/online/component/Filter';
import '~/features/flight/online/FlightOnline.scss';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch } from '~/utils/hook/redux';

const Flight = () => {
  let location = useLocation();
  const dispatch = useAppDispatch();
  let [searchParams] = useSearchParams();
  useEffect(() => {
    document.title = 'Danh sách đặt vé máy bay online';
    dispatch(
      fetFlightBookings({
        formData: getPramsQuery()?.formTemp,
        isFilter: false,
        paging: getPramsQuery()?.paging,
      }),
    );
  }, []);

  const getPramsQuery = () => {
    let formTemp = {};
    let paging = {
      page: 1,
      pageSize: 10,
    };
    if (!isEmpty(location.search)) {
      let createdDate = {};
      let departureDate = {};
      for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (
          param === 'filedAdds' ||
          param === 'agentList' ||
          param === 'handlingStatuses' ||
          param === 'paymentStatuses' ||
          param === 'paymentMethods' ||
          param === 'others'
        ) {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(String),
          };
        } else if (param === 'airlineIds' || param === 'caIds') {
          formTemp = {
            ...formTemp,
            [param]: value.split(',').map(Number),
          };
        } else if (param === 'createdFromDate' || param === 'createdToDate') {
          createdDate = {
            ...createdDate,
            [param]: value,
          };
        } else if (param === 'departureFromDate' || param === 'departureToDate') {
          departureDate = {
            ...departureDate,
            [param]: value,
          };
        } else if (param === 'confirmStatus') {
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
      if (!isEmpty(departureDate)) {
        formTemp = {
          ...formTemp,
          departureDate,
        };
      }
      return { formTemp, paging };
    }
  };
  return (
    <div className='container-flight-online'>
      <span className='title'>
        <FormattedMessage id='IDS_TEXT_LIST_FLIGHT_ONLINE_TITLE' />
      </span>
      <Filter />
      <ContentData />
      <InputBackTop />
    </div>
  );
};
export default Flight;
