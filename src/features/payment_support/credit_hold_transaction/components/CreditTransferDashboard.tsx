import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, message, Row, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { approveCreditHold } from '~/apis/paymentSupport';
import { IconCheckGreen, IconRefreshGrayrice, IconRejectRed } from '~/assets';
import PaginationTable from '~/components/pagination/PaginationTable';
import { DEFAULT_PAGING, SUCCESS_CODE } from '~/features/flight/constant';
import ConfirmModal from '~/features/flight/offline/components/ConfirmModal';
import { some } from '~/utils/constants/constant';
import { DATE_FORMAT } from '~/utils/constants/moment';
import { formatMoney, isEmpty, removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { ListPaymentStatusCreditHold } from '../../constant';

import { fetGetHoldingCredit } from '../../PaymentSlice';
import UnholdCreditModal from './UnholdCreditModal';

interface IFlightRefundDashboardProps {}

interface Props {
  type?: string;
  item?: any;
  title?: string;
}

const CreditTransferDashboard: React.FunctionComponent<IFlightRefundDashboardProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<some>({});
  const navigate = useNavigate();

  const { flightRefundTotal, flightFilter, flightRefundPaging, flightRefundBookings }: some =
    useAppSelector((state) => state.bankTransferReducer);
  const dispatch = useAppDispatch();

  const creditPaymentName = (stt: string) => {
    const result = ListPaymentStatusCreditHold.find((el: any) => el.id === stt);
    return result;
  };

  const spToolsItem = () => {
    return [
      {
        key: '1',
        label: 'Danh sách credit đang hold',
        icon: <SearchOutlined />,
        onClick: () => {
          setModal({
            open: false,
            value: null,
            type: 'unhold',
            title: 'Danh sách credit đang hold',
          });
        },
      },
    ];
  };
  const handleCloseModal = () => {
    setModal({
      open: false,
      bookingId: undefined,
    });
  };

  const formatModalType = (value: string) => {
    switch (value) {
      case 'reject':
      case 'FAILED':
        return 'Từ chối';
      case 'confirm':
      case 'SUCCESS':
        return 'Xác nhận';
      default:
        return 'Từ chối';
    }
  };

  const columns: ColumnsType<some> = [
    {
      title: 'STT',
      key: 'caInfo',
      render: (_, record, indx) => {
        return <div>{indx + 1}</div>;
      },
    },
    {
      title: 'CA',
      key: 'caInfo',
      render: (_, record) => {
        return <div>{record?.caInfo?.name}</div>;
      },
    },
    {
      title: 'Mã đơn hàng',
      key: 'bookingId',
      dataIndex: 'bookingId',
      render: (text, record) => {
        return (
          <div>
            <a className='text-blue' href={`/sale/flight/online/${text}`} target='_blank'>
              {text}
            </a>{' '}
            <br /> <span className='text-grey'>{`(${record.id})`}</span>
          </div>
        );
      },
    },
    {
      title: 'Thời gian phát sinh',
      key: 'createdTime',
      dataIndex: 'createdTime',
      render: (text) => {
        return <div>{moment(text).format(DATE_FORMAT)}</div>;
      },
    },
    {
      title: 'Loại phát sinh',
      key: 'additionType',
      dataIndex: 'additionType',
    },
    {
      title: 'Người xử lý',
      key: 'handlerInfo',
      dataIndex: 'handlerInfo',
      render: (text) => {
        return <div>{text?.fullName}</div>;
      },
    },
    {
      title: 'Số tiền thu khách',
      key: 'finalAmount',
      dataIndex: 'finalAmount',
      render: (text) => {
        return <div>{formatMoney(text)}</div>;
      },
      align: 'right',
    },
    {
      title: 'Trạng thái',
      key: 'paymentStatus',
      dataIndex: 'paymentStatus',
      render: (text) => {
        return <Tag color={creditPaymentName(text)?.color}>{creditPaymentName(text)?.name}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'paymentStatus',
      render: (text, record) => {
        return (
          <>
            {(record.paymentStatus == 'awaiting-payment' || record.paymentStatus == 'holding') && (
              <Space>
                <IconRejectRed
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal({
                      open: !modal.open,
                      value: record,
                      type: record.paymentStatus == 'holding' ? 'FAILED' : 'reject',
                    });
                  }}
                />
                <IconCheckGreen
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal({
                      open: !modal.open,
                      value: record,
                      type: record.paymentStatus == 'holding' ? 'SUCCESS' : 'confirm',
                    });
                  }}
                />
              </Space>
            )}
          </>
        );
      },
    },
  ];

  const handelRefresh = () => {
    dispatch(
      fetGetHoldingCredit({
        formData: flightFilter,
        isFilter: false,
        ...flightRefundPaging,
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

  const onChangePagination = (page: number, pageSize: number) => {
    handleChangeRoute(flightFilter, { page, pageSize: pageSize });
    dispatch(
      fetGetHoldingCredit({
        formData: flightFilter,
        isFilter: false,
        paging: {
          page,
          pageSize,
        },
        flightRefundTotal,
      }),
    );
  };

  const handleApproveOrDeleteBooking = async (value: some, type: string) => {
    try {
      setLoading(true);
      const { data } = await approveCreditHold({
        id: value?.id,
        type: type,
        amount: value?.finalAmount,
        status: type,
      });
      if (data.code === SUCCESS_CODE) {
        message.success(`${formatModalType(type)} thành công`);
        handleCloseModal();
        dispatch(
          fetGetHoldingCredit({
            formData: flightFilter,
            isFilter: false,
            paging: flightRefundPaging,
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
      <Row className='fl-approval-total-title' style={{ justifyContent: 'space-between' }}>
        <Col>
          <Space align='center'>
            <FormattedMessage
              id='IDS_TEXT_BOOKING_TOTAL_TITLE_TRANS'
              values={{ value: flightRefundTotal }}
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
        loading={loading}
        pagination={false}
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
      <ConfirmModal
        title={`${formatModalType(modal.type)} đơn hàng`}
        open={modal.open}
        onClose={handleCloseModal}
        onAccept={() => handleApproveOrDeleteBooking(modal.value, modal.type)}
        loading={loading}
      >
        <span>{`Bạn có chắc chắn muốn ${formatModalType(modal.type)} đơn hàng này?`}</span>
      </ConfirmModal>
      <UnholdCreditModal modal={modal} setModal={setModal} />
    </>
  );
};

export default CreditTransferDashboard;
