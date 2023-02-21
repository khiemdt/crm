import { Button, Form, Input, message, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { editNoteToCustomer, updateFlightBookerInfo } from '~/apis/flight';
import { IconArrow } from '~/assets';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

interface Props {
  modal: boolean;
  setModal: any;
}
const EditNoteToCustomer: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const { modal, setModal } = props;
  const [isLoading, setLoading] = useState(false);
  const initValue = {
    noteToCustomer: booking.noteToCustomer || '',
  };
  const handleClose = () => {
    setModal(false);
  };
  const onFinish = async (params: some) => {
    setLoading(true);
    const queryParams: some = {
      bookingId: booking.id,
      ...params,
    };
    try {
      let dataRes: some = {};
      const { data } = await editNoteToCustomer(queryParams);
      setLoading(false);
      dataRes = data;
      if (dataRes.code === 200) {
        message.success('Lưu ý thành công');
        handleClose();
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
      } else {
        message.error(dataRes?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!modal) {
      form.resetFields();
    } else {
      form.setFieldsValue(initValue);
    }
  }, [booking, modal]);
  return (
    <Modal
      className='wrapperModal'
      visible={modal}
      onCancel={handleClose}
      footer={false}
      width={450}
    >
      <div className='title'>Lưu ý cho khách hàng</div>
      <Form
        form={form}
        initialValues={initValue}
        hideRequiredMark
        layout='vertical'
        onFinish={onFinish}
      >
        <Form.Item name='noteToCustomer' rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
          <Input.TextArea rows={4} placeholder='Nội dung lưu ý' />
        </Form.Item>
        <div className='wrapperSubmitSms'>
          <Button onClick={handleClose}>
            <FormattedMessage id='IDS_TEXT_SKIP' />
          </Button>
          <Form.Item shouldUpdate className='buttonSubmit'>
            {() => {
              return (
                <Button
                  loading={isLoading}
                  type='primary'
                  htmlType='submit'
                  disabled={JSON.stringify(initValue) === JSON.stringify(form.getFieldsValue(true))}
                >
                  <FormattedMessage id='IDS_TEXT_SEND' />
                </Button>
              );
            }}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditNoteToCustomer;
