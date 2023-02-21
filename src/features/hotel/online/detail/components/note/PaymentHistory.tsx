import { message, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getBookingHistoryTransaction } from '~/apis/hotel';
import { some } from '~/utils/constants/constant';
import { DATE_FORMAT_FRONT_END } from '~/utils/constants/moment';
import { formatMoney, getPaymentHistoryStatus } from '~/utils/helpers/helpers';

interface IPaymentHistoryProps {}

const PaymentHistory: React.FunctionComponent<IPaymentHistoryProps> = (props) => {
  const params = useParams();

  const [dataList, setData] = React.useState<some[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getBookingHistory = async () => {
    try {
      setLoading(true);
      const { data } = await getBookingHistoryTransaction({ bookingCode: `H${params.id}` });
      if (data.code === 200) {
        setData(data?.data?.items || []);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<some> = [
    {
      title: 'ID',
      key: 'bookingId',
      render: (_, record) => {
        return <>{record?.id}</>;
      },
    },
    // {
    //   title: 'Loại',
    //   key: 'type',
    //   render: (_, record) => {
    //     return <>{record?.id}</>;
    //   },
    // },
    {
      title: 'User ID',
      key: 'userID',
      render: (text) => {
        return <>{text?.userId}</>;
      },
    },
    {
      title: 'Mã giao dịch',
      key: 'transactionCode',
      render: (text) => {
        return <>{text?.transactionCode}</>;
      },
    },
    {
      title: 'Phương thức thanh toán',
      key: 'paymentMethodName',
      render: (text) => {
        return <>{text?.paymentMethodName}</>;
      },
    },
    {
      title: 'Thời gian giao dịch',
      key: 'paymentMethodName',
      render: (text) => {
        return (
          <>
            {text?.transactionTime && (
              <div>{`${moment(text?.transactionTime).format(DATE_FORMAT_FRONT_END)}`}</div>
            )}
          </>
        );
      },
    },
    {
      title: 'Tổng thanh toán',
      key: 'totalAmount',
      render: (text) => {
        return <>{formatMoney(text?.totalAmount)}</>;
      },
    },
    {
      title: 'Phí thanh toán',
      key: 'tripiPaymentFee',
      render: (text) => {
        return <>{formatMoney(text?.tripiPaymentFee)}</>;
      },
    },
    {
      title: 'Mã khuyến mãi',
      key: 'promotionCode',
      render: (text) => {
        return <>{text?.promotionCode}</>;
      },
    },
    {
      title: 'Chiết khấu',
      key: 'discount',
      render: (text) => {
        return <>{formatMoney(text?.discount)}</>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text) => {
        const status = getPaymentHistoryStatus(text);
        return <div style={{ color: status?.color }}>{status?.title}</div>;
      },
      width: 100,
    },
    {
      title: 'Sign-in Cổng',
      key: 'terminalCode',
      render: (text) => {
        return <>{formatMoney(text?.terminalCode)}</>;
      },
    },
  ];

  React.useEffect(() => {
    getBookingHistory();
  }, []);

  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={dataList}
      loading={loading}
      pagination={false}
      style={{ minHeight: 400 }}
    />
  );
};

export default PaymentHistory;
