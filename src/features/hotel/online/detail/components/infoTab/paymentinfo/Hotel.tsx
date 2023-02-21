import { Divider, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
import { IconArrowRight } from '~/assets';
import { some } from '~/utils/constants/constant';
import { formatMoney } from '~/utils/helpers/helpers';
interface Props {
  data: some;
}

const Agency: React.FunctionComponent<Props> = (props) => {
  const { data } = props;

  const customerBookInfo = [
    {
      name: 'Tổng tiền trả khách sạn đơn gốc:',
      value: () => {
        return <span> {formatMoney(data.basePrice)} </span>;
      },
      isShow: data?.basePrice,
    },
    {
      name: 'Tổng tiền đã trả khách sạn:',
      value: () => {
        return <span> {formatMoney(data.paidPrice)} </span>;
      },
      isShow: data?.paidPrice,
    },
    {
      name: 'Tổng tiền cần trả khách sạn:',
      value: () => {
        return <span> {formatMoney(data.totalPrice)} </span>;
      },
      isShow: data?.totalPrice,
    },
    {
      name: 'Tổng phí hủy trả khách sạn:',
      value: () => {
        return <span> {formatMoney(data.totalCancelFee)} </span>;
      },
      isShow: data?.totalCancelFee,
    },
    {
      name: 'Giá trị đơn hàng còn lại:',
      value: () => {
        return <span> {formatMoney(data.bookingActiveAmount)} </span>;
      },
      isShow: data?.bookingActiveAmount,
    },
    {
      name: 'Tổng tiền đã thu khách sạn:',
      value: () => {
        return <span> {formatMoney(data.providerDebtAmount)} </span>;
      },
      isShow: data?.providerDebtAmount,
    },
  ];
  return (
    <div className='hotel-detail-payment-info-card'>
      <span className='hotel-detail-payment-info-title'>
        <FormattedMessage id='IDS_TEXT_HOTEL_CUSTOMER_PAYMENT' />
      </span>
      <Divider />
      {customerBookInfo.map(
        (el, inx) =>
          el.isShow != null && (
            <div key={inx} className='hotel-detail-payment-info-row'>
              <span>{el.name} </span>
              <el.value />
            </div>
          ),
      )}
      <Divider />
      <Space align='start' className='pointer'>
        <IconArrowRight />
        <p className='text-main'>Xem chi tiết từng phòng</p>
      </Space>
    </div>
  );
};

export default Agency;
