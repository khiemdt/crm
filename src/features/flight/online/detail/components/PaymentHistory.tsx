import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { paymentTransactionHistory } from '~/apis/flight';
import { DATE_TIME } from '~/features/flight/constant';
import { some, listImg } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';
import { formatMoney, getPaymentHistoryStatus } from '~/utils/helpers/helpers';
import { IconRefreshGrayrice } from '~/assets';
import { purchaseTypes } from '~/features/flight/offline/constant';

interface DataType {
  id: number;
  userId: number;
  transactionCode: string;
  paymentMethodName: string;
  transactionTime: string;
  totalAmount: number;
  tripiPaymentFee: number;
  promotionCode: string;
  discount: string;
  status: string;
  terminalCode: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Phương thức thanh toán',
    dataIndex: 'paymentMethodName',
    fixed: 'left',
    width: 200,
  },
  {
    title: 'Thời gian giao dịch',
    dataIndex: 'transactionTime',
    render: (text) => {
      return <div>{moment(text).format(DATE_TIME)}</div>;
    },
    fixed: 'left',
  },
  {
    title: 'Tổng thanh toán',
    dataIndex: 'totalAmount',
    render: (text) => {
      return <div>{formatMoney(text)}</div>;
    },
    fixed: 'left',
  },
  {
    title: 'Mã giao dịch',
    dataIndex: 'transactionCode',
  },
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Loại thanh toán',
    dataIndex: 'purchaseType',
    render: (text) => {
      return (
        <div>{purchaseTypes.find((el: some) => el.value == text)?.name || 'Không xác định'}</div>
      );
    },
  },
  {
    title: 'User ID',
    dataIndex: 'userId',
  },
  {
    title: 'Phí',
    dataIndex: 'tripiPaymentFee',
    render: (text) => {
      return <div>{formatMoney(text)}</div>;
    },
  },
  {
    title: 'Mã khuyến mãi',
    dataIndex: 'promotionCode',
  },
  {
    title: 'Chiết khấu',
    dataIndex: 'discount',
    render: (text) => {
      return <div>{formatMoney(text)}</div>;
    },
  },
  {
    title: 'Sign-in cổng',
    dataIndex: 'terminalCode',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (text) => {
      const status = getPaymentHistoryStatus(text);
      return <div style={{ color: status?.color }}>{status?.title}</div>;
    },
    fixed: 'right',
  },
];

const PaymentHistory = () => {
  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);

  const [loading, setLoading] = useState<boolean>(false);
  const [transactionHistory, setTransactionHistory] = useState<DataType[] | undefined>(undefined);

  const fetTransactionHistory = async (queryParams: object) => {
    setLoading(true);
    try {
      const { data } = await paymentTransactionHistory(queryParams);
      if (data.code === 200) {
        setTransactionHistory(data?.data?.items);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    if (flightOnlineDetail?.bookingCodes) {
      fetTransactionHistory({
        bookingCode: flightOnlineDetail?.bookingCodes?.join(','),
      });
    }
  };

  useEffect(() => {
    if (flightOnlineDetail?.bookingCodes) {
      fetTransactionHistory({
        bookingCode: flightOnlineDetail?.bookingCodes?.join(','),
      });
    }
  }, [flightOnlineDetail]);

  return (
    <>
      {!transactionHistory?.length ? (
        <div className='invoice-flight'>
          <div className='empty-invoice'>
            <img src={listImg.imgEmptyInvoiceFlight} alt='' className='img-empty' />
            <span>Bạn chưa có lịch sử thanh toán nào</span>
          </div>
        </div>
      ) : (
        <div className='payment-history-refresh'>
          <Button onClick={handleRefresh}>
            Refresh <IconRefreshGrayrice />
          </Button>
          <Table
            loading={loading}
            columns={columns}
            dataSource={transactionHistory.sort(
              (a: any, b: any) => b?.transactionTime - a?.transactionTime,
            )}
            pagination={false}
            scroll={{ x: 2000 }}
          />
        </div>
      )}
    </>
  );
};

export default PaymentHistory;
