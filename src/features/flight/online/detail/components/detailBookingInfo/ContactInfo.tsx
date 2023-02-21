import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  message,
  Modal,
  Popconfirm,
  Row,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { clearPromotionCode, editHoldingTimeFlight } from '~/apis/flight';
import {
  IconCallDark,
  IconCloseDark,
  IconCloseOutline,
  IconEdit,
  IconEditPrice,
  IconEmail,
  IconInfomation,
  IconLocation,
  IconMonitor,
} from '~/assets';
import { MODAL_CONTACT_INFO } from '~/features/flight/constant';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import EditBooker from '~/features/flight/online/detail/components/modalDetailFlight/EditBooker';
import ListTransfers from '~/features/flight/online/detail/components/modalDetailFlight/ListTransfers';
import { some } from '~/utils/constants/constant';
import { DATE_FORMAT_TIME, DATE_FORMAT_TIME_BACK_END } from '~/utils/constants/moment';
import {
  formatMoney,
  getBookStatusFlight,
  getPaymentStatusFlight,
  getPnrStatus,
  getStatusFlight,
  isEmpty,
  isHandling,
  isSameAirline,
} from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import InfoGuestsModalNew from './InfoGuestsModalNew';
import ModalOriginTicket from './modal/ModalOriginTicket';
import ModalUpdateFlightPNRCode from './modal/ModalUpdateFlightPNRCode';
import PopoverInfo from './popover/PopoverInfo';
import PopoverPriceInfo from './popover/PopoverPriceInfo';

const getModalContactInfo = (dataModal: some) => {
  switch (dataModal?.key) {
    case MODAL_CONTACT_INFO.EDIT_BOOKER:
      return <EditBooker handleClose={dataModal?.handleCloseModal} booking={dataModal?.booking} />;

    case MODAL_CONTACT_INFO.LIST_TRANSFERS:
      return (
        <ListTransfers
          handleClose={dataModal?.handleCloseModal}
          bankTransferRequest={dataModal?.booking?.bankTransferRequestInfo}
        />
      );

    default:
      break;
  }
};

