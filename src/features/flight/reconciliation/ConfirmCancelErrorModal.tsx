import { FC, useEffect } from 'react';
import { Modal, Form, Row, Col, Button, Space, Input, message } from 'antd';
import './Reconciliation.scss';
import { formatMoney } from '~/utils/helpers/helpers';
import { IconCloseNoneCycle } from '~/assets/index';
import { getErrorTagsStatus } from '~/apis/flight';

type Props = {
  modal: any;
  setModal: any;
  modalTypes: any;
  handleSuccessAction: any;
};

const ConfirmCancelErrorModal: FC<Props> = (props) => {
  const { modal, setModal, modalTypes, handleSuccessAction } = props;
  const [form] = Form.useForm();

  const updateStatusTag = async (dataDto = {}) => {
    try {
      const { data } = await getErrorTagsStatus(dataDto);
      if (data.code === 200) {
        handleCancel();
        message.success('Thực hiện thành công!');
        handleSuccessAction();
      } else {
        message.error(data.message);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    setModal({
      type: '',
      item: {},
    });
  };

  useEffect(() => {
    if (modal.type === modalTypes.COMFIRM_ERROR || modal.type === modalTypes.REJECT_ERROR) {
      form.resetFields();
    }
  }, [modal]);

  const onFinish = (values: any) => {
    updateStatusTag({
      ...values,
      status:
        modal.type === modalTypes.COMFIRM_ERROR
          ? 'CONFIRM'
          : modal.type === modalTypes.REJECT_ERROR
          ? 'REJECT'
          : '',
      ids: [modal?.item?.id],
    });
  };

  return (
    <Modal
      width={550}
      title={modal.type === modalTypes.COMFIRM_ERROR ? 'Xác nhận xử lý lỗi' : 'Từ chối xử lý lỗi'}
      visible={modal.type === modalTypes.COMFIRM_ERROR || modal.type === modalTypes.REJECT_ERROR}
      onCancel={handleCancel}
      className='modal-customer'
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
    >
      <Form
        form={form}
        className='form-customer'
        scrollToFirstError
        colon={false}
        onFinish={onFinish}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        initialValues={{
          note: '',
        }}
      >
        <Row gutter={24} className='mb-8'>
          <Col span={8}>PNR</Col>
          <Col span={16} className='text-bold'>
            {modal?.item?.pnr}
          </Col>
        </Row>
        <Row gutter={24} className='mb-8'>
          <Col span={8}>Mã đơn hàng</Col>
          <Col span={16} className='color-green text-bold'>
            {modal?.item?.bookingIds?.join(', ')}
          </Col>
        </Row>
        <Row gutter={24} className='mb-8'>
          <Col span={8}>Phân loại lỗi</Col>
          <Col span={16} className='text-bold'>
            {modal?.item?.errorTagsName}
          </Col>
        </Row>
        <Row gutter={24} className='mb-8'>
          <Col span={8}>Đối tượng xử lý</Col>
          <Col span={16} className='text-bold'>
            {modal?.item?.department}
          </Col>
        </Row>
        <Row gutter={24} className='mb-8'>
          <Col span={8}>Giá hãng</Col>
          <Col span={16} className='text-bold'>
            {formatMoney(modal?.item?.providerTotalAmount)}
          </Col>
        </Row>
        <Row gutter={24} className='mb-8'>
          <Col span={8}>Giá VNtravel</Col>
          <Col span={16} className='text-bold'>
            {formatMoney(modal?.item?.vntTotalAmount)}
          </Col>
        </Row>
        {/* <Row gutter={24} className='mb-8'>
          <Col span={8}>Chênh lệch</Col>
          <Col span={16} className='text-bold'>
            {formatMoney(modal?.item?.differentAmount)}
          </Col>
        </Row> */}

        <Row gutter={24} className='mb-8'>
          <Col span={8}>Ghi nhận chênh lệch</Col>
          <Col span={16} className='text-bold'>
            {formatMoney(modal?.item?.differentAmount)}
          </Col>
        </Row>
        <Row gutter={24} className='mb-8'>
          <Col span={8}>Đối soát ghi chú</Col>
          <Col span={16} className='text-bold'>
            {modal?.item?.accountantNote}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>Ghi chú</Col>
          <Col span={16}>
            <Form.Item name='note'>
              <Input.TextArea
                rows={4}
                style={{ width: '100%' }}
                placeholder='Thêm ghi chú tại đây'
                showCount
                maxLength={250}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='end'>
          <Space size={12}>
            <Button style={{ width: 90 }} onClick={handleCancel}>
              Huỷ
            </Button>
            <Button
              style={{ width: 90 }}
              type='primary'
              htmlType='submit'
              danger={modal.type === modalTypes.REJECT_ERROR}
            >
              {modal.type === modalTypes.COMFIRM_ERROR ? 'Xác nhận' : 'Từ chối'}
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default ConfirmCancelErrorModal;
