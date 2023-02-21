import { Modal, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { IconCloseNoneCycle } from '~/assets';
import '~/features/flight/components/modal/modal.scss';
import { InvoiceFlightType } from '~/features/flight/online/Modal';

export const columnsOrderDetail: ColumnsType<InvoiceFlightType> = [
  {
    title: 'Mã sản phẩm',
    key: 'id',
    dataIndex: 'id',
    width: 105,
  },
  {
    title: 'Số vé',
    key: 'eticketNumber',
    dataIndex: 'eticketNumber',
    width: 130,
  },
  {
    title: 'Sản phẩm',
    key: 'name',
    dataIndex: 'name',
    width: 140,
  },
  {
    title: 'Nhà cung cấp',
    key: 'providerName',
    dataIndex: 'providerName',
    width: 120,
  },
  {
    title: 'Tên hành khách',
    key: 'guestName',
    dataIndex: 'guestName',
  },
];

const OrderInvoice = (props: any) => {
  const { modal, setModal } = props;

  const handleCancel = () => {
    setModal({
      open: false,
      item: {},
    });
  };

  return (
    <Modal
      className='modal-order-original-invoice'
      visible={modal?.open}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={800}
    >
      <div className='title'>Đơn hàng gốc</div>
      <div className='content'>
        <Table
          rowKey={(record) => record.id}
          columns={columnsOrderDetail}
          dataSource={modal?.item?.items || []}
          pagination={false}
        />
      </div>
    </Modal>
  );
};
export default OrderInvoice;
