import Modal from 'antd/lib/modal/Modal';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { IconCloseOutline } from '~/assets';
interface IConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  title?: string;
  cancelText?: string;
  acceptText?: string;
  children?: React.ReactNode;
  loading?: boolean;
}

const ConfirmModal: React.FunctionComponent<IConfirmModalProps> = ({
  open,
  onClose,
  title,
  onAccept,
  acceptText,
  cancelText,
  children,
  loading,
  ...rest
}) => {
  const intl = useIntl();
  return (
    <Modal
      closeIcon={<IconCloseOutline />}
      className='fl-bk-offline-modal'
      visible={open}
      onCancel={onClose}
      onOk={onAccept}
      width={480}
      title={title || null}
      okText={acceptText || intl.formatMessage({ id: 'IDS_TEXT_ACCEPT' })}
      cancelText={cancelText || intl.formatMessage({ id: 'IDS_TEXT_CANCEL' })}
      confirmLoading={loading}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default ConfirmModal;
