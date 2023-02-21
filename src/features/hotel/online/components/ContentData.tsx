import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { IconRefreshGrayrice } from '~/assets';
import PaginationTable from '~/components/pagination/PaginationTable';
import '~/features/flight/online/FlightOnline.scss';
import { BookingsOnlineType, PagingOnline } from '~/features/flight/online/Modal';
import { fetHotelBookings } from '~/features/hotel/hotelSlice';
import LastSale from '~/features/hotel/online/components/LastSale';
import { some } from '~/utils/constants/constant';
import {
  formatMoney,
  getBookStatusHotel,
  getPaymentStatusHotel,
  isEmpty,
  removeFieldEmptyFilter,
  stringSlug,
} from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { MODAL_EMAIL, MODAL_SMS } from '~/features/hotel/online/detail/components/HeaderHotel';
import SmsModal from '~/features/hotel/online/components/SmsEmail/SmsModal';
import EmailModal from '~/features/hotel/online/components/SmsEmail/EmailModal';
import ModalPolicies from './ModalPolicies';

const ContentData = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [modal, setModal] = useState<some>({
    type: undefined,
    open: false,
    item: {},
  });

  const bookingsOnline: BookingsOnlineType[] = useAppSelector(
    (state) => state.hotelReducer.bookingsOnline,
  );
  const isLoading: boolean = useAppSelector((state) => state.hotelReducer.isLoading);
  const pagingOnline: PagingOnline = useAppSelector((state) => state.hotelReducer.pagingOnline);
  const filterOnline: some = useAppSelector((state) => state.hotelReducer.filterOnline);
  const totalBookingsOnline: number = useAppSelector(
    (state) => state.hotelReducer.totalBookingsOnline,
  );

  const onChangePagination = (page: number, size: number) => {
    handleChangeRoute(filterOnline, { page, pageSize: size });
    dispatch(
      fetHotelBookings({
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
      type: MODAL_SMS,
      open: true,
      item: itemsDataRow,
    });
  };

  const handelModelEmail = (itemsDataRow: some) => {
    setModal({
      type: MODAL_EMAIL,
      open: true,
      item: itemsDataRow,
    });
  };

  const handleClose = () => {
    setModal({
      type: null,
      open: false,
      item: {},
    });
  };

  const handelRefresh = () => {
    dispatch(
      fetHotelBookings({
        formData: filterOnline,
        isFilter: false,
        paging: pagingOnline,
      }),
    );
  };

  const columns: ColumnsType<some> = [
    {
      title: 'Booking ID',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 85,
      className: 'text-main',
    },
    {
      title: 'CA',
      dataIndex: 'caInfo',
      key: 'caInfo',
      render: (text) => {
        return <div>{text.name}</div>;
      },
      width: 80,
    },
    {
      title: 'Khách sạn',
      key: 'hotelName',
      render: (_, record) => {
        return (
          <div className='item-col-hotel text-main'>
            <span
              // className='name-hotel'
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (record.caInfo.id !== 17) {
                  window.open(
                    `${import.meta.env.VITE_PUBLIC_DOMAIN_WEB_TRIPI}/hotel/detail?hotelId=${
                      record.hotelId
                    }&checkIn=${record.checkinDate}&checkOut=${record.checkoutDate}&roomCount=${
                      record.numRooms
                    }&adultCount=${record.numAdults}&childCount=${record.numChildren}`,
                    '_blank',
                  );
                } else {
                  window.open(
                    `${import.meta.env.VITE_PUBLIC_DOMAIN_WEB_MYTOUR}/khach-san/${
                      record.hotelId
                    }-${stringSlug(record.hotelName)}.html?checkIn=${record.checkinDate}&checkOut=${
                      record.checkoutDate
                    }&rooms=${record.numRooms}&adults=${record.numAdults}&children=${
                      record.numChildren
                    }`,
                    '_blank',
                  );
                }
              }}
            >{`${record.hotelName} - ${record.hotelId}`}</span>
            {!isEmpty(record.cancellationPolicies) && (
              <span
                style={{ fontSize: 12 }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setModal({
                    type: 'MODAL_KEY_POLICIES',
                    open: false,
                    item: record,
                  });
                }}
              >
                Chính sách hoàn hủy
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Loại phòng',
      key: 'roomTitle',
      dataIndex: 'roomTitle',
      // width: 110,
    },
    {
      title: 'Số phòng',
      key: 'numRooms',
      dataIndex: 'numRooms',
      align: 'center',
      width: 80,
    },
    {
      title: 'Ngày đặt',
      key: 'bookingDate',
      dataIndex: 'bookingDate',
      render: (text) => {
        return <>{`${moment(text, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')}`}</>;
      },
      width: 95,
    },
    {
      title: 'Thời gian lưu trú',
      key: 'checkin',
      render: (text, record) => {
        return (
          <div className='item-col-hotel'>
            <span>{`${record.checkinDate}`}</span>
            <span>{`${record.checkoutDate}`}</span>
          </div>
        );
      },
      width: 95,
    },
    {
      title: 'Người đặt',
      key: 'customer',
      render: (text, record) => {
        return (
          <div className='item-col-hotel'>
            <span>{`${record.customerName}`}</span>
            <span className='text-main'>{`${record.customerPhone}`}</span>
            <span className='text-main'>{`${record.customerEmail}`}</span>
          </div>
        );
      },
      // width: 130,
    },
    {
      title: 'Tổng tiền',
      key: 'price',
      dataIndex: 'price',
      render: (text) => {
        return <>{`${formatMoney(text)}`}</>;
      },
      width: 95,
    },
    {
      title: 'Trạng thái đặt phòng',
      key: 'bookingStatus',
      dataIndex: 'bookingStatus',
      render: (text) => {
        const status = getBookStatusHotel(text);
        return <span style={{ color: status.color }}>{`${status?.title}`}</span>;
      },
      width: 120,
    },
    {
      title: 'Trạng thái thanh toán',
      key: 'paymentStatus',
      dataIndex: 'paymentStatus',
      render: (text) => {
        const status = getPaymentStatusHotel(text);
        return <span style={{ color: status.color }}>{`${status?.title}`}</span>;
      },
      width: 120,
    },
    {
      title: 'Người xử lý',
      key: 'lastSaleId',
      dataIndex: 'lastSaleId',
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
      width: 130,
      className: 'column-sale-name',
    },
  ];

  return (
    <>
      <div className='title-total-items'>
        Tìm thấy tất cả {totalBookingsOnline} đơn hàng
        <span className='icon-refresh' onClick={handelRefresh}>
          <IconRefreshGrayrice />
        </span>
      </div>
      <Table
        rowKey={(record) => record.orderCode}
        columns={columns}
        dataSource={bookingsOnline}
        loading={isLoading}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              window.open(`${location.pathname}/${record?.id}`, '_blank');
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
      {modal?.type === MODAL_SMS && (
        <SmsModal open={modal?.open} bookingId={modal?.item?.id} handleClose={handleClose} />
      )}
      {modal?.type === MODAL_EMAIL && (
        <EmailModal
          booking={modal?.items}
          open={modal?.open}
          handleClose={handleClose}
          isShowPaymentGuide={modal?.item?.paymentStatus && modal?.item?.paymentStatus != 'success'}
        />
      )}
      <ModalPolicies modal={modal} setModal={setModal} />
    </>
  );
};
export default ContentData;
