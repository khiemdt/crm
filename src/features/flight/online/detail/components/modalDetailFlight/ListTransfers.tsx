import { Button, message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { bankTransfer } from '~/apis/flight';
import { LIST_STATUS_TRANSFER } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { formatMoney } from '~/utils/helpers/helpers';

const columns: ColumnsType<any> = [
  {
    title: 'ID giao dịch',
    dataIndex: 'id',
    render: (text) => {
      return <div>{text}</div>;
    },
  },
  {
    title: 'Tổng tiền thanh toán',
    dataIndex: 'amount',
    render: (text) => {
      return <div style={{ textAlign: 'center' }}>{formatMoney(text)}</div>;
    },
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (text) => {
      const dataStatus = LIST_STATUS_TRANSFER?.find((val) => val?.id == text);
      return <div style={{ color: dataStatus?.color }}>{dataStatus?.name}</div>;
    },
  },
  {
    title: 'Thời gian chuyển khoản',
    dataIndex: 'receivedTime',
    render: (text) => {
      return <div>{text}</div>;
    },
  },
];

interface Props {
  bankTransferRequest: some;
  handleClose: () => void;
}

const ListTransfers: React.FC<Props> = (props) => {
  const { bankTransferRequest, handleClose } = props;
  const [dataTransfers, setDataTransfers] = useState<some[]>([]);

  const fetBankTransfer = async (queryParams = {}) => {
    try {
      const { data } = await bankTransfer(queryParams);
      if (data.code === 200) {
        setDataTransfers(data?.data?.bankTransferTransactionList);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetBankTransfer({
      bankTransferRequestId: bankTransferRequest?.id,
    });
  }, []);

  return (
    <div>
      <h3
        style={{
          color: '#0B0C0D',
          marginBottom: 12,
        }}
      >
        Tổng tiền chuyển khoản:
        <span style={{ color: '#007864' }}>
          {' '}
          {formatMoney(bankTransferRequest?.transferredAmount)}
        </span>
        /{formatMoney(bankTransferRequest?.amount)}
      </h3>
      <Table
        className='wrap-table-transfer'
        pagination={false}
        dataSource={dataTransfers}
        columns={columns}
      />
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Button type='primary' onClick={handleClose}>
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default ListTransfers;
