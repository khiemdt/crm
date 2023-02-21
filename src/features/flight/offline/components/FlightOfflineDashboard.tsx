import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { message, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { approveFlightOfflineBooking, deleteFlightOfflineBooking } from '~/apis/flight';
import { IconCheckGreen, IconDelete, IconDeleteNote, IconEdit, IconRejectRed } from '~/assets';
import PaginationTable from '~/components/pagination/PaginationTable';
import { routes, some } from '~/utils/constants/constant';
import { DATE_FORMAT_TIME_BACK_END } from '~/utils/constants/moment';
import { formatMoney, isEmpty, removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { SUCCESS_CODE } from '../../constant';
import { fetFlightBookingOffline } from '../../flightSlice';
import {
  BookingOfflineStatus,
  FLIGHT_BOOKING_OFFLINE_STATUS,
  purchaseTypes,
  PURCHASE_TYPES,
} from '../constant';
import ConfirmModal from './ConfirmModal';
import SelectHandler from './SelectHandler';
interface IFlightOfflineDashboardProps {}

const FlightOfflineDashboard: React.FunctionComponent<IFlightOfflineDashboardProps> = (props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const { bookingsOffline, pagingOffline, filterOffline, isLoading, total }: some = useAppSelector(
    (state) => state.flightReducer,
  );

  const [modal, setModal] = React.useState<some>({
    open: false,
    bookingId: undefined,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const columns: ColumnsType<some> = [
    {
      title: 'Booking ID',
      key: 'bookingId',
      render: (_, record) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            {record?.bookingId ? <div>{`F${record?.bookingId}`}</div> : ''}
            {record?.purchaseType == PURCHASE_TYPES.BUSINESS && (
              <div className='text-success'>({PURCHASE_TYPES.BUSINESS}) </div>
            )}
          </div>
        );
      },
      width: 90,
    },
    {
      title: 'CA',
      dataIndex: 'caInfo',
      key: 'caInfo',
      render: (text) => {
        return <div style={{ whiteSpace: 'nowrap' }}>{text.name}</div>;
      },
    },
    {
      title: 'Hành trình',
      key: 'in-out-bound',
      render: (_, record) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${getAirportInfo(record?.fromAirport)}`}
            &nbsp;&rarr;&nbsp;
            {`${getAirportInfo(record?.toAirport)}`}
          </div>
        );
      },
      width: 100,
    },
    {
      title: 'Khởi hành',
      key: 'departureDate',
      render: (_, record) => {
        return (
          <>
            {record?.departureDate && (
              <div style={{minWidth:'100px'}}>{`${moment(record?.departureDate).format(DATE_FORMAT_TIME_BACK_END)}`}</div>
            )}
          </>
        );
      },
    },
    {
      title: 'Ngày đặt',
      key: 'bookedDate',
      render: (_, record) => {
        return (
          <>
            {record?.created && (
              <div style={{minWidth:'100px'}}>{`${moment(record?.created).format(DATE_FORMAT_TIME_BACK_END)}`}</div>
            )}
          </>
        );
      },
    },
    {
      title: 'Người đặt',
      key: 'handlerInfo',
      dataIndex: 'handlerInfo',
      render: (text) => {
        return <>{`${text?.fullName}`}</>;
      },
    },
    {
      title: 'Tiền thu KH',
      key: 'finalAmount',
      dataIndex: 'finalAmount',
      render: (_, record) => {
        return (
          <>
            {record?.finalAmount && (
              <div style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>{`${formatMoney(
                record?.finalAmount,
              )}`}</div>
            )}
          </>
        );
      },
      width: 100,
    },
    {
      title: 'Trạng thái thanh toán',
      key: 'paymentStatus',
      dataIndex: 'paymentStatus',
      render: (_, record) => {
        const status =
          FLIGHT_BOOKING_OFFLINE_STATUS?.find((elm) => elm.id === record.paymentStatus) || {};
        return <Tag color={status.color}>{`${status?.name || '_'}`}</Tag>;
      },
    },
    {
      title: 'Người xử lý',
      key: 'handler',
      dataIndex: 'handler',
      render: (_, record) => {
        return <>{`${record?.handlerInfo?.fullName}`}</>;
      },
    },
    {
      title: 'Giao cho',
      key: 'handler',
      dataIndex: 'handler',
      render: (_, record) => {
        return (
          <SelectHandler
            handlerInfo={{
              id: record?.handlerInfo?.saleId,
              label: record?.handlerInfo?.fullName,
            }}
            bookingId={record?.id}
          />
        );
      },
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 50 }}>
            {!record.bookingId ? (
              <>
                {record?.paymentStatus === BookingOfflineStatus.holding && (
                  <IconEdit
                    className='fl-bk-offline-icon-button'
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_OFFLINE}/${routes.FLIGHT_ADD_NEW_TICKET}?historyId=${record.id}`,
                        '_blank',
                      );
                    }}
                  />
                )}
                <IconDelete
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal({
                      open: !modal.open,
                      value: record,
                      type: 'delete',
                    });
                  }}
                  className='fl-bk-offline-icon-button'
                />
              </>
            ) : (
              <>
                {record?.paymentStatus == BookingOfflineStatus.holding && (
                  <>
                    <IconRejectRed
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal({
                          open: !modal.open,
                          value: record,
                          type: 'reject',
                        });
                      }}
                      className='fl-bk-offline-icon-button'
                    />
                    <IconCheckGreen
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal({
                          open: !modal.open,
                          value: record,
                          type: 'confirm',
                        });
                      }}
                      className='fl-bk-offline-icon-button'
                    />
                  </>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  const getAirportInfo = (value: string) => {
    return value?.indexOf(' - ') > 0 ? value?.substring(0, value?.indexOf(' - ')) : value;
  };

  const formatModalType = (value: string) => {
    switch (value) {
      case 'delete':
        return 'Xóa';
      case 'confirm':
        return 'Xác nhận';
      default:
        return 'Từ chối';
    }
  };

  const handleCloseModal = () => {
    setModal({
      open: false,
      bookingId: undefined,
    });
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

  const checkHolding = (value: string) => {
    return value === BookingOfflineStatus.holding;
  };

  const onChangePagination = (page: number, size: number) => {
    handleChangeRoute(filterOffline, { page, pageSize: size });
    dispatch(
      fetFlightBookingOffline({
        formData: filterOffline,
        isFilter: false,
        paging: { page, pageSize: size },
      }),
    );
  };

  const handleApproveOrDeleteBooking = async (value: some, type: string) => {
    try {
      setLoading(true);
      const { data } = await (type == 'delete'
        ? deleteFlightOfflineBooking({ id: value?.id })
        : approveFlightOfflineBooking(
            {
              id: value?.id,
              bookingId: value?.bookingId,
              amount: value?.finalAmount,
            },
            type,
          ));
      if (data.code === SUCCESS_CODE) {
        message.success(`${formatModalType(type)} thành công`);
        handleCloseModal();
        dispatch(
          fetFlightBookingOffline({
            formData: filterOffline,
            isFilter: false,
            paging: pagingOffline,
          }),
        );
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span className='fl-bk-offline-list-total-title'>
        <FormattedMessage id='IDS_TEXT_BOOKING_TOTAL_TITLE' values={{ value: total }} />
      </span>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={bookingsOffline}
        loading={isLoading}
        pagination={false}
        onRow={(record, rowIndex) => {
          if (isEmpty(record?.bookingId)) return {};
          return {
            onClick: (event) => {
              window.open(`${routes.FLIGHT_OFFLINE}/${record?.bookingId}`, '_blank');
            },
          };
        }}
      />
      {!isEmpty(bookingsOffline) &&
        !(pagingOffline.page === 1 && bookingsOffline.length < pagingOffline.pageSize) && (
          <PaginationTable
            page={Number(pagingOffline.page) - 1}
            size={Number(pagingOffline.pageSize)}
            onChange={onChangePagination}
            totalElements={total}
          />
        )}
      <ConfirmModal
        title={`${formatModalType(modal.type)} đơn hàng`}
        open={modal.open}
        onClose={handleCloseModal}
        onAccept={() => handleApproveOrDeleteBooking(modal.value, modal.type)}
        loading={loading}
      >
        {modal.type == 'delete' ? (
          <>
            <IconDeleteNote />
            <FormattedMessage id='IDS_TEXT_FLIGHT_OFFLINE_DELETE_BOOKING_NOTE' />
          </>
        ) : (
          <FormattedMessage
            id={`Bạn có chắc chắn muốn ${formatModalType(modal.type)} đơn hàng này?`}
          />
        )}
      </ConfirmModal>
    </>
  );
};

export default FlightOfflineDashboard;
