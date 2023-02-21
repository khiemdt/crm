import { Button, Form, Input, Modal, message } from 'antd';
import React from 'react';
import { voidVnaTicketByPnr } from '~/apis/flight';
import { IconCloseOutline } from '~/assets';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';

interface Props {
  open: boolean;
  handleClose: () => void;
}
const VoidTicketPnr: React.FC<Props> = ({ open, handleClose }) => {
  const [form] = Form.useForm();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);

  const fetVoidVnaTicketByPnr = async (queryParams = {}) => {
    try {
      const { data } = await voidVnaTicketByPnr(queryParams);
      if (data.code === 200) {
        message.success(data?.message);
        handleClose();
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = (values: some) => {
    fetVoidVnaTicketByPnr({
      bookingId: booking?.id,
      module: 'flight',
      pnrCode: values?.pnrCode,
    });
  };

  return (
    <Modal
      className='wrapper-modal-void-ticket'
      title={<div className='title-modal'>Void vé VNA theo mã PNR</div>}
      visible={open}
      footer={false}
      closeIcon={<IconCloseOutline />}
      onCancel={handleClose}
    >
      <Form
        form={form}
        requiredMark={false}
        className='form-modal-void-pnr'
        layout='vertical'
        onFinish={onFinish}
      >
        <Form.Item
          name='pnrCode'
          label='PNR code'
          rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
        >
          <Input allowClear placeholder='Nhập mã' />
        </Form.Item>

        <div className='footer-table-split-code footer-void-ticket' style={{ paddingTop: 0 }}>
          <div className='button-void-ticket'>
            <Button onClick={handleClose}>Bỏ qua</Button>
            <Button htmlType='submit' type='primary'>
              Gửi
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default VoidTicketPnr;