const ContactInfo = () => {
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const [updateFlightPNRCode, setUpdateFlightPNRCode] = useState<string>('');
  const userInfo: some = useAppSelector((state) => state?.systemReducer?.userInfo);
  const dispatch = useAppDispatch();
  const isHandLing = isHandling(booking, userInfo);
  const [form] = Form.useForm();
  const intl = useIntl();

  const [modal, setModal] = useState<some>({
    open: false,
    type: null,
    title: null,
  });
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalOriginTicket, setModalOriginTicket] = useState<boolean>(false);
  const isDataForm = isEmpty(form.getFieldsValue(true));
  const [isEditHoldingTime, setIsEditHoldingTime] = useState<boolean>(true);
  const editHoldingTime = async (values: some = {}) => {
    const queryParams = { ...values, holdingTime: values.holdingTime.format(DATE_FORMAT_TIME) };
    try {
      const { data } = await editHoldingTimeFlight(queryParams);
      if (data.code === 200) {
        message.success('Gia hạn thanh toán thành công!');
        setIsEditHoldingTime(!isEditHoldingTime);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const listPriceDetail = [
    {
      name: 'Thay đổi giá chiều đi',
      value: `${formatMoney(booking?.outbound?.channelMarkup)}`,
      isShow: true,
    },
    {
      name: 'Thay đổi giá chiều về',
      value: `${formatMoney(booking?.inbound?.channelMarkup)}`,
      isShow: true,
    },
    {
      name: 'Trip Point thanh toán',
      value: booking?.paidPoint + ' điểm - ' + `${formatMoney(booking?.pointAmount)}`,
      isShow: booking?.paidPoint,
    },
    {
      name: 'Trip Point được hoàn',
      value: booking?.refundPoint + ' điểm - ' + `${formatMoney(booking?.refundPointAmount)}`,
      isShow: booking?.refundPoint,
    },
    {
      name: 'Chiết khấu',
      value: `${formatMoney(booking?.promotionInfo?.discount)}`,
      isShow: booking?.promotionInfo?.discount,
    },
    {
      name: 'Tiền hoa hồng cho đối tác',
      value: `${formatMoney(booking?.channelCommission)}`,
      isShow: booking?.channelCommission,
    },
    {
      name: 'Phí xuất vé NCC',
      value: `${
        booking?.inbound
          ? formatMoney(booking?.outbound?.agencyFee + booking?.inbound?.agencyFee)
          : formatMoney(booking?.outbound?.agencyFee)
      }`,
      isShow: booking?.outbound?.agencyFee,
    },
    {
      name: 'Mã khuyến mãi',
      value: booking?.promotionCode,
      element: () => {
        return isShowDeleteCode() ? (
          <Popconfirm
            placement='top'
            title='Bạn có chắc chắn muốn xóa mã khuyến mãi?'
            onConfirm={() => {
              removePromotionCode({
                bookingId: booking.id,
                module: 'flight',
              });
            }}
            okText='Ok'
            cancelText='Hủy'
          >
            <a>
              <IconCloseDark />
            </a>
          </Popconfirm>
        ) : (
          <span></span>
        );
      },
      isShow: true,
    },
    {
      name: 'Phí thanh toán',
      value: `${formatMoney(booking?.paymentMethodFee)}`,
      divider: true,
      isShow: true,
    },
    {
      name: 'Tổng tiền',
      value: `${formatMoney(booking?.totalSellingPrice)} `,
      element: () => {
        return (
          <span className='text-grey'>{`(Đơn gốc: ${formatMoney(booking?.grandTotal)})`}</span>
        );
      },
      isShow: true,
    },
    {
      name: 'Tiền thanh toán',
      value: `${formatMoney(booking?.totalPayInCash)}`,
      element: () => {
        return (
          <span className='text-grey'>{`(Đơn gốc: ${formatMoney(booking?.finalPrice)})`}</span>
        );
      },
      isShow: true,
    },
    {
      name: 'Điểm được cộng',
      value: `${booking?.bonusPoint} điểm`,
      isShow: booking?.bonusPoint,
    },
  ];

  const bookerInfo = [
    {
      name: 'ID',
      value: booking?.userInfo?.id,
    },
    {
      name: 'Tên',
      value: booking?.userInfo?.name,
    },
    {
      name: 'Email',
      value: booking?.userInfo?.email,
      class: 'text-blue',
    },
    {
      name: 'Số điện thoại',
      value: booking?.userInfo?.phone,
    },
    {
      name: 'Số dư tài khoản',
      value: booking?.paymentUserInfo?.credit
        ? formatMoney(booking?.paymentUserInfo?.credit)
        : formatMoney(booking?.userInfo?.credit),
    },
    {
      name: 'Hiện trạng tài khoản',
      value: booking?.userInfo?.enableCredit ? 'Đang mở' : 'Đang đóng',
    },
    {
      name: 'Booker',
      value: booking?.userInfo?.isBooker ? 'Yes' : 'No',
    },
    {
      name: 'Thông tin hỗ trợ',
      value: booking?.userInfo?.supporterInfo,
    },
    {
      name: 'Chủ đại lý',
      value: booking?.paymentUserInfo
        ? ` ${booking?.paymentUserInfo?.name} (ID: ${booking?.paymentUserInfo?.id})`
        : null,
    },
  ];
  const paymentData = [
    {
      name: 'Trạng thái đơn hàng',
      value: () => {
        return (
          <span
            className='border-status'
            style={{ backgroundColor: status?.backGround, color: status?.color }}
          >
            {status?.detailTitle}
          </span>
        );
      },
    },
    {
      name: 'Trạng thái đặt vé',
      value: () => {
        return (
          <span
            className='border-status'
            style={{ backgroundColor: bookStatus?.backGround, color: bookStatus?.color }}
          >
            {bookStatus?.detailTitle}
          </span>
        );
      },
    },
    {
      name: 'Trạng thái thanh toán ',
      value: () => {
        return (
          <span
            className='border-status'
            style={{ backgroundColor: paymentStatus?.backGround, color: paymentStatus?.color }}
          >
            {paymentStatus?.detailTitle}
          </span>
        );
      },
    },
    {
      name: 'Phương thức thanh toán ',
      value: () => {
        return (
          <div>
            <span
              className='text-payment-method'
              style={{
                cursor: booking?.bankTransferRequestInfo ? 'pointer' : undefined,
              }}
              onClick={handlePaymentMethod}
            >
              {booking?.paymentMethod}
              {booking?.bankTransferRequestInfo?.isManually && ' (Thủ công)'}
              {booking?.purchaseType !== 'personal' && booking?.purchaseType && (
                <span className='text-success'>{` ( ${booking?.purchaseType} )`} </span>
              )}
            </span>
          </div>
        );
      },
    },
    {
      name: 'Đơn vị tiền tệ',
      value: () => {
        return <span>VNĐ</span>;
      },
    },
    {
      name: 'Ngày thanh toán',
      value: () => {
        return <span>{booking?.paymentDate} </span>;
      },
      hide: !booking?.paymentDate,
    },
    {
      name: 'Hạn thanh toán',
      value: () => {
        return (
          <div>
            <Form
              form={form}
              scrollToFirstError
              colon={false}
              style={{ display: 'flex' }}
              initialValues={{
                holdingTime: moment(booking?.expiredTime, 'DD/MM/YYYY HH:mm'),
                bookingId: booking.id,
              }}
              onFinish={editHoldingTime}
            >
              <Form.Item name='bookingId' style={{ display: 'none' }}>
                <></>
              </Form.Item>
              <Form.Item
                name='holdingTime'
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                ]}
                style={{ marginBottom: 0 }}
              >
                <DatePicker
                  status='error'
                  disabled={isEditHoldingTime}
                  allowClear
                  format={DATE_FORMAT_TIME_BACK_END}
                  showTime
                  className='holding-time-alert'
                  size='small'
                  suffixIcon={null}
                  onSelect={(value) => {
                    form.setFieldsValue({
                      holdingTime: value,
                    });
                  }}
                />
              </Form.Item>
              {isHandLing && (
                <>
                  {isEditHoldingTime ? (
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button
                        className='btn-action btn-unset'
                        onClick={() => setIsEditHoldingTime(!isEditHoldingTime)}
                        size='small'
                        icon={<IconEdit />}
                      ></Button>
                    </Form.Item>
                  ) : (
                    <>
                      <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                        {() => (
                          <Button
                            className='btn-action btn-unset'
                            size='small'
                            htmlType='submit'
                            disabled={isDataForm}
                          >
                            Lưu
                          </Button>
                        )}
                      </Form.Item>
                      <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                          className=' btn-unset'
                          size='small'
                          onClick={() => {
                            form.resetFields();
                            setIsEditHoldingTime(!isEditHoldingTime);
                          }}
                          disabled={isDataForm}
                        >
                          Hủy
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </>
              )}
            </Form>
          </div>
        );
      },
      hide: !booking?.expiredTime,
    },
  ];
  const priceBox = [
    {
      name: 'Ngày đặt',
      value: () => {
        return <span>{booking?.bookedDate} </span>;
      },
      hide: !booking?.bookedDate,
    },
    {
      name: 'Số chỗ',
      value: () => {
        return (
          <span>
            {booking?.numAdults} người lớn
            {booking?.numChildren > 0 && <span>, {booking?.numChildren} trẻ em</span>}
            {booking?.numInfants > 0 && <span>, {booking?.numInfants} em bé</span>}
          </span>
        );
      },
      hide: !booking?.bookedDate,
      isDivider: true,
    },
    {
      name: 'Giá trả hãng',
      value: () => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'inline-block' }}>
              <span style={{ fontWeight: 500 }}>
                {`${formatMoney(
                  (booking?.ticket?.outbound?.totalNetPrice || 0) +
                    (booking?.ticket?.inbound?.totalNetPrice || 0),
                )} `}
              </span>
            </div>
            {isHandLing && (
              <IconEditPrice
                onClick={(event) => {
                  event.stopPropagation();
                  setModalOriginTicket(true);
                }}
                style={{ marginLeft: 4, cursor: 'pointer' }}
              />
            )}
          </div>
        );
      },
    },
    {
      name: 'Tổng tiền',
      value: () => {
        return (
          <PopoverPriceInfo
            children={
              <span className='text-blue' style={{ fontWeight: 'bold' }}>
                {formatMoney(booking?.totalSellingPrice)}
              </span>
            }
            title='Chi tiết thanh toán'
            content={listPriceDetail.filter((el) => el?.isShow)}
          />
        );
      },
    },
    {
      name: 'Tiền thanh toán',
      value: () => {
        return (
          <span className='text-danger' style={{ fontWeight: 'bold' }}>
            {formatMoney(booking?.totalPayInCash)}
          </span>
        );
      },
    },
    {
      name: 'Tổng tiền chuyển khoản',
      value: () => {
        return <span>{formatMoney(booking?.bankTransferRequestInfo?.transferredAmount)}</span>;
      },
      hide: !booking?.bankTransferRequestInfo?.transferredAmount,
    },
  ];
  const paymentStatus = getPaymentStatusFlight(booking?.paymentStatus);
  const bookStatus = getBookStatusFlight(booking?.bookStatus);
  const status = getStatusFlight(booking?.status);
  const outboundPnrStatus = getPnrStatus(booking?.outboundPnrStatus);
  const inboundPnrStatus = getPnrStatus(booking?.inboundPnrStatus);
  const sameAirline = isSameAirline(booking);

  const handleCloseModal = () => {
    setModal({
      ...modal,
      open: !modal?.open,
    });
  };

  const isShowDeleteCode = () => {
    if (!booking?.promotionCode) return false;
    const expiredTime = moment(booking?.promotionInfo?.expiredTime);
    if (booking?.promotionInfo?.status == 'pending' && expiredTime.isAfter(moment())) {
      return true;
    }
    return false;
  };

  const removePromotionCode = async (queryParams = {}) => {
    try {
      const { data } = await clearPromotionCode(queryParams);
      if (data.code === 200) {
        message.success(data?.message);
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentMethod = () => {
    if (booking?.bankTransferRequestInfo) {
      setModal({
        type: MODAL_CONTACT_INFO.LIST_TRANSFERS,
        title: 'Danh sách chuyển khoản',
        open: true,
      });
    }
  };

  return (
    <div className='contact-info'>
      <Row gutter={20} className='contact-info-box'>
        <Col xxl={8} xl={12}>
          {/* {!isEmpty(booking?.userInfo) && (
            <>
              <div className='main-contact-info'>
                <span className='text-bold'>Người đặt:</span>
                <span>{`${booking?.userInfo?.name} (${booking?.userInfo?.id})`}</span>
                <PopoverInfo
                  children={<IconInfomation style={{ cursor: 'pointer' }} />}
                  title='Thông tin người đặt'
                  content={bookerInfo}
                />
              </div>
              <div className='main-contact-info' style={{ gap: 8 }}>
                <div className='gap-4-center'>
                  <IconCallDark />
                  {booking?.userInfo?.phone}
                </div>
                <div className='gap-4-center'>
                  <IconEmail className='fix-width' />
                  {booking?.userInfo?.email}
                </div>
              </div>
            </>
          )} */}
       
          <div className='main-contact-info'>
            <span className='text-bold'>Người liên hệ:</span>
            <span>{`${booking?.mainContact?.fullName} `}</span>
            {booking?.handlingStatus == 'handling' &&
              (booking?.bookStatus == 'success' || booking?.bookStatus == 'confirmed') &&
              booking?.lastSaleId === userInfo?.id && (
                <IconEdit
                  onClick={() => {
                    setModal({
                      open: true,
                      type: MODAL_CONTACT_INFO.EDIT_BOOKER,
                      title: 'Sửa thông tin liên hệ',
                    });
                  }}
                  style={{ cursor: 'pointer' }}
                />
              )}
          </div>
          <div className='main-contact-info' style={{ gap: 8 }}>
            <div className='gap-4-center'>
              <IconCallDark /> {booking?.mainContact?.phone1}
            </div>
            <div className='gap-4-center'>
              <IconEmail className='fix-width' />
              {booking?.mainContact?.email}
            </div>
          </div>
          {booking?.mainContact?.addr1 && (
            <div className='main-contact-info'>
              <Tooltip title={booking.mainContact?.addr1} className='tooltip-customer'>
                <IconLocation />
                <span className='hide-device'>{booking?.mainContact?.addr1}</span>
              </Tooltip>
            </div>
          )}
          {booking?.deviceInfo && (
            <div className='main-contact-info'>
              <Tooltip title={booking.deviceInfo} className='tooltip-customer'>
                <IconMonitor />
                <span className='hide-device'>{booking.deviceInfo}</span>
              </Tooltip>
            </div>
          )}
        </Col>
        <Col xxl={8} xl={12}>
          {paymentData?.map(
            (el: any, indx: number) =>
              !el.hide && (
                <Row key={indx} className='payment-data-ct-content'>
                  <span className='name'>{el.name}:</span>
                  <el.value />
                </Row>
              ),
          )}
        </Col>
        <Col xxl={8} xl={24}>
          <div className='booker-box'>
            {priceBox.map(
              (el: any, indx: number) =>
                !el.hide && (
                  <Row key={indx} className={`${el.class} booker-box-info`}>
                    <span className='name'>{el.name}:</span>
                    <el.value />
                    {el.isDivider && <Divider style={{ margin: '0px' }} />}
                  </Row>
                ),
            )}
          </div>
        </Col>
      </Row>
      <ModalUpdateFlightPNRCode
        sameAirline={sameAirline}
        modal={updateFlightPNRCode}
        setModal={setUpdateFlightPNRCode}
      />
      <Modal
        className='wrapper-modal'
        title={<div className='title-modal'>{modal?.title}</div>}
        visible={modal?.open}
        footer={false}
        closeIcon={<IconCloseOutline />}
        onCancel={handleCloseModal}
        width={modal?.type === MODAL_CONTACT_INFO.LIST_TRANSFERS ? 796 : undefined}
      >
        {getModalContactInfo({
          key: modal?.type,
          handleCloseModal,
          booking,
        })}
      </Modal>
      <InfoGuestsModalNew visibleModal={visibleModal} setVisibleModal={setVisibleModal} />
      <ModalOriginTicket modal={modalOriginTicket} setModal={setModalOriginTicket} />
    </div>
  );
};
export default ContactInfo;
