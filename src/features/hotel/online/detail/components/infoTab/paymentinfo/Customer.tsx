import { Divider, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
import { IconArrowRight } from '~/assets';
import { some } from '~/utils/constants/constant';
import { formatMoney } from '~/utils/helpers/helpers';
interface Props {
  data: some;
}

const Customer: React.FunctionComponent<Props> = (props) => {
  const { data } = props;

  const customerBookInfo = [
    {
      name: 'Giá bán:',
      value: () => {
        return <span> {formatMoney(data.customerPrice)} </span>;
      },
      isShow: data?.customerPrice,
    },
    {
      name: 'Tổng tiền giảm trừ:',
      value: () => {
        return <span> {formatMoney(data.totalDiscount)} </span>;
      },
      isShow: data?.totalDiscount,
    },
    {
      name: 'Tổng tiền KH thanh toán đơn gốc:',
      value: () => {
        return <span> {formatMoney(data.totalPrice)} </span>;
      },
      isShow: data?.totalPrice,
    },
    {
      name: 'Tổng tiền KH cần thanh toán:',
      value: () => {
        return <span> {formatMoney(data.finalCustomerPrice)} </span>;
      },
      isShow: data?.finalCustomerPrice,
    },
    {
      name: 'Tổng tiền KH đã thanh toán:',
      value: () => {
        return <span> {formatMoney(data.totalPaidPrice)} </span>;
      },
      isShow: data?.totalPaidPrice,
    },
    {
      name: 'Tổng phí hủy:',
      value: () => {
        return <span> {formatMoney(data.totalCancelFee)} </span>;
      },
      isShow: data?.totalCancelFee,
    },
    {
      name: 'Tổng tiền đã hoàn trả khách:',
      value: () => {
        return <span> {formatMoney(data.refundedAmount)} </span>;
      },
      isShow: data?.refundedAmount,
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

export default Customer;
