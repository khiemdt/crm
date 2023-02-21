import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Row, Select, Space, Table, Tag } from 'antd';
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
  const [dataTable, setDataTable] = useState<any[]>(bookingsOnline);

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

  const handelRefresh = () => {
    dispatch(
      fetFlightBookings({
        formData: filterOnline,
        isFilter: false,
        paging: pagingOnline,
      }),
    );
  };

  const onSelect = (value: any) => {
    if (!value) {
      setDataTable(bookingsOnline);
    } else {
      const arr = bookingsOnline.filter((el) => {
        return el.id == value;
      });
      setDataTable(arr);
    }
  };

  const columns: ColumnsType<BookingsOnlineType> = [
    {
      title: 'Booking ID',
      dataIndex: 'orderCode',
      key: 'orderCode',
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
            {record.id}
          </div>
        );
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
      <Row style={{ margin: '15px 0px' }}>
        <Col span={4}>
          <Select
            className='ant-select-selection-search'
            style={{ minWidth: 200 }}
            placeholder='Mã đơn hàng'
            showSearch
            onSelect={onSelect}
          >
            {[{ id: null, name: 'Tất cả' }, ...bookingsOnline].map((elm: some, index: number) => {
              return (
                <Select.Option key={index} value={elm?.id}>
                  {elm?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
      </Row>
      <Row className='title-total-items' justify='space-between'>
        <Col>
          <Space>
            <span>Tìm thấy tất cả {totalBookingsOnline} đơn hàng</span>
            <div className='icon-refresh' onClick={handelRefresh}>
              <IconRefreshGrayrice />
            </div>
          </Space>
        </Col>
        {/* <Col>
          <Dropdown placement='bottomRight' overlay={<Menu items={spToolsItem()} />}>
            <Button type='primary' icon={<DownOutlined />}>
              Công cụ hỗ trợ
            </Button>
          </Dropdown>
        </Col> */}
      </Row>
      <Table
        rowKey={(record) => record.orderCode}
        columns={columns}
        dataSource={dataTable}
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
      {!isEmpty(dataTable) &&
        !(pagingOnline.page === 1 && dataTable.length < pagingOnline.pageSize) && (
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
