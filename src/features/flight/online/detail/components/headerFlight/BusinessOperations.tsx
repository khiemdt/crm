import { Button, message, Popover } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  EditItinerary,
  IconCash,
  IconCheckedTicket,
  IconEditNote,
  IconHoldTicket,
  IconSplitCode,
  IconSupportChat,
  IconUploadExcel,
  IconVarianProcess,
  IconVariantUser,
  IconVoidTicket,
} from '~/assets';
import { getLocationHref, MODAL_KEY_MENU } from '~/features/flight/constant';
import EditChangeAction from '~/features/flight/online/detail/components/modalDetailFlight/EditChangeAction';
import IssueTicket from '~/features/flight/online/detail/components/modalDetailFlight/IssueTicket';
import PaymentRequest from '~/features/flight/online/detail/components/modalDetailFlight/PaymentRequest';
import SplitCode from '~/features/flight/online/detail/components/modalDetailFlight/SplitCode';
import VoidTicket from '~/features/flight/online/detail/components/modalDetailFlight/VoidTicket';
import VoidTicketPnr from '~/features/flight/online/detail/components/modalDetailFlight/VoidTicketPnr';
import { some } from '~/utils/constants/constant';
import { isSameAirline } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
import ModalOriginTicket from '../detailBookingInfo/modal/ModalRebookTicket';
import ChangeCustomer from '../modalDetailFlight/ChangeCustomer';
import EditNoteToCustomer from '../modalDetailFlight/EditNoteToCustomer';
import ListCustomerUpload from '../modalDetailFlight/ListCustomerUpload';
import UpdateBookingPnr from '../modalDetailFlight/UpdateBookingPnr';
import UploadFileExcel from '../modalDetailFlight/UploadFileExcel';

export const itemsMenu = (dataItems: some) => {
  const { flightOnlineDetail, setModal } = dataItems;
  const isShowVoidTicket = !(
    flightOnlineDetail?.allowVoid &&
    (flightOnlineDetail?.outboundPnrStatus == 'holding' ||
      flightOnlineDetail?.inboundPnrStatus == 'holding' ||
      flightOnlineDetail?.outboundPnrStatus == 'confirmed' ||
      flightOnlineDetail?.inboundPnrStatus == 'confirmed')
  );

  const isIssueTicket =
    ((!flightOnlineDetail?.isTwoWay && flightOnlineDetail?.outboundPnrStatus != 'confirmed') ||
      (flightOnlineDetail?.isTwoWay &&
        (flightOnlineDetail?.outboundPnrStatus != 'confirmed' ||
          flightOnlineDetail?.inboundPnrStatus != 'confirmed'))) &&
    flightOnlineDetail.paymentStatus == 'success';
  const isReserveSeat =
    (!flightOnlineDetail?.isTwoWay && !flightOnlineDetail?.outboundPnrCode) ||
    (flightOnlineDetail?.isTwoWay &&
      (!flightOnlineDetail?.outboundPnrCode || !flightOnlineDetail?.inboundPnrCode) &&
      (flightOnlineDetail.paymentStatus != 'success' ||
        flightOnlineDetail.paymentStatus != 'holding'));

  const sameAirline = isSameAirline(flightOnlineDetail);

  return [
    {
      icon: <IconSplitCode />,
      name: 'Tách code',
      handelAction: () => {
        setModal({
          open: true,
          type: MODAL_KEY_MENU.SPLIT_CODE,
        });
      },
    },
    {
      icon: <IconVoidTicket />,
      hide: isShowVoidTicket,
      name: 'Void vé',
      handelAction: () => {
        setModal({
          open: true,
          type: MODAL_KEY_MENU.VOID_TICKET,
        });
      },
    },
    {
      icon: <IconVoidTicket />,
      hide: !flightOnlineDetail?.allowVoid,
      name: 'Void vé theo PNR',
      handelAction: () => {
        setModal({
          open: true,
          type: MODAL_KEY_MENU.VOID_TICKET_PNR,
        });
      },
    },
    {
      icon: <EditItinerary />,
      name: 'Sửa hành trình',
      handelAction: () => {
        setModal({
          open: true,
          type: MODAL_KEY_MENU.EDIT_CHANGE_ACTION,
        });
      },
    },
    {
      icon: <IconCheckedTicket />,
      hide: !isIssueTicket,
      name: 'Xuất vé',
      handelAction: () => {
        setModal({
          open: true,
          type: MODAL_KEY_MENU.ISSUE_TICKET,
        });
      },
    },
    {
      icon: <IconHoldTicket />,
      hide: !isReserveSeat,
      name: 'Giữ chỗ',
      handelAction: () => {
        setModal({
          open: true,
          type: MODAL_KEY_MENU.HOLD_TICKET,
        });
      },
    },
    {
      icon: <IconCash />,
      hide: flightOnlineDetail?.paymentStatus === 'SUCCESS',
      name: 'Yêu cầu thanh toán',
      class: 'item-border',
      handelAction: () => {
        setModal({
          open: true,
          type: MODAL_KEY_MENU.PAYMENT_REQUEST,
        });
      },
    },
    {
      icon: <IconSupportChat />,
      name: 'Tạo Tickets nhắc việc',
      handelAction: () => {
        window.open(
          getLocationHref() == 'dev'
            ? 'https://chat-dev.tripi.vn/'
            : 'https://chat-portal.vntravelgroup.com' +
                '/ticket/ticket-timer?paramKey=flightOnlineDetailId&value=F' +
                flightOnlineDetail?.id +
                '&displayName=Mã%20đơn&20hàng&link=' +
                encodeURIComponent(window.location.href),
          '_blank',
        );
      },
    },
    // {
    //   icon: <IconUploadExcel />,
    //   name: 'Tải lên mẫu thông tin hành khách',
    //   handelAction: () => {
    //     setModal({
    //       open: true,
    //       type: MODAL_KEY_MENU.UPLOAD_FILE,
    //     });
    //   },
    // },
    {
      icon: <IconEditNote />,
      name: 'Lưu ý cho khách hàng',
      class: 'item-border',
      handelAction: () => {
        setModal({
          open: true,
          type: MODAL_KEY_MENU.EDIT_NOTE,
        });
      },
    },
    {
      icon: <IconVarianProcess />,
      name: 'Cập nhật ĐH theo PNR',
      handelAction: () => {
        if (flightOnlineDetail.outboundPnrCode || flightOnlineDetail.inboundPnrCode) {
          if (!flightOnlineDetail.isTwoWay || sameAirline) {
            setModal({
              open: true,
              type: MODAL_KEY_MENU.UPDATE_BOOKING_PNR,
            });
          } else {
            setModal({
              open: true,
              type: MODAL_KEY_MENU.UPDATE_BOOKING_PNR_BEFORE,
            });
          }
        } else {
          message.error('Không thể thực hiện cập nhật đơn hàng chưa có PNR!');
        }
      },
    },
    {
      icon: <IconVariantUser />,
      name: 'Thay đổi khách hàng',
      handelAction: () => {
        setModal({
          open: true,
          type: MODAL_KEY_MENU.CHANGE_CUSTOMER,
          data: flightOnlineDetail,
        });
      },
    },
  ];
};

