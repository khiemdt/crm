import { Modal, Tabs } from 'antd';
import { useIntl } from 'react-intl';
import { IconCloseOutline } from '~/assets';
import ContentEmailFlightJourney from '~/features/flight/components/modal/email/ContentEmailFlightJourney';
import ContentEmailPayment from '~/features/flight/components/modal/email/ContentEmailPayment';
import '~/features/flight/components/modal/modal.scss';
import ContentSmsFlightJourney from '~/features/flight/components/modal/sms/ContentSmsFlightJourney';
import ContentSmsPayment from '~/features/flight/components/modal/sms/ContentSmsPayment';
import { MODAL_KEY_EMAIL } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';

const { TabPane } = Tabs;

interface Props {
  modal: some;
  setModal: React.Dispatch<React.SetStateAction<some>>;
}

const SmsEmailModal: React.FC<Props> = (props) => {
  const { modal, setModal } = props;
  const intl = useIntl();
  const booking = modal.item;

  const handleCancel = () => {
    setModal({
      type: undefined,
      open: false,
      item: {},
    });
  };

  const isShowPaymentGuide =
    booking?.status && booking?.status != 'success' && booking?.status != 'completed';

  if (!modal?.open) return null;

  return (
    <Modal
      closeIcon={<IconCloseOutline />}
      className='wrapperModal'
      visible={modal?.open}
      onCancel={handleCancel}
      footer={false}
      width={modal?.type === MODAL_KEY_EMAIL ? 900 : 450}
    >
      <Tabs>
        {modal?.item?.caInfo?.id !== 1 && (
          <TabPane tab={intl.formatMessage({ id: 'IDS_TEXT_PAYMENT_GUIDE' })} key='1'>
            {modal?.type === MODAL_KEY_EMAIL ? (
              <ContentEmailPayment
                isShowPaymentGuide={isShowPaymentGuide}
                dataModal={modal}
                handleClose={handleCancel}
              />
            ) : (
              <ContentSmsPayment dataModal={modal} handleClose={handleCancel} />
            )}
          </TabPane>
        )}
        <TabPane tab={intl.formatMessage({ id: 'IDS_TEXT_FLIGHT_ITINERARY_CONFIRMATION' })} key='2'>
          {modal?.type === MODAL_KEY_EMAIL ? (
            <ContentEmailFlightJourney dataModal={modal} handleClose={handleCancel} />
          ) : (
            <ContentSmsFlightJourney dataModal={modal} handleClose={handleCancel} />
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
};
export default SmsEmailModal;
