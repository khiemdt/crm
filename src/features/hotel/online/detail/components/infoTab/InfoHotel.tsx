import { Button, Col, Collapse, Divider, Input, message, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { getContactHotelCrm, getProviderInfoInBooking } from '~/apis/hotel';
import { IconCancelPolice, IconDownArrow, IconInfomation, IconLocation } from '~/assets';
import { some } from '~/utils/constants/constant';
import { isEmpty, stringSlug } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
import ModalPolicies from '../../../components/ModalPolicies';
import DetailRoomInfo from './DetailRoomInfo';

const { Panel } = Collapse;

const InfoHotel = () => {
  const [provider, setProvider] = useState<some>({});
  const [contactHotel, setContactHotel] = useState('');
  const [className, setClassName] = useState(false);
  const [modal, setModal] = useState<some>({
    type: undefined,
    open: false,
    item: {},
  });

  const booking = useAppSelector((state) => state.hotelReducer.hotelOnlineDetail);
  const getProvider = async () => {
    const queryParams = {
      agencyId: booking.agencyId,
      hotelId: booking.hotelId,
    };
    try {
      const { data } = await getProviderInfoInBooking(queryParams);
      if (data.code === 200) {
        setProvider(data?.data);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getContact = async () => {
    const queryParams = {
      rootHotelId: booking.hotelId,
    };
    try {
      const { data } = await getContactHotelCrm(queryParams);
      if (data.code === 200) {
        setContactHotel(data?.data?.note);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const providerBookingInfo = [
    {
      name: 'NCC Khách sạn:',
      value: () => {
        return (
          <>
            <span>{provider?.providerName || 'Không có dữ liệu'} </span>
            <IconInfomation style={{ cursor: 'pointer' }} />
          </>
        );
      },
    },
    {
      name: 'Mã số thuế:',
      value: () => {
        return <span>{provider?.taxCode || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Người đại diện:',
      value: () => {
        return <span>{provider?.deputyName || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Số điện thoại:',
      value: () => {
        return <span className='text-main'>{provider?.phone || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Email:',
      value: () => {
        return (
          <a href='mailto:{{provider.email}}' className='text-main'>
            {provider?.email || 'Không có dữ liệu'}
          </a>
        );
      },
    },
    {
      name: 'Loại khách sạn:',
      value: () => {
        return <span>{booking?.hotelSubCategory || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Số tài khoản:',
      value: () => {
        return <span>{provider?.accountNumber || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Tên tài khoản:',
      value: () => {
        return <span>{provider?.beneficiary || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Ngân hàng:',
      value: () => {
        return <span>{provider?.bank?.name || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Chi nhánh:',
      value: () => {
        return <span>{provider?.bankBranch?.name || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Hợp đồng:',
      value: () => {
        return provider?.contractRSList?.length ? (
          <span className='text-main'>
            {provider?.contractRSList.map((el: any, index: number) => (
              <span key={index}>Hợp đồng {index + 1} | </span>
            ))}
          </span>
        ) : (
          <span></span>
        );
      },
    },
  ];
  const customerBookInfo = [
    {
      name: 'Booking confirmation ID:',
      value: () => {
        return (
          <>
            <span>{booking?.affiliateReferenceId || 'Không có dữ liệu'} </span>
          </>
        );
      },
    },
    {
      name: 'Người đặt phòng:',
      value: () => {
        return <span>{booking?.customerName || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Email:',
      value: () => {
        return <span>{booking?.customerEmail || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Số điện thoại:',
      value: () => {
        return <span>{booking?.customerPhone || 'Không có dữ liệu'}</span>;
      },
    },
  ];
  const dateInfo = [
    {
      name: 'Ngày nhận phòng:',
      value: () => {
        return (
          <>
            <span>{booking?.checkIn || 'Không có dữ liệu'} </span>
          </>
        );
      },
    },
    {
      name: 'Ngày trả phòng:',
      value: () => {
        return <span>{booking?.checkOut || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Số lượng phòng:',
      value: () => {
        return <span>{booking?.rooms?.length || 'Không có dữ liệu'}</span>;
      },
    },
    {
      name: 'Đêm lưu trú:',
      value: () => {
        return <span>{booking?.numNights || 'Không có dữ liệu'}</span>;
      },
    },
  ];

  useEffect(() => {
    if (!isEmpty(booking)) {
      getProvider();
      getContact();
    }
  }, [location.pathname, booking]);
  return (
    <Row className='info-hotel'>
      <Col span={8} style={{ borderRight: '2px solid #FFFFFF' }}>
        <div style={{ borderBottom: '2px solid #FFFFFF', padding: 16 }}>
          <Space
            className='text-main pointer'
            align='center'
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (booking.caInfo.id !== 17) {
                window.open(
                  `${import.meta.env.VITE_PUBLIC_DOMAIN_WEB_TRIPI}/hotel/detail?hotelId=${
                    booking.hotelId
                  }&checkIn=${booking.checkinDate}&checkOut=${booking.checkoutDate}&roomCount=${
                    booking.numRooms
                  }&adultCount=${booking.numAdults}&childCount=${booking.numChildren}`,
                  '_blank',
                );
              } else {
                window.open(
                  `${import.meta.env.VITE_PUBLIC_DOMAIN_WEB_MYTOUR}/khach-san/${
                    booking.hotelId
                  }-${stringSlug(booking.hotelName)}.html?checkIn=${booking.checkinDate}&checkOut=${
                    booking.checkoutDate
                  }&rooms=${booking.numRooms}&adults=${booking.numAdults}&children=${
                    booking.numChildren
                  }`,
                  '_blank',
                );
              }
            }}
          >
            <span className='title-detail name-hotel'>{booking.hotelName} </span>
            <span>- h{booking.id} </span>
          </Space>
          <Space align='center'>
            <IconLocation style={{ height: '23px' }} />
            <span>{booking.hotelAddress}</span>
          </Space>
        </div>
        <div style={{ padding: '12px 16px' }}>
          {providerBookingInfo.map((info, indx) => (
            <div className='item-box-provider' key={indx}>
              <span className='title'>{info.name} </span>
              <info.value />
            </div>
          ))}
        </div>
      </Col>
      <Col span={16} style={{ padding: 16 }}>
        <div>
          <Row>
            <Col span={12}>
              <span className='title-detail name-hotel'>Thông tin đặt phòng </span>
              {customerBookInfo.map((info, indx) => (
                <div className='item-box-provider ' key={indx}>
                  <span className='titel-long'>{info.name} </span>
                  <info.value />
                </div>
              ))}
            </Col>
            <Col span={12}>
              {booking.paymentStatus === 'waiting' ||
                (booking.paymentStatus === 'awaiting-payment' && booking.expiredTime && (
                  <div className='expiredTime-box'>
                    <Input value={'Hạn giữ chỗ: ' + booking.expiredTime} />
                    <Button type='primary'>Sửa</Button>
                  </div>
                ))}
              {dateInfo.map((info, indx) => (
                <div className='item-box-provider' key={indx}>
                  <span className='titel-long'>{info.name} </span>
                  <info.value />
                </div>
              ))}
            </Col>
          </Row>
          <div>
            <Row style={{ padding: '10px 0px' }}>
              <Space
                align='center'
                className='pointer'
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setModal({
                    type: 'MODAL_KEY_POLICIES',
                    open: false,
                    item: booking,
                  });
                }}
              >
                <IconCancelPolice />
                <span className='text-main'>Chính sách hoàn hủy</span>
              </Space>
            </Row>
            {contactHotel && (
              <div className='note-internal-box'>
                <p className='sub-title-hotel'>Ghi chú nội bộ</p>
                {contactHotel.length > 100 && (
                  <IconDownArrow
                    className='position-note-internal pointer'
                    onClick={(event) => {
                      setClassName(!className);
                    }}
                  />
                )}
                <span
                  style={{ wordBreak: 'break-word' }}
                  className={!className ? 'name-hotel' : ''}
                >
                  {contactHotel}
                </span>
              </div>
            )}
            <div
              style={{ borderTop: '0.5px solid #D9DBDC', padding: '5px 0px', marginTop: '12px' }}
            >
              <span className='title-detail name-hotel'>Chi tiết phòng </span>
              <div className='collapse-rooms'>
                <Collapse
                  expandIconPosition='end'
                  bordered={false}
                  defaultActiveKey={['0']}
                  accordion
                >
                  {booking?.rooms?.map((el: some, index: number) => (
                    <Panel header={`Phòng ${index + 1} ` + el.name} key={index}>
                      <Divider style={{ margin: 0, borderTop: '1px solid #FFF' }} />
                      <DetailRoomInfo data={el} />
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <ModalPolicies modal={modal} setModal={setModal} />
    </Row>
  );
};
export default InfoHotel;
