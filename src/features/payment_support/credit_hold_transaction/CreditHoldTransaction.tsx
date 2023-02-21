import { Typography } from 'antd';
import { FC, ReactNode, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAppDispatch } from '~/utils/hook/redux';
import { fetGetHoldingCredit } from '../PaymentSlice';
import BankTransferDashboard from '../transfer/components/BankTransferDashboard';
import BankTransferFilter from '../transfer/components/BankTransferFilter';
import CreditTransferDashboard from './components/CreditTransferDashboard';
import CreditTransferFilter from './components/CreditTransferFilter';

const CreditHoldTransaction: FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  useEffect(() => {
    document.title = intl.formatMessage({ id: 'IDS_TEXT_PAYMENT_CREDIT_HOLD' });
    dispatch(
      fetGetHoldingCredit({
        formData: { paymentStatus: 'holding' },
        isFilter: false,
      }),
    );
  }, []);
  const listBank: any[] = [];
  return (
    <div className='fl-approval-container fl-bk-offline-container'>
      <Typography.Title level={4} style={{ fontWeight: 500 }}>
        <FormattedMessage id='IDS_TEXT_PAYMENT_CREDIT_HOLD' />
      </Typography.Title>
      <CreditTransferFilter />
      <CreditTransferDashboard />
    </div>
  );
};
export default CreditHoldTransaction;
