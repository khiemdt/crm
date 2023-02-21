import {
  EditOutlined,
  MergeCellsOutlined,
  DownOutlined,
  UpOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, MenuProps, Row, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { IconHorizonta, IconRefreshGrayrice } from '~/assets';
import PaginationTable from '~/components/pagination/PaginationTable';
import { routes, some } from '~/utils/constants/constant';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { findTransferStatus, TYPE_MODAL_BANK_TRANSFER } from '../../constant';

import { fetGetBankTransfer } from '../../PaymentSlice';
import BankTransferDashboardExpandRow from './BankTransferDashboardExpandRow';
import BankTransferDrawer from './BankTransferDrawer';
import MergeBookingModal from './MergeBookingModal';

interface IFlightRefundDashboardProps {}

interface Props {
  type?: string;
  item?: any;
  title?: string;
}

const BankTransferDashboard: React.FunctionComponent<IFlightRefundDashboardProps> = (props) => {
  const [modal, setModal] = React.useState<some>({
    type: undefined,
    item: undefined,
    title: undefined,
  });
  const navigate = useNavigate();

  const {
    isLoading,
    flightRefundTotal,
    flightFilter,
    flightRefundPaging,
    flightRefundBookings,
  }: some = useAppSelector((state) => state.bankTransferReducer);
  const dispatch = useAppDispatch();

  const spToolsItem = () => {
    return [
      {
        key: '1',
        label: 'Tìm kiếm yêu cầu chuyển khoản',
        icon: <SearchOutlined />,
        onClick: () => {
          navigate({
            pathname: `/${routes.SUPPORT_TOOLS}/${routes.PAYMENT_TOOL}`,
            search: createSearchParams({
              item: 'bankRequest',
            }).toString(),
          });
        },
      },
      {
        key: '2',
        label: 'Danh sách yêu cầu chuyển khoản',
        icon: <UnorderedListOutlined />,
        onClick: () => {
          navigate({
            pathname: `/${routes.SUPPORT_TOOLS}/${routes.PAYMENT_TOOL}`,
            search: createSearchParams({
              item: 'bankList',
            }).toString(),
          });
        },
      },
    ];
  };

  const itemAction = (record: some) => {
    const totalAmount = record?.bankTransferRequests
      ? record?.bankTransferRequests.reduce(function (a: some, b: any) {
          return a + b?.matchAmount || 0;
        }, 0)
      : 0;
    const defaults = [
      {
        key: '2',
        label: 'ghi chú',
        icon: <EditOutlined />,
        onClick: () => {
          setModal({
            type: TYPE_MODAL_BANK_TRANSFER.NOTE,
            item: record,
            title: ' Ghi chú',
          });
        },
      },
    ];
    if (totalAmount != record.amount) {
      defaults.push({
        key: '1',
        label: 'Ghép đơn',
        icon: <MergeCellsOutlined />,
        onClick: () => {
          setModal({
            type: TYPE_MODAL_BANK_TRANSFER.MERGE_BOOKING,
            item: record,
            title: 'Ghép đơn hàng',
          });
        },
      });
    }
    return defaults;
  };

  const columns: ColumnsType<some> = [
    {
      title: 'Thông tin chuyển khoản',
      key: 'bookingId',
      render: (_, record) => {
        return (
          <Row>
            <Col span={10}>Ngân hàng:</Col>
            <Col span={14}>{record?.bankName}</Col>
            <Col span={10}>STK:</Col>
            <Col span={14}>{record?.bankAccount}</Col>
            <Col span={10}>Mã giao dịch:</Col>
            <Col span={14} className='text-success'>
              {record?.transactionCode}
            </Col>
            <Col span={10}>Thời gian:</Col>
            <Col span={14}>{record?.receivedTime}</Col>
          </Row>
        );
      },
      width: 300,
    },
    {
      title: 'Nội dung tin nhắn',
      key: 'bookingId',
      render: (_, record) => {
        return <div style={{ wordBreak: 'break-word' }}>{record.smsContent}</div>;
      },
    },
    {
      title: 'Số tiền',
      key: 'amount',
      dataIndex: 'amount',
      render: (text, record) => {
        return <span>{formatMoney(text)}</span>;
      },
      width: 100,
    },
    {
      title: 'Đã ghép đơn/còn lại',
      key: 'amount',
      dataIndex: 'amount',
      render: (text, record) => {
        const totalAmount = record.bankTransferRequests
          ? record.bankTransferRequests.reduce(function (a: some, b: any) {
              return a + b?.matchAmount || 0;
            }, 0)
          : 0;

        return (
          <span>
            {formatMoney(totalAmount)}/
            <span className={record.amount !== totalAmount ? 'text-danger' : ''}>
              {formatMoney(record.amount > totalAmount ? record.amount - totalAmount : 0)}
            </span>
          </span>
        );
      },
      width: 200,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (text) => {
        return <Tag color={findTransferStatus(text).color}>{findTransferStatus(text).name} </Tag>;
      },
    },
    {
      title: 'Hành động ',
      key: 'status',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <Dropdown placement='bottomRight' overlay={<Menu items={itemAction(record)} />}>
            <Button type='text'>
              <IconHorizonta />
            </Button>
          </Dropdown>
        );
      },
      width: 100,
    },
    Table.EXPAND_COLUMN,
  ];

  const handelRefresh = () => {
    dispatch(
      fetGetBankTransfer({
        formData: flightFilter,
        isFilter: false,
        ...flightRefundPaging,
      }),
    );
  };

  const onChangePagination = (page: number, size: number) => {
    dispatch(
      fetGetBankTransfer({
        formData: flightFilter,
        isFilter: false,
        page,
        size,
        flightRefundTotal,
      }),
    );
  };

  return (
    <>
      <Row className='fl-approval-total-title' style={{ justifyContent: 'space-between' }}>
        <Col>
          <Space align='center'>
            <FormattedMessage
              id='IDS_TEXT_BOOKING_TOTAL_TITLE_TRANS'
              values={{ value: flightRefundTotal }}
            />
            <Button
              className='fl-approval-icon-button'
              onClick={handelRefresh}
              loading={isLoading}
              icon={<IconRefreshGrayrice className='fl-approval-icon' />}
            />
          </Space>
        </Col>
        <Col>
          <Dropdown placement='bottomRight' overlay={<Menu items={spToolsItem()} />}>
            <Button type='primary' icon={<DownOutlined />}>
              Công cụ hỗ trợ
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={flightRefundBookings}
        loading={isLoading}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => <BankTransferDashboardExpandRow record={record} />,
          expandIcon: () => null,
          expandRowByClick: true,
        }}
      />
      {!isEmpty(flightRefundBookings) &&
        !(
          flightRefundPaging.page === 1 && flightRefundBookings.length < flightRefundPaging.pageSize
        ) && (
          <PaginationTable
            page={Number(flightRefundPaging.page) - 1}
            size={Number(flightRefundPaging.pageSize)}
            onChange={onChangePagination}
            totalElements={flightRefundTotal}
          />
        )}
      <BankTransferDrawer modal={modal} setModal={setModal} />
      <MergeBookingModal modal={modal} setModal={setModal} />
    </>
  );
};

export default BankTransferDashboard;
