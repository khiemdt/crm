import { Col, Popover, Row } from 'antd';
import { FC, useState } from 'react';
import { IconCloseOutline, IconInfoHover } from '~/assets';
import { TASK_TYPES } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';

interface InOutBoundType {
  title: string;
  content: some;
  children: any;
}

const PopoverFlightTask: FC<InOutBoundType> = (props: some) => {
  const { title, content, children } = props;

  const listChangeItinerary = [
    {
      name: 'Phí thay đổi',
      value: content?.itineraryChangingFeeFormatted,
    },
    {
      name: 'Giá vé chênh',
      value: content?.ticketChangeAmountFormatted,
    },
    {
      name: 'Chi tiết',
      value: content?.changingDetail,
    },
  ];
  const [visible, setVisible] = useState(false);
  const hide = () => {
    setVisible(false);
  };
  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };
  const items = (
    <>
      <div className='popover-ct-info'>
        <Row className='popover-ct-title'>
          <b>{title}</b>
          <IconCloseOutline onClick={hide} style={{ cursor: 'pointer' }} />
        </Row>
        <div>
          <Row style={{ paddingBottom: 10 }}>
            <Col span={12} className='text-grey'>
              {` Id: ${content.id} - Order : ${content.orderId}`}
            </Col>
          </Row>
          {content.type == TASK_TYPES.ADD_BAGGAGE && (
            <>
              {content.baggageChangeInfo?.map((el: some, indx: number) => (
                <div key={indx}>
                  <Row style={{ paddingBottom: 10 }}>
                    <Col span={12} className='text-grey'>
                      Hành khách:
                    </Col>
                    <Col span={12}>{el.guestName}</Col>
                  </Row>
                  <Row>
                    {!isEmpty(el.toOutboundBaggage) && (
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <Row>
                          <Col span={12} className='text-grey'>
                            Nâng chiều đi:
                          </Col>
                          <Col span={12}>{`${el.fromOutboundBaggage?.weight || 0}kg`}</Col>
                        </Row>
                        <Row>
                          <Col span={12} className='text-grey'>
                            Lên:
                          </Col>
                          <Col span={12}>{`${el.toOutboundBaggage?.weight || 0}kg`}</Col>
                        </Row>
                        <Row>
                          <Col span={12} className='text-grey'>
                            Chi phí thêm:
                          </Col>
                          <Col span={12}>{`${formatMoney(el.outboundAmount)}`}</Col>
                        </Row>
                      </div>
                    )}
                    {!isEmpty(el.toInboundBaggage) && (
                      <div
                        style={{
                          flex: 1,
                          minWidth: 220,
                          borderLeft: '1px solid #D9DBDC',
                          paddingLeft: 20,
                        }}
                      >
                        <Row>
                          <Col span={12} className='text-grey'>
                            Nâng chiều về:
                          </Col>
                          <Col span={12}>{`${el.fromInboundBaggage?.weight || 0}kg`}</Col>
                        </Row>
                        <Row>
                          <Col span={12} className='text-grey'>
                            Lên:
                          </Col>
                          <Col span={12}>{`${el.toInboundBaggage?.weight || 0}kg`}</Col>
                        </Row>
                        <Row>
                          <Col span={12} className='text-grey'>
                            Chi phí thêm:
                          </Col>
                          <Col span={12}>{`${formatMoney(el.inboundAmount)}`}</Col>
                        </Row>
                      </div>
                    )}
                  </Row>
                </div>
              ))}
            </>
          )}
          {content.type == TASK_TYPES.CHANGE_ITINERARY && (
            <>
              {listChangeItinerary?.map(
                (el: any, indx: number) =>
                  el.value && (
                    <Row key={indx} className='popover-ct-content'>
                      <span className='name'>{el.name}:</span>
                      <span className={el.class}>{el.value}</span>
                    </Row>
                  ),
              )}
            </>
          )}
          {content.type == TASK_TYPES.DIVIDE_BOOKING && (
            <>
              <p>{content.systemNote} </p>
              {content?.info?.newBookingId && (
                <p>
                  Đơn hàng con:{' '}
                  <a
                    className='text-blue'
                    href={`/sale/flight/online/${content?.info?.newBookingId}`}
                  >
                    F{content?.info?.newBookingId}
                  </a>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
  return (
    <Popover
      content={items}
      trigger='click'
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      {children}
    </Popover>
  );
};
export default PopoverFlightTask;
