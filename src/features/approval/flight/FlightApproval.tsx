import { message, Typography } from 'antd';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { getGeneralInfo } from '~/apis/flight';
import '~/features/approval/flight/FlightApproval.scss';
import { DEFAULT_PAGING } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { fetFlightRefundBookings } from '../approvalSlice';
import FlightRefundDashboard from './components/FlightRefundDashboard';
import FlightRefundFilter from './components/FlightRefundFilter';

interface IFlightApprovalProps {}

const FlightApproval: React.FunctionComponent<IFlightApprovalProps> = (props) => {
  const intl = useIntl();
  let [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const [providerList, setProviderList] = React.useState<[]>([]);

  const getParams = () => {
    let result: some = { statuses: ['pending', 'approved', 'rejected'], paging: DEFAULT_PAGING };
    if (!isEmpty(location.search)) {
      for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (['page', 'pageSize'].includes(param)) {
          result = {
            ...result,
            paging: {
              ...result.paging,
              [param]: value,
            },
          };
        }
        if ('statuses' === param) {
          result = {
            ...result,
            statuses: value.split(',').map(String),
          };
        }
      }
    }
    return result;
  };

  const handleSearchPaymentMenthod = async (caId: any) => {
    try {
      const { data } = await getGeneralInfo({ caId });
      if (data.code === 200) {
        setProviderList(data?.data?.agencies);
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  React.useEffect(() => {
    document.title = intl.formatMessage({ id: 'IDS_TEXT_FLIGHT_REFUND_LIST' });
    dispatch(
      fetFlightRefundBookings({
        formData: { statuses: getParams().statuses },
        isFilter: false,
        paging: getParams().paging,
      }),
    );
  }, []);

  React.useEffect(() => {
    handleSearchPaymentMenthod(17);
  }, []);

  return (
    <div className='fl-approval-container'>
      <Typography.Title level={4} style={{ fontWeight: 500 }}>
        <FormattedMessage id='IDS_TEXT_FLIGHT_REFUND_LIST' />
      </Typography.Title>
      <FlightRefundFilter providerList={providerList} />
      <FlightRefundDashboard />
    </div>
  );
};

export default FlightApproval;
