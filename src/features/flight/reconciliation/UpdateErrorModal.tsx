import { FC, useEffect, useState } from 'react';
import { Modal, Form, Row, Button, Space, Col, Select, InputNumber, Input, message } from 'antd';
import './Reconciliation.scss';
import { IconCloseNoneCycle } from '~/assets/index';
import { some } from '~/utils/constants/constant';
import { getErrorTags, getErrorTagsSolutions, updateErrorTagsReconcile } from '~/apis/flight';

type Props = {
  modal: any;
  modalTypes: any;
  setModal: any;
  handleSuccessAction: any;
};

const listStatus = [
  {
    id: 'INIT',
    name: 'Chờ xác nhận',
  },
  {
    id: 'CONFIRM',
    name: 'Đã xác nhận',
  },
  {
    id: 'REJECT',
    name: 'Từ chối',
  },
];
const UpdateErrorModal: FC<Props> = (props) => {
  const { modal, modalTypes, setModal, handleSuccessAction } = props;
  const [form] = Form.useForm();
  const [reconcileErrorTag, setReconcileErrorTag] = useState<some>({});
  const [reconcileSolutions, setReconcileSolutions] = useState<some>({});

  const fetReconcileErrorTag = async () => {
    try {
      const { data } = await getErrorTags();
      if (data.code === 200) {
        setReconcileErrorTag(data.data);
      }
    } catch (error) {}
  };

  const fetReconcileSolutions = async () => {
    try {
      const { data } = await getErrorTagsSolutions();
      if (data.code === 200) {
        setReconcileSolutions(data.data);
      }
    } catch (error) {}
  };

  const updateErrorTag = async (dataDto = {}) => {
    try {
      const { data } = await updateErrorTagsReconcile(dataDto);
      if (data.code === 200) {
        handleCancel();
        message.success('Thực hiện thành công!');
        handleSuccessAction();
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
    if (modal.type === modalTypes.EDIT_ERROR) {
      form.setFieldsValue({
        errorTagId: modal?.item?.errorTagsId,
        differentAmount: modal?.item?.differentAmount,
        solutionId: modal?.item?.solutionId || null,
        status: modal?.item?.status || null,
        accountantNote: modal?.item?.accountantNote || null,
      });
    }
  }, [modal]);

  useEffect(() => {
    fetReconcileErrorTag();
    fetReconcileSolutions();
  }, []);

  const onFinish = (values: any) => {
    updateErrorTag({
      ...values,
      id: modal?.item?.id,
    });
  };

  const getCsHandle = () => {
    const temp = reconcileErrorTag?.items?.find(
      (it: any) => it.id === form.getFieldValue('errorTagId'),
    );
    return temp.department;
  };

  return (
    <Modal
      width={550}
      title='Cập nhật lỗi đối soát'
      visible={modal.type === modalTypes.EDIT_ERROR}
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
          errorTagId: modal?.item?.errorTagsId,
          differentAmount: modal?.item?.differentAmount,
          solutionId: modal?.item?.solutionId || null,
          status: modal?.item?.status || null,
          accountantNote: modal?.item?.accountantNote || null,
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
            <Form.Item
              style={{ marginBottom: 0 }}
              name='errorTagId'
              rules={[{ required: true, message: 'Không được để trống !' }]}
            >
              <Select placeholder='Chọn loại lỗi' style={{ width: '100%' }}>
                {reconcileErrorTag?.items?.map((val: any) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {`(${val?.department}) ${val?.name}`}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} className='mb-8'>
          <Col span={8}>Đối tượng xử lý</Col>
          <Col span={16} className='text-bold'>
            <Form.Item
              style={{ marginBottom: 0 }}
              shouldUpdate={(prevValues, curValues) =>
                prevValues.errorTagId !== curValues.errorTagId
              }
            >
              {() => <span className='text-bold'>{getCsHandle()}</span>}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>Chênh lệch</Col>
          <Col span={16}>
            <Form.Item
              name='differentAmount'
              rules={[
                { required: true, message: 'Không được để trống !' },
                {
                  pattern: new RegExp('^[0-9-]*$'),
                  message: 'Chỉ được nhập chữ số',
                },
              ]}
            >
              <InputNumber
                type='text'
                formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder='Nhập số tiền'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>Ghi nhận chênh lệch</Col>
          <Col span={16}>
            <Form.Item
              name='solutionId'
              rules={[{ required: true, message: 'Không được để trống !' }]}
            >
              <Select placeholder='Chọn hướng xử lý cho chênh lệch' style={{ width: '100%' }}>
                {reconcileSolutions?.items?.map((val: any) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {`${val?.name}`}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>Trạng thái</Col>
          <Col span={16}>
            <Form.Item name='status' rules={[{ required: true, message: 'Không được để trống !' }]}>
              <Select placeholder='Chọn hướng xử lý cho chênh lệch' style={{ width: '100%' }}>
                {listStatus?.map((val: any) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {`${val?.name}`}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>Ghi chú đối soát</Col>
          <Col span={16}>
            <Form.Item name='accountantNote'>
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
            <Button style={{ width: 90 }} type='primary' htmlType='submit'>
              Xác nhận
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateErrorModal;
