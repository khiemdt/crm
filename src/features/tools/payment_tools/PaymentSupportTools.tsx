import { Row, Tabs } from 'antd';
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import '~/features/tools/payment_tools/paymentTools.scss';
import { isEmpty } from '~/utils/helpers/helpers';
import BankAccountList from './components/BankAccountList';
import BankTransferPaymentRequest from './components/BankTransferPaymentRequest';
const PaymentSupportTools: React.FunctionComponent = () => {
  const [keyTab, setKeyTab] = useState('');
  let [searchParams] = useSearchParams();
  const getParams = () => {
    if (!isEmpty(location.search)) {
      for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (['item'].includes(param)) {
          setKeyTab(value);
        }
      }
    }
  };

  React.useEffect(() => {
    getParams();
  }, []);

  return (
    <Row className='payment-tools'>
      <Tabs
        activeKey={keyTab}
        onChange={(key) => {
          setKeyTab(key);
        }}
        type='line'
        style={{ width: '100%' }}
      >
        <Tabs.TabPane tab='Danh sách tài khoản ngân hàng' key='bankList'>
          <BankAccountList />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Tìm kiếm yêu cầu chuyển khoản' key='bankRequest'>
          <BankTransferPaymentRequest />
        </Tabs.TabPane>
      </Tabs>
    </Row>
  );
};
export default PaymentSupportTools;
