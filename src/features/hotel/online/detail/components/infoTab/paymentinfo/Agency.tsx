import { Divider, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
import { IconArrowRight, IconInfomation } from '~/assets';
import { some } from '~/utils/constants/constant';
import { formatMoney } from '~/utils/helpers/helpers';
interface Props {
  data: some;
}

const Agency: React.FunctionComponent<Props> = (props) => {
  const { data } = props;

  const customerBookInfo = [
    {
      name: 'Tổng tiền mua đơn gốc từ Agency:',
      value: () => {
        return <span> {formatMoney(data.basePrice)} </span>;
      },
      isShow: data?.basePrice,
    },
    {
      name: 'Tổng tiền thanh toán Agency:',
      value: () => {
        return <span> {formatMoney(data.paidPrice)} </span>;
      },
      isShow: data?.paidPrice,
    },
    {
      name: 'Marketing fee:',
      value: () => {
        return <span> {formatMoney(data.marketingFee)} </span>;
      },
      isShow: data?.marketingFee,
      class: 'text-grey child-info-payment',
    },
    {
      name: 'Hoa hồng Vntravel:',
      value: () => {
        return <span> {formatMoney(data.tripiCommission)} </span>;
      },
      isShow: data?.tripiCommission,
      affter: () => {
        return (
          <div className='sub-title'>
            <span>{data.isCashBack ? 'Trả sau' : 'Trả trước'} </span>
            <IconInfomation style={{ cursor: 'pointer' }} />
          </div>
        );
      },
      class: 'text-grey child-info-payment',
    },
    {
      name: 'Tổng tiền thực trả Agency:',
      value: () => {
        return <span> {formatMoney(data.totalPrice)} </span>;
      },
      isShow: data?.totalPrice,
    },
    {
      name: 'Tổng tiền phí hủy trả Agency:',
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
      name: 'Tổng tiền đã thu Agency:',
      value: () => {
        return <span> {formatMoney(data.providerDebtAmount)} </span>;
      },
      isShow: data?.providerDebtAmount,
    },
  ];
  return (
    <div className='hotel-detail-payment-info-card'>
      <span className='hotel-detail-payment-info-title'>
        <FormattedMessage id='IDS_TEXT_HOTEL_AGENCY_PAYMENT' />
      </span>
      <Divider />
      {customerBookInfo.map(
        (el, inx) =>
          el.isShow != null && (
            <div key={inx} className={`hotel-detail-payment-info-row ${el.class}`}>
              <span className='hotel-detail-payment-info-name'>
                {el.name} {el?.affter && <el.affter />}
              </span>
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
