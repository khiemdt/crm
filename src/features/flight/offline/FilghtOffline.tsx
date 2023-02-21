import { Button, Typography } from 'antd';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useSearchParams } from 'react-router-dom';
import InputBackTop from '~/components/backtop/InputBackTop';
import { fetFlightBookingOffline } from '~/features/flight/flightSlice';
import FlightOfflineFilter from '~/features/flight/offline/components/FlightOfflineFilter';
import '~/features/flight/offline/FlightOffline.scss';
import { routes, some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch } from '~/utils/hook/redux';
import { DEFAULT_PAGING } from '../constant';
import FlightOfflineDashboard from './components/FlightOfflineDashboard';

interface IFlightOfflineProps {}

const FlightOffline: React.FunctionComponent<IFlightOfflineProps> = (props) => {
  const intl = useIntl();
  let location = useLocation();
  const dispatch = useAppDispatch();
  let [searchParams] = useSearchParams();

  const getParams = () => {
    let paging: some = DEFAULT_PAGING;
    if (!isEmpty(location.search)) {
      for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (['page', 'pageSize'].includes(param)) {
          paging = {
            ...paging,
            [param]: value,
          };
        }
      }
    }
    return paging;
  };

  const handleCreate = () => {
    window.open(
      `/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_OFFLINE}/${routes.FLIGHT_ADD_NEW_TICKET}`,
      '_blank',
    );
  };

  React.useEffect(() => {
    document.title = intl.formatMessage({ id: 'IDS_TEXT_FLIGHT_OFFLINE_DASHBOARD_TITLE' });
    dispatch(
      fetFlightBookingOffline({
        formData: {},
        isFilter: false,
        paging: getParams(),
      }),
    );
  }, []);
  return (
    <div className='fl-bk-offline-container'>
      <div className='title-page'>
        <Typography.Title level={4} style={{ fontWeight: 500 }}>
          <FormattedMessage id='IDS_TEXT_FLIGHT_OFFLINE_DASHBOARD_TITLE' />
        </Typography.Title>
        <Button type='primary' onClick={handleCreate}>
          Thêm đơn hàng
        </Button>
      </div>
      <FlightOfflineFilter />
      <FlightOfflineDashboard />
      <InputBackTop />
    </div>
  );
};

export default FlightOffline;
