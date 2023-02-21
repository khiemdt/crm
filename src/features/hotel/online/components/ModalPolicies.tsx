import { Button, Modal } from 'antd';
import { IconCloseNoneCycle } from '~/assets';
import '~/features/flight/components/modal/modal.scss';

const ModalPolicies = (props: any) => {
  const { modal, setModal } = props;

  const handleCancel = () => {
    setModal({
      type: '',
      item: {},
    });
  };

  return (
    <Modal
      className='modal-delete-invoice'
      visible={modal.type === 'MODAL_KEY_POLICIES'}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={460}
    >
      <div className='title'>Thông tin chính sách hủy phòng</div>
      <ul>
        {modal?.item?.cancellationPolicies?.map((el: string, idx: number) => (
          <li key={idx}>{el}</li>
        ))}
      </ul>
      <div className='bottom'>
        <Button type='primary' className='btn-ok' onClick={handleCancel}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
};
export default ModalPolicies;
