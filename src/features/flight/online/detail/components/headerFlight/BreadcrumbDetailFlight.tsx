import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconBreadCrumb } from '~/assets';

const BreadcrumbDetailFlight = () => {
  const navigate = useNavigate();
  let location = useLocation();
  return (
    <div className='breadcrumb'>
      <Breadcrumb>
        <Breadcrumb.Item className='no-pointer'>
          <IconBreadCrumb />
        </Breadcrumb.Item>
        <Breadcrumb.Item className='no-pointer'>
          <FormattedMessage id='IDS_TEXT_FLIGHT' />
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() =>
            navigate(
              location.pathname.includes('online') ? '/sale/flight/online' : '/sale/flight/offline',
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
  );
};

export default BreadcrumbDetailFlight;
