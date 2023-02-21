import { Modal, Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import { IconCloseOutline } from '~/assets';
import ContentEmailPayment from '~/features/flight/components/modal/email/ContentEmailPayment';
import '~/features/flight/components/modal/modal.scss';
import { some } from '~/utils/constants/constant';
interface Props {
  open: boolean;
  handleClose: () => void;
  booking: some;
  isShowPaymentGuide: boolean;
  typeModal?: string;
}

const EmailModal: React.FC<Props> = (props) => {
  const { open, handleClose, booking, isShowPaymentGuide, typeModal } = props;

  return (
    <Modal
      closeIcon={<IconCloseOutline />}
      className='wrapperModal'
      visible={open}
      onCancel={handleClose}
      footer={false}
      width={900}
    >
      <h2 style={{ fontSize: '16px', marginBottom: 14 }}>
        <FormattedMessage id='IDS_TEXT_PAYMENT_GUIDE' />
      </h2>
      <ContentEmailPayment
        typeModal={typeModal}
        isShowPaymentGuide={isShowPaymentGuide}
        dataModal={booking}
        handleClose={handleClose}
      />
    </Modal>
  );
};
export default EmailModal;
