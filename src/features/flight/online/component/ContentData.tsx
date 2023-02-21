import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Row, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { IconRefreshGrayrice } from '~/assets';
import PaginationTable from '~/components/pagination/PaginationTable';
import SmsEmailModal from '~/features/flight/components/modal/SmsEmailModal';
import { MODAL_KEY_EMAIL, MODAL_KEY_SMS } from '~/features/flight/constant';
import { fetFlightBookings } from '~/features/flight/flightSlice';
import InOutBound from '~/features/flight/online/component/InOutBound';
import LastSale from '~/features/flight/online/component/LastSale';
import '~/features/flight/online/FlightOnline.scss';
import { BookingsOnlineType, PagingOnline } from '~/features/flight/online/Modal';
import UnholdCreditModal from '~/features/payment_support/credit_hold_transaction/components/UnholdCreditModal';
import { some } from '~/utils/constants/constant';

import {
  formatMoney,
  getBookStatusFlight,
  getPaymentStatusFlight,
  isEmpty,
  removeFieldEmptyFilter,
} from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import HoldingLimitationModal from '../../components/modal/spTools/HoldingLimitationModal';

const ContentData = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [modal, setModal] = useState<some>({
    type: undefined,
    open: false,
    item: {},
  });

  const bookingsOnline: BookingsOnlineType[] = useAppSelector(
    (state) => state.flightReducer.bookingsOnline,
  );
  const isLoading: boolean = useAppSelector((state) => state.flightReducer.isLoading);
  const pagingOnline: PagingOnline = useAppSelector((state) => state.flightReducer.pagingOnline);
  const filterOnline: some = useAppSelector((state) => state.flightReducer.filterOnline);
  const totalBookingsOnline: number = useAppSelector(
    (state) => state.flightReducer.totalBookingsOnline,
  );

  const onChangePagination = (page: number, size: number) => {
    handleChangeRoute(filterOnline, { page, pageSize: size });
    dispatch(
      fetFlightBookings({
        formData: filterOnline,
        isFilter: false,
        paging: { page, pageSize: size },
      }),
    );
  };

  const handleChangeRoute = (formData: object, paging: some = {}) => {
    const searchParams = removeFieldEmptyFilter(formData);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...searchParams,
        ...paging,
      }).toString(),
    });
  };

  const handelModelSMS = (itemsDataRow: some) => {
    setModal({
      type: MODAL_KEY_SMS,
      open: true,
      item: itemsDataRow,
    });
  };

  const handelModelEmail = (itemsDataRow: some) => {
    setModal({
      type: MODAL_KEY_EMAIL,
      open: true,
      item: itemsDataRow,
    });
  };

  const handelRefresh = () => {
    dispatch(
      fetFlightBookings({
        formData: filterOnline,
        isFilter: false,
        paging: pagingOnline,
      }),
    );
  };

  const columns: ColumnsType<BookingsOnlineType> = [
    {
      title: 'Booking ID',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 80,
      render: (_, record) => {
        return (
          <div
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.open(`${location.pathname}/${record?.id}`, '_blank');
            }}
            style={{ padding: '12px auto' }}
          >
            {record.orderCode}
          </div>
        );
      },
    },
    {
      title: 'CA',
      dataIndex: 'caInfo',
      key: 'caInfo',
      render: (text) => {
        return <div style={{ minWidth: '80px' }}>{text.name}</div>;
      },
    },
    {
      title: 'Hành trình',
      key: 'in-out-bound',
      render: (_, record) => {
        return <InOutBound record={record} />;
      },
    },
    {
      title: 'Khởi hành',
      key: 'start-out-bound',
      dataIndex: 'outbound',
      render: (text) => {
        return <>{`${text?.departureDate} ${text?.departureTime}`}</>;
      },
    },
    {
      title: 'Ngày đặt',
      key: 'bookedDate',
      dataIndex: 'bookedDate',
    },
    {
      title: 'Người đặt',
      key: 'mainContact',
      dataIndex: 'mainContact',
      render: (text) => {
        return <>{`${text?.fullName}`}</>;
      },
    },
    {
      title: 'Tổng tiền',
      key: 'totalSellingPrice',
      dataIndex: 'totalSellingPrice',
      align: 'right',
      render: (text) => {
        return <>{`${formatMoney(text)}`}</>;
      },
      width: 120,
      className: 'column-total-price',
    },
    {
      title: 'Trạng thái đặt vé',
      key: 'bookStatus',
      dataIndex: 'bookStatus',
      render: (text) => {
        const status = getBookStatusFlight(text);
        return <Tag color={status.color}>{`${status?.title}`}</Tag>;
      },
      width: 140,
    },
    {
      title: 'Trạng thái thanh toán',
      key: 'paymentStatus',
      dataIndex: 'paymentStatus',
      render: (text) => {
        const status = getPaymentStatusFlight(text);
        return <Tag color={status.color}>{`${status?.title}`}</Tag>;
      },
      width: 150,
    },
    {
      title: 'Người xử lý',
      key: 'lastSaleName',
      dataIndex: 'lastSaleName',
      render: (text, record) => {
        return (
          <LastSale
            text={text}
            record={record}
            handelModelSMS={handelModelSMS}
            handelModelEmail={handelModelEmail}
          />
        );
      },
      className: 'column-sale-name',
    },
  ];

  const spToolsItem = () => {
    return [
      {
        key: '1',
        label: 'Thay đổi giới hạn giữ chỗ',
        icon: <SearchOutlined />,
        onClick: () => {
          setModal({
            open: false,
            value: null,
            type: 'unhold',
            title: 'Thay đổi giới hạn giữ chỗ',
          });
        },
      },
    ];
  };

  return (
    <>
      <Row className='title-total-items' justify='space-between'>
        <Col>
          <Space>
            <span>Tìm thấy tất cả {totalBookingsOnline} đơn hàng</span>
            <div className='icon-refresh' onClick={handelRefresh}>
              <IconRefreshGrayrice />
            </div>
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
        rowKey={(record) => record.orderCode}
        columns={columns}
        dataSource={bookingsOnline}
        loading={isLoading}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              window.open(`${location.pathname}/${record?.id}`, '_self');
            },
          };
        }}
      />
      {!isEmpty(bookingsOnline) &&
        !(pagingOnline.page === 1 && bookingsOnline.length < pagingOnline.pageSize) && (
          <PaginationTable
            page={pagingOnline.page - 1}
            size={pagingOnline.pageSize}
            onChange={onChangePagination}
            totalElements={totalBookingsOnline}
          />
        )}
      <SmsEmailModal modal={modal} setModal={setModal} />
      <HoldingLimitationModal modal={modal} setModal={setModal} />
    </>
  );
};
export default ContentData;
