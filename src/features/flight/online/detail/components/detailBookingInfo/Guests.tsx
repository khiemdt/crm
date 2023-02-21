import { EyeFilled } from '@ant-design/icons';
import { Button, Col, Divider, Row, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { IconInfomation } from '~/assets';
import { MODAL_KEY_MENU } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
import ListCustomerUpload from '../modalDetailFlight/ListCustomerUpload';
import UploadFileExcel from '../modalDetailFlight/UploadFileExcel';
import InfoGuestsModalNew from './InfoGuestsModalNew';

interface visibleInterface {
  type?: any;
  data?: any;
}

const Guests = () => {
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const [visibleModal, setVisibleModal] = useState<visibleInterface>({
    type: null,
    data: null,
  });

  const getMeatSeatFormatName = (guestId: string, isOutbound: boolean, title: string) => {
    const ancillary: any = booking.ancillaries.find((el: some) => el.departure == isOutbound);
    const result: any[] = ancillary?.items?.filter(
      (el: some) => el.ancillaryType == title && el.guestId == guestId,
    );
    if (isEmpty(result)) {
      return <></>;
    }
    return (
      <Space>
        <Tooltip
          title={
            <div className='value-col-list-eat'>
              {result.map((el, idx) => (
                <span className='item-eat' key={idx.toString()}>{`${
                  title == 'seat' ? '' : `${el.quantity}  ${el.title} -`
                } ${formatMoney(el?.price || 0)}`}</span>
              ))}
            </div>
          }
        >
          <span className='btn-info'>
            <span className='border-eticket-seat-meat'>
              {title == 'seat'
                ? result[0].title
                : `${result.reduce((a: number, b: some) => a + b.quantity, 0)} suất`}
            </span>
          </span>
        </Tooltip>
      </Space>
    );
  };

  return (
    <div className='guests'>
      <Space
        align='center'
        onClick={() =>
          setVisibleModal({
            type: MODAL_KEY_MENU.UPLOAD_DETAIL_GUESTS,
          })
        }
      >
        <h3>
          Hành khách:{' '}
          <span className='text-blue'>
            {booking?.numAdults} người lớn
            {booking?.numChildren > 0 && <span>, {booking?.numChildren} trẻ em</span>}
            {booking?.numInfants > 0 && <span>, {booking?.numInfants} em bé</span>}
          </span>
        </h3>
        <IconInfomation style={{ cursor: 'pointer' }} />
      </Space>
      <Row className='contact-info-box'>
        <Col span={24}>
          <table className='guest-table'>
            <tbody>
              <tr>
                <th></th>
                <th colSpan={3}>Họ và tên</th>
                <th colSpan={4}>Chiều đi</th>
                <th colSpan={4}>{!isEmpty(booking.inbound) && 'Chiều về'} </th>
                <td style={{ width: '100%' }}></td>
              </tr>
              {booking?.guests?.map((guest: any, idx: number) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <b>{guest?.fullName?.toUpperCase()} </b>
                    <br />
                    {guest?.ageCategory == 'infant' && (
                      <span className='text-grey'>
                        Đi cùng {booking?.guests[0].fullName?.toUpperCase()}{' '}
                      </span>
                    )}
                  </td>
                  <td>
                    {guest?.ageCategory == 'adult'
                      ? 'Người lớn'
                      : guest?.ageCategory == 'children'
                      ? 'Trẻ em'
                      : 'Em bé'}
                  </td>
                  <td>{guest?.gender === 'F' ? 'Nữ' : 'Nam'} </td>
                  <td style={{ paddingRight: guest?.outboundEticketNo ? '15px' : '0px' }}>
                    {guest?.outboundEticketNo && (
                      <span className='border-eticket-no'>{guest?.outboundEticketNo}</span>
                    )}
                  </td>
                  <td>
                    <Tooltip title={formatMoney(guest?.outboundBaggage?.price)}>
                      <span className='border-eticket-seat-meat'>
                        {guest?.outboundBaggage?.weight || 0} kg
                      </span>
                    </Tooltip>
                  </td>
                  <td>{getMeatSeatFormatName(guest.id, true, 'seat')}</td>
                  <td>{getMeatSeatFormatName(guest.id, true, 'meal')}</td>
                  <td style={{ paddingRight: guest?.inboundEticketNo ? '15px' : '0px' }}>
                    {guest?.inboundEticketNo && (
                      <span className='border-eticket-no'>{guest?.inboundEticketNo}</span>
                    )}
                  </td>
                  <td>
                    {!isEmpty(booking.inbound) && (
                      <Tooltip title={formatMoney(guest?.outboundBaggage?.price)}>
                        <span className='border-eticket-seat-meat'>
                          {guest?.inboundBaggage?.weight || 0} kg
                        </span>
                      </Tooltip>
                    )}
                  </td>
                  <td>{getMeatSeatFormatName(guest.id, false, 'seat')}</td>
                  <td>{getMeatSeatFormatName(guest.id, false, 'meal')}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>
      <InfoGuestsModalNew
        visibleModal={visibleModal.type == MODAL_KEY_MENU.UPLOAD_DETAIL_GUESTS}
        setVisibleModal={setVisibleModal}
      />
      <UploadFileExcel
        visibleModal={visibleModal.type == MODAL_KEY_MENU.UPLOAD_FILE}
        setVisibleModal={setVisibleModal}
      />
      <ListCustomerUpload visibleModal={visibleModal} setVisibleModal={setVisibleModal} />
    </div>
  );
};
export default Guests;
