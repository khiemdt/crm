import { Modal } from 'antd';
import * as React from 'react';
import { IconCloseOutline } from '~/assets';
import '~/features/flight/online/detail/FlightDetail.scss';

interface INoteActionModalProps {
  onClose: () => void;
  open: boolean;
  children?: React.ReactNode;
  title?: string;
  width?: number;
}

const NoteActionModal: React.FunctionComponent<INoteActionModalProps> = ({
  open,
  title,
  onClose,
  children,
  width,
}) => {
  return (
    <Modal
      visible={open}
      onCancel={onClose}
      width={width || 700}
      footer={false}
      closeIcon={<IconCloseOutline />}
      className='hotel-note-modal'
      title={title || null}
    >
      {children}
    </Modal>
  );
};

export default NoteActionModal;
