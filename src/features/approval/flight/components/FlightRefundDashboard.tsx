import { Button, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { IconRefreshGrayrice } from '~/assets';
import PaginationTable from '~/components/pagination/PaginationTable';
import { routes, some } from '~/utils/constants/constant';
import {
  DATE_FORMAT,
  DATE_FORMAT_FRONT_END,
  DATE_FORMAT_TIME_BACK_END,
} from '~/utils/constants/moment';
import { formatMoney, isEmpty, removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { fetFlightRefundBookings } from '../../approvalSlice';
import { FlightRefundStatus, FLIGHT_REFUND_STATUS } from '../constant';
import FlightRefundDashboardExpandRow from './FlightRefundDashboardExpandRow';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface IFlightRefundDashboardProps {}

const FlightRefundDashboard: React.FunctionComponent<IFlightRefundDashboardProps> = (props) => {
  const {
    isLoading,
    flightRefundTotal,
    flightFilter,
    flightRefundPaging,
    flightRefundBookings,
  }: some = useAppSelector((state) => state.approvalReducer);
  const salesList: some[] = useAppSelector((state) => state.flightReducer.salesList);
  const airlines: some[] = useAppSelector((state) => state.systemReducer.airlines);

  const dispatch = useAppDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const columns: ColumnsType<some> = [
    {
      title: 'ID',
      key: 'bookingId',
      render: (_, record) => {
        return (
          <div style={{ whiteSpace: 'nowrap', width: 40 }}>
            {record?.id ? <div>{`${record?.id}`}</div> : ''}
          </div>
        );
      },
    },
    {
      title: 'CA',
      dataIndex: 'caInfo',
      key: 'caInfo',
      render: (text) => {
        return <div style={{ whiteSpace: 'nowrap', width: 40 }}>{text.name}</div>;
      },
    },
    {
      title: 'Đơn hàng',
      key: 'bookingInfo',
      render: (_, record) => {
        const airlineInfo = airlines?.find(
          (elm: some) => elm?.id === record?.voidPostProcessing?.airlineId,
        );
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ whiteSpace: 'nowrap' }}>
              <span
                onClick={() => {
                  window.open(
                    `${location.origin}/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_ONLINE}/${record?.voidPostProcessing?.bookingId}`,
                    '_blank',
                  );
                }}
                style={{ color: '#004ebc', fontWeight: 500 }}
              >{`F${record?.voidPostProcessing?.bookingId}`}</span>
              &nbsp;|&nbsp;
              {record?.voidPostProcessing?.isOutbound === 1
                ? 'Chiều đi'
                : record?.voidPostProcessing?.isOutbound === 2
                ? 'Cả đơn hàng'
                : 'Chiều về'}
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>
              <img className='icon-airline' src={airlineInfo?.logo} alt='' />
              {record?.voidPostProcessing?.airlineName}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Code vé',
      key: 'code',
      dataIndex: 'voidPostProcessing',
      render: (text) => {
        return <div style={{ whiteSpace: 'nowrap' }}>{text.pnrCode}</div>;
      },
    },
    {
      title: 'Số tiền hoàn',
      key: 'refundAmount',
      dataIndex: 'voidPostProcessing',
      render: (text) => {
        return <div style={{ whiteSpace: 'nowrap' }}>{formatMoney(text.price)}</div>;
      },
    },
    {
      title: 'Loại hoàn hủy',
      dataIndex: 'voidPostProcessing',
      key: 'voidPostProcessing',
      render: (text) => {
        return (
          <div style={{ maxWidth: 240 }}>{`${text.type} ${
            text.voidType ? `(${text.voidType})` : ''
          }`}</div>
        );
      },
    },
    {
      title: 'Người yêu cầu',
      key: 'handler',
      dataIndex: 'bookingInfo',
      render: (__, record) => {
        return (
          <div style={{ whiteSpace: 'pre-line' }}>{`${
            record?.submitUserId
              ? salesList?.find((elx: some) => elx.id === record?.submitUserId)?.name
              : null
          }`}</div>
        );
      },
    },
    {
      title: 'Ngày phát sinh',
      key: 'bookedDate',
      render: (_, record) => {
        return (
          <>
            {record?.voidPostProcessing?.createdTime && (
              <div>{`${moment(record?.voidPostProcessing?.createdTime).format(DATE_FORMAT)}`}</div>
            )}
          </>
        );
      },
      width: 120,
    },
    {
      title: 'Trạng thái',
      key: 'bookedDate',
      render: (_, record) => {
        const status = FLIGHT_REFUND_STATUS?.find((elm: some) => elm.id === record.status) || {};
        const saleAgentInfo = salesList?.find((elx: some) => elx.id === record?.handleUserId);
        return (
          <div>
            <Tag color={status.color}>
              {status.label}
            </Tag>
            {saleAgentInfo && <p>{`${saleAgentInfo?.name}`} </p>}
          </div>
        );
      },
    },
    Table.EXPAND_COLUMN,
  ];

  const handelRefresh = () => {
    dispatch(
      fetFlightRefundBookings({
        formData: flightFilter,
        isFilter: false,
        paging: { ...flightRefundPaging, total: flightRefundTotal || 0 },
      }),
    );
  };

  const handleChangeRoute = (formData: object, paging: some = {}) => {
    const searchParams = removeFieldEmptyFilter(formData);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...searchParams,
        ...{ ...paging, total: flightRefundTotal || 0 },
      }).toString(),
    });
  };

  const onChangePagination = (page: number, size: number) => {
    handleChangeRoute(flightFilter, { page, pageSize: size });
    dispatch(
      fetFlightRefundBookings({
        formData: flightFilter,
        isFilter: false,
        paging: { page, pageSize: size, total: flightRefundTotal },
      }),
    );
  };

  return (
    <>
      <span className='fl-approval-total-title'>
        <FormattedMessage id='IDS_TEXT_BOOKING_TOTAL_TITLE' values={{ value: flightRefundTotal }} />
        <Button
          className='fl-approval-icon-button'
          onClick={handelRefresh}
          loading={isLoading}
          icon={<IconRefreshGrayrice className='fl-approval-icon' />}
        />
      </span>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={flightRefundBookings}
        loading={isLoading}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => (
            <FlightRefundDashboardExpandRow record={record} handelRefresh={handelRefresh} />
          ),
          expandIcon: ({ expanded, onExpand, record }) => (
            <Button
              className='fl-approval-icon-button'
              onClick={(e) => onExpand(record, e)}
              loading={isLoading}
              icon={!expanded ? <DownOutlined /> : <UpOutlined />}
            />
          ),
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
    </>
  );
};

export default FlightRefundDashboard;
