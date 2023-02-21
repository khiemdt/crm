import { Button, message, Modal } from 'antd';
import { handleFlightBookingPostProcessing } from '~/apis/flight';
import { IconCloseNoneCycle } from '~/assets';
import '~/features/flight/components/modal/modal.scss';

const ProcessModal = (props: any) => {
  const { modal, setModal, handleOk } = props;

  const handleCancel = () => {
    setModal({
      type: '',
      item: {},
    });
  };

  const _handleOk = async () => {
    try {
      const { data } = await handleFlightBookingPostProcessing({
        id: modal.item.id,
        status: modal.type,
      });
      if (data.code === 200) {
        handleCancel();
        handleOk();
        message.success(`Yêu cầu thực hiện thành công`);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra');
    }
  };

  return (
    <Modal
      className='modal-delete-invoice'
      visible={modal.type === 'SUCCESS' || modal.type === 'FAILED'}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={460}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          {modal.type === 'SUCCESS' ? (
            <img src='https://storage.googleapis.com/tripi-assets/crm_premium/image_completed.png' />
          ) : (
            <img src='https://storage.googleapis.com/tripi-assets/crm_premium/image_warning.png' />
          )}
        </div>
        <span style={{ color: '#3F4445', fontSize: 16, fontWeight: 500 }}>
          {modal.type === 'SUCCESS' ? 'Xác nhận xử lý thành công' : 'Xác nhận xử lý thất bại'}
        </span>
        <span style={{ color: '#677072', padding: '12px 0 24px' }}>
          {modal.type === 'SUCCESS'
            ? 'Bạn chắc chắn đã xử lý phát sinh thêm thành công?'
            : 'Bạn chắc chắn phát sinh thêm không xử lý thành công?'}
        </span>
        <div>
          <Button type='primary' className='btn-ok' onClick={_handleOk} style={{ marginRight: 12 }}>
            Đồng ý
          </Button>
          <Button onClick={handleCancel}>Bỏ qua</Button>
        </div>
      </div>
    </Modal>
  );
};
export default ProcessModal;