export const getModalActionMenu = (modalData: some) => {
  const { modal, handleCloseModal, setModal } = modalData;
  switch (modal?.type) {
    case MODAL_KEY_MENU.EDIT_CHANGE_ACTION:
      return <EditChangeAction open={modal?.open} handleClose={handleCloseModal} />;

    case MODAL_KEY_MENU.SPLIT_CODE:
      return <SplitCode open={modal?.open} handleClose={handleCloseModal} />;

    case MODAL_KEY_MENU.VOID_TICKET:
      return <VoidTicket open={modal?.open} handleClose={handleCloseModal} />;

    case MODAL_KEY_MENU.VOID_TICKET_PNR:
      return <VoidTicketPnr open={modal?.open} handleClose={handleCloseModal} />;

    case MODAL_KEY_MENU.PAYMENT_REQUEST:
      return <PaymentRequest open={modal?.open} handleClose={handleCloseModal} />;

    case MODAL_KEY_MENU.ISSUE_TICKET:
      return <IssueTicket open={modal?.open} handleClose={handleCloseModal} />;
    case MODAL_KEY_MENU.HOLD_TICKET:
      return <ModalOriginTicket modal={modal?.open} setModal={handleCloseModal} />;
    case MODAL_KEY_MENU.EDIT_NOTE:
      return <EditNoteToCustomer modal={modal?.open} setModal={handleCloseModal} />;
    // case MODAL_KEY_MENU.UPLOAD_FILE:
    //   return <UploadFileExcel modal={modal?.open} setModal={setModal} />;
    // case MODAL_KEY_MENU.UPLOAD_FILE_EXCEL:
    //   return <ListCustomerUpload data={modal?.data} modal={modal?.open} setModal={setModal} />;
    case MODAL_KEY_MENU.UPDATE_BOOKING_PNR:
      return (
        <UpdateBookingPnr
          data={modal?.data}
          type={MODAL_KEY_MENU.UPDATE_BOOKING_PNR}
          modal={modal?.open}
          setModal={setModal}
        />
      );
    case MODAL_KEY_MENU.UPDATE_BOOKING_PNR_BEFORE:
      return (
        <UpdateBookingPnr
          data={modal?.data}
          type={MODAL_KEY_MENU.UPDATE_BOOKING_PNR_BEFORE}
          modal={modal?.open}
          setModal={setModal}
        />
      );
    case MODAL_KEY_MENU.CHANGE_CUSTOMER:
      return <ChangeCustomer data={modal?.data} modal={modal?.open} setModal={setModal} />;
    default:
      break;
  }
};

const BusinessOperations = () => {
  const intl = useIntl();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [modal, setModal] = useState<some>({
    type: null,
    open: null,
    data: null,
  });

  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);

  const handleCloseModal = () => {
    setModal({
      ...modal,
      open: false,
    });
  };

  const handleMenuChange = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <div>
      <Popover
        zIndex={1}
        trigger='click'
        content={
          flightOnlineDetail?.lastSaleId && (
            <div className='wrapper-list-menu'>
              {itemsMenu({
                flightOnlineDetail,
                setModal,
                setOpenMenu,
              })?.map((item: some, index: number) => {
                if (item?.hide) return;
                return (
                  <div
                    key={index}
                    className={`item-menu ${item?.class}`}
                    onClick={item?.handelAction}
                  >
                    {item?.icon}
                    <span>{item?.name}</span>
                  </div>
                );
              })}
            </div>
          )
        }
        placement='bottomLeft'
      >
        <div>
          <Button type='primary' className='btn-receive-processing' onClick={handleMenuChange}>
            Thao tác nghiệp vụ
          </Button>
        </div>
      </Popover>
      {getModalActionMenu({
        modal,
        handleCloseModal,
        setModal,
      })}
    </div>
  );
};

export default BusinessOperations;
