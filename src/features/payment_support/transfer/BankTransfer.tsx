import { Typography } from 'antd';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { getAllBank } from '~/apis/flight';
import { itemListCA } from '~/components/popover/Modal';
import '~/features/approval/flight/FlightApproval.scss';
import { DEFAULT_PAGING } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch } from '~/utils/hook/redux';
import BankTransferDashboard from './components/BankTransferDashboard';
import BankTransferFilter from './components/BankTransferFilter';
import { fetGetBankTransfer } from '../PaymentSlice';

interface IFlightApprovalProps {}

const BankTransfer: React.FunctionComponent<IFlightApprovalProps> = (props) => {
  const intl = useIntl();
  let [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [listBank, setListBankPayment] = React.useState<itemListCA[]>([]);

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

  const fetAllBank = async () => {
    try {
      const { data } = await getAllBank();
      if (data.code === 200) {
        setListBankPayment(data.data);
      }
    } catch (error) {}
  };

  React.useEffect(() => {
    document.title = intl.formatMessage({ id: 'IDS_TEXT_PAYMENT_TRANSFER_LIST' });
    dispatch(
      fetGetBankTransfer({
        isFilter: false,
      }),
    );
    fetAllBank();
  }, []);

  return (
    <div className='fl-approval-container'>
      <Typography.Title level={4} style={{ fontWeight: 500 }}>
        <FormattedMessage id='IDS_TEXT_PAYMENT_TRANSFER_LIST' />
      </Typography.Title>
      <BankTransferFilter listBank={listBank} />
      <BankTransferDashboard />
    </div>
  );
};

export default BankTransfer;
