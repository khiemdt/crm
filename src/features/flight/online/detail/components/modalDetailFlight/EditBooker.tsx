import { Button, Form, message } from 'antd';
import Input from 'antd/lib/input/Input';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { updateFlightBookerInfo } from '~/apis/flight';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { useAppDispatch } from '~/utils/hook/redux';

interface Props {
  booking: some;
  handleClose: () => void;
}
const EditBooker: React.FC<Props> = ({ handleClose, booking }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const { lastName, firstName, email, phone1 } = booking?.mainContact;

  const initialValues = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phone1,
  };

  const sendUpdateFlightBookerInfor = async (queryParams = {}) => {
    try {
      const { data } = await updateFlightBookerInfo(queryParams);
      if (data.code === 200) {
        handleClose();
        message.success('Thay đổi thông tin thành công');
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking?.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = (values: some) => {
    booking?.mainContact?.id &&
      sendUpdateFlightBookerInfor({
        ...values,
        bookerId: booking?.mainContact?.id,
      });
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      hideRequiredMark
      layout='vertical'
      onFinish={onFinish}
      className="form-edit-booker"
    >
      <Form.Item
        label='Họ'
        name='firstName'
        rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
      >
        <Input placeholder='Nhập họ' />
      </Form.Item>

      <Form.Item
        label='Tên đệm và tên'
        name='lastName'
        rules={[{ required: true, message: 'Vui lòng nhập email tên!' }]}
      >
        <Input placeholder='Nhập điện email' />
      </Form.Item>

      <Form.Item
        label='Số điện thoại'
        name='phoneNumber'
        rules={[
          { required: true, whitespace: true, message: 'Vui lòng nhập số điện thoại!' },
          {
            max: 12,
            message: 'Số điện thoại tối đa 12 kí tự',
          },
          {
            pattern: /^[0-9+]*$/,
            message: 'Số điện thoại không hợp lệ',
          },
        ]}
      >
        <Input placeholder='Nhập điện thoại' />
      </Form.Item>

      <Form.Item
        name='email'
        label='Email'
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ' },
        ]}
      >
        <Input placeholder='Nhập email' />
      </Form.Item>

      <div className='wrapper-submit'>
        <Button onClick={() => handleClose()}>
          <FormattedMessage id='IDS_TEXT_SKIP' />
        </Button>
        <Form.Item shouldUpdate className='buttonSubmit'>
          {() => {
            return (
              <Button
                type='primary'
                htmlType='submit'
                disabled={
                  JSON.stringify(initialValues) === JSON.stringify(form.getFieldsValue(true))
                }
              >
                <FormattedMessage id='IDS_TEXT_SEND' />
              </Button>
            );
          }}
        </Form.Item>
      </div>
    </Form>
  );
};

export default EditBooker;
