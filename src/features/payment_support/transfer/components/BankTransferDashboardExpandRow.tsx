import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import * as React from 'react';
import { some } from '~/utils/constants/constant';
import { formatMoney, getPaymentStatusHotel } from '~/utils/helpers/helpers';

interface IFlightRefundDashboardExpandRowProps {
  record: some;
}

const BankTransferDashboardExpandRow: React.FunctionComponent<
  IFlightRefundDashboardExpandRowProps
> = ({ record }) => {
  const columns: ColumnsType<some> = [
    {
      title: 'Mã đơn',
      key: 'bookingId',
      dataIndex: 'bookingId',
      render: (text, record) => {
        return <b className='text-blue'>{`${record.module == 'flight' ? 'F' : 'H'}${text}`}</b>;
      },
    },
    {
      title: 'Mã thanh toán',
      key: 'bookingCode',
      dataIndex: 'bookingCode',
      render: (text, record) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Mã giao dịch',
      key: 'transactionCode',
      dataIndex: 'transactionCode',
      render: (text, record) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Số tiền',
      key: 'matchAmount',
      dataIndex: 'matchAmount',
      render: (text, record) => {
        return (
          <span>
            {formatMoney(record.matchAmount)}/{formatMoney(record.amount)}
          </span>
        );
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (text, record) => {
        const status = getPaymentStatusHotel(text);
        return <span style={{ color: status.color }}>{`${status?.title}`}</span>;
      },
    },
  ];
  return (
    <Row justify='end' wrap={false} gutter={10}>
      <Col span={12}>
        <b>Thông tin giao dịch</b>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={record?.bankTransferRequests || []}
          pagination={false}
        />
      </Col>
    </Row>
  );
};

export default BankTransferDashboardExpandRow;
