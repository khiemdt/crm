import { Button, message, Modal } from 'antd';
import { deleteVatInvoiceDetail } from '~/apis/flight';
import { IconCloseNoneCycle } from '~/assets';
import '~/features/flight/components/modal/modal.scss';

const ModalDeleteInvoice = (props: any) => {
  const { open, modal, setModal, handleOk } = props;

  const handleCancel = () => {
    setModal({
      type: '',
      item: {},
    });
  };

  const _handleOk = async () => {
    try {
      const { data } = await deleteVatInvoiceDetail({
        bookerRequestId: modal.item.id,
      });
      if (data.code === 200) {
        handleCancel();
        handleOk();
        message.success('Xác nhận hủy yêu cầu xuất hóa đơn thành công');
      } else {
        message.error('Xác nhận hủy yêu cầu xuất hóa đơn thất bại');
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra');
    }
  };

  return (
    <Modal
      className='modal-delete-invoice'
      visible={open}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={460}
    >
      <div className='title'>Xác nhận hủy yêu cầu</div>
      <div>Vui lòng kiểm tra kỹ thông tin trước khi thực hiện!</div>
      <div className='bottom'>
        <Button onClick={handleCancel}>Hủy</Button>
        <Button type='primary' className='btn-ok' onClick={_handleOk}>
          Đồng ý
        </Button>
      </div>
    </Modal>
  );
};
export default ModalDeleteInvoice;
