import { Col, Popover, Row } from 'antd';
import { some } from '~/utils/constants/constant';
import { IconCashPolicy } from '~/assets';

interface Props {
  data: some;
}
const DetailRoomInfo: React.FunctionComponent<Props> = (props) => {
  const { data } = props;

  const content = (item: any) => (
    <div dangerouslySetInnerHTML={{ __html: item?.description }}></div>
  );

  return (
    <Row style={{ paddingTop: 5 }}>
      <Col span={12}>
        <div className='item-box-provider '>
          <span className='titel-long'>Mã đơn phòng:</span>
          <span>{data.partnerRoomBookingCode} </span>
        </div>
        <div className='item-box-provider '>
          <span className='titel-long'>RateName:</span>
          <span>{data.ratePlanName} </span>
        </div>
        <div className='item-box-provider '>
          <span className='titel-long'>Miễn phí bữa sáng:</span>
          <span>{data.freeBreakfast ? 'Có miễn phí bữa sáng' : 'Không miễn phí bữa sáng'}</span>
        </div>
        <div className='item-box-provider '>
          <span className='titel-long'>Yêu cầu loại giường:</span>
          <span>{data.bedInfo} </span>
        </div>
        {data?.policies.map((el: some) => (
          <Popover content={content(el)} title={el.shortDescription}>
            <div className='item-box-provider pointer' key={el.shortDescription}>
              <IconCashPolicy />
              <span className='text-main'>{el.shortDescription}</span>
            </div>
          </Popover>
        ))}
      </Col>
      <Col span={12}>
        <div className='item-box-provider '>
          <span className='titel-long'>Số lượng phòng:</span>
          <span>{data.numRoom} </span>
        </div>
        <div className='item-box-provider '>
          <span className='titel-long'>Số đêm:</span>
          <span>{data.numNight} </span>
        </div>
        <div className='item-box-provider '>
          <span className='titel-long'>Người nhận phòng:</span>
          <span>{data.contactName} </span>
        </div>
        <div className='item-box-provider '>
          <span className='titel-long'>Số điện thoại:</span>
          <span>{data.contactPhoneNumber} </span>
        </div>
        <div className='item-box-provider '>
          <span className='titel-long'>Gmail:</span>
          <span className='text-main'>{data.contactEmail} </span>
        </div>
      </Col>
    </Row>
  );
};

export default DetailRoomInfo;
