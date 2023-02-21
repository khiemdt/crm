import { Button, message, Modal } from 'antd';
import { confirmAdditions, cpaymentStatusAdditions } from '~/apis/hotel';
import { IconCloseNoneCycle } from '~/assets';
import '~/features/flight/components/modal/modal.scss';

const ModalConfirmAction = (props: any) => {
  const { modal, setModal, handleOk } = props;

  const handleCancel = () => {
    setModal({
      type: '',
      item: {},
    });
  };

  const _handleOk = async () => {
    try {
      if (modal.type === 'MODAL_CONFIRM' || modal.type === 'MODAL_CANCEL') {
        const { data } = await confirmAdditions({
          id: modal.item.id,
          action: modal.type === 'MODAL_CONFIRM' ? 'APPROVE' : 'REJECT',
        });
        if (data.code === 200) {
          handleCancel();
          handleOk();
          message.success('Hành động thực hiện thành công');
        } else {
          message.error('Hành động thực hiện thất bại');
        }
      } else {
        const { data } = await cpaymentStatusAdditions({
          id: modal.item.id,
          paymentStatus: 'success',
        });
        if (data.code === 200) {
          handleCancel();
          handleOk();
          message.success(data.message);
        } else {
          message.error(data.message || 'Hành động thực hiện thất bại');
        }
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra');
    }
  };

  return (
    <Modal
      className='modal-delete-invoice'
      visible={
        modal.type === 'MODAL_CONFIRM' ||
        modal.type === 'MODAL_CANCEL' ||
        modal.type === 'MODAL_STATUS'
      }
      onCancel={handleCancel}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={460}
    >
      <div className='title'>
        {modal.type === 'MODAL_CONFIRM'
          ? 'Xác nhận phát sinh thêm'
          : modal.type === 'MODAL_CANCEL'
          ? 'Xác nhận hủy'
          : 'Xác nhận chuyển trạng thái thanh toán'}
      </div>
      <div>
        {modal.type === 'MODAL_CONFIRM'
          ? 'Bạn xác nhận cho phát sinh thêm này?'
          : modal.type === 'MODAL_CANCEL'
          ? 'Bạn chắc chắn muốn hủy phát sinh thêm này?'
          : 'Bạn chắc chắn muốn chuyển trạng thái thanh toán này?'}
      </div>
      <div className='bottom'>
        <Button onClick={handleCancel}>Bỏ qua</Button>
        <Button type='primary' className='btn-ok' onClick={_handleOk}>
          Đồng ý
        </Button>
      </div>
    </Modal>
  );
};
export default ModalConfirmAction;
