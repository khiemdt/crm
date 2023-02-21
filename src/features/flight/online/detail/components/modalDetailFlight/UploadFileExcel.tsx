import { InboxOutlined } from '@ant-design/icons';
import { Button, message, Modal, Row, Space, Upload, UploadProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as XLSX from 'xlsx';
import { IconDownLoad } from '~/assets';
import { MODAL_KEY_MENU } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';

interface Props {
  visibleModal: boolean;
  setVisibleModal: any;
}

const UploadFileExcel: React.FC<Props> = (props) => {
  const { visibleModal, setVisibleModal } = props;
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const [listUser, setListUser] = useState<some[]>([]);
  const { Dragger } = Upload;
  const handleClose = () => {
    setVisibleModal({
      type: null,
      data: null,
    });
  };

  const upload: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    beforeUpload: (file) => {
      const isXlsx = file.name.match(/\.(xlsx)$/);
      if (!isXlsx) {
        message.error(`${file.name} không hợp lệ`);
      } else {
        const reader = new FileReader();
        reader.onload = (evt) => {
          // evt = on_file_select event
          /* Parse data */
          const bstr = evt?.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data: some[] = XLSX.utils.sheet_to_json(ws, {
            header: 2,
            raw: false,
            dateNF: 'yyyy-mm-dd',
          });
          /* Update state */
          setListUser(data);
        };
        reader.readAsBinaryString(file);
      }
      return !!isXlsx || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} tải lên thành công.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    onRemove: (file) => {
      setListUser([]);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  useEffect(() => {
    
  }, [booking]);
  return (
    <Modal
      className='wrapperModal'
      visible={visibleModal}
      onCancel={handleClose}
      footer={false}
      width={450}
      title='Tải lên thông tin hành khách'
    >
      <a href='https://storage.googleapis.com/tripi-assets/crm_premium/CRM_FORM_CUSTOMER.xlsx'>
        <Button style={{ padding: 0 }} type='text' icon={<IconDownLoad />}>
          <span className='text-blue'>Tải xuống template</span>
        </Button>
      </a>
      <div style={{ margin: '10px 0px' }}>
        <Dragger {...upload} maxCount={1}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>Kéo thả vào đây</p>
          <p className='ant-upload-hint'>Hoặc</p>
          <p className='ant-upload-hint'>Tải file lên tại đây</p>
        </Dragger>
      </div>
      <Row className='wrapperSubmitSms'>
        <Button onClick={handleClose}>
          <FormattedMessage id='IDS_TEXT_SKIP' />
        </Button>
        <Button
          onClick={() => {
            setVisibleModal({
              type: MODAL_KEY_MENU.UPLOAD_FILE_EXCEL,
              data: listUser,
            });
          }}
          type='primary'
          disabled={!listUser.length}
        >
          <FormattedMessage id='IDS_TEXT_UPLOAD' />
        </Button>
      </Row>
    </Modal>
  );
};

export default UploadFileExcel;
