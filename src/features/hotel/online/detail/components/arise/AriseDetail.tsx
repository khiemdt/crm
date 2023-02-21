import { Drawer } from 'antd';
import { IconCloseNoneCycle } from '~/assets';
import { some } from '~/utils/constants/constant';
import { formatMoney } from '~/utils/helpers/helpers';

const AriseDetail = (props: some) => {
  const { modal, setModal } = props;

  const title = (
    <div className='header-detail'>
      <span>Chi tiết</span>
      <IconCloseNoneCycle
        style={{ cursor: 'pointer' }}
        onClick={() =>
          setModal({
            type: '',
            item: {},
          })
        }
      />
    </div>
  );

  const { item } = modal;

  return (
    <Drawer
      title={title}
      placement='right'
      closable={false}
      onClose={() =>
        setModal({
          type: '',
          item: {},
        })
      }
      visible={modal.type === 'MODAL_DETAIL'}
      width={340}
      className='drawer-arise-detail'
    >
      <div className='item-detail'>
        <span className='title'>Mã đơn</span>
        <span>{item.bookingId}</span>
      </div>
      <div className='item-detail'>
        <span className='title'>Agency</span>
        <span>{item.agencyName}</span>
      </div>
      <div className='item-detail'>
        <span className='title'>Mã thanh toán</span>
        <span>{item.paymentMethodName}</span>
      </div>
      <div className='item-detail' style={{ borderBottom: '1px solid #D9DBDC', paddingBottom: 10 }}>
        <span className='title'>Mã thanh toán</span>
        <span>{item.bookingCode}</span>
      </div>
      {item?.additions?.map((el: some, idx: number) => (
        <div key={idx} style={{ borderBottom: '1px solid #D9DBDC', paddingBottom: 10 }}>
          <div className='item-detail'>
            <span className='title'>Loại phụ thu</span>
            <span>{el.additionTypeName}</span>
          </div>
          <div className='item-detail'>
            <span className='title'>Giá NET trả NCC</span>
            <span>{formatMoney(el.netPrice)}</span>
          </div>
          <div className='item-detail'>
            <span className='title'>Phí dịch vụ</span>
            <span>{formatMoney(el.processingFee)}</span>
          </div>
          <div className='item-detail'>
            <span className='title'>Tiền khách thanh toán</span>
            <span>{formatMoney(el.totalAmount)}</span>
          </div>
        </div>
      ))}
      <div className='item-detail'>
        <span className='title'>Tổng giá NET trả NCC</span>
        <span>{formatMoney(item.netPrice)}</span>
      </div>
      <div className='item-detail'>
        <span className='title'>Tổng phí dịch vụ</span>
        <span>{formatMoney(item.processingFee)}</span>
      </div>
      <div className='item-detail'>
        <span className='title' style={{ color: '#FF2C00' }}>
          Tổng tiền khách thanh toán
        </span>
        <span style={{ color: '#FF2C00' }}>{formatMoney(item.totalAmount)}</span>
      </div>
      <div style={{ paddingLeft: 10 }}>
        <div className='title'>Ghi chú:</div>
        <div>{item.note}</div>
      </div>
    </Drawer>
  );
};

export default AriseDetail;
