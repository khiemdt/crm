import Modal from 'antd/lib/modal/Modal';
import * as React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import '~/features/flight/online/detail/FlightDetail.scss';
import { some } from '~/utils/constants/constant';

interface IImagePreviewModalProps {
  imageList: some[];
  open: boolean;
  onClose: () => void;
  startIndex: number | null;
}

const ImagePreviewModal: React.FunctionComponent<IImagePreviewModalProps> = ({
  imageList,
  open,
  onClose,
  startIndex,
}) => {
  return (
    <Modal visible={open} onCancel={onClose} width={700} footer={false} closeIcon={<></>}>
      <ImageGallery
        items={
          imageList?.map((v) => {
            return {
              original: v?.link || v?.url,
              thumbnail: v?.link || v?.thumbUrl,
              thumbnailClass: 'image-gallery-thumbnail',
            };
          }) || []
        }
        startIndex={startIndex || 0}
        showPlayButton={false}
      />
    </Modal>
  );
};

export default ImagePreviewModal;
