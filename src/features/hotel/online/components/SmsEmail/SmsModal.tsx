import { Button, Form, Input, message, Modal } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getHotelBookingSms, sendSmsToCustomer } from '~/apis/hotel';
import { IconCloseOutline } from '~/assets';
import { RULES_REGEXP_PHONE } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';

const LIST_SMS_MESS = [
  {
    id: 'SUPPORT_DELAY',
    name: 'Không liên hệ được KH trong 30 phút',
  },
  {
    id: 'GUEST_UNREACH_ROOM_READY',
    name: 'Không gọi được KH để chốt đơn (Có phòng)',
  },
  {
    id: 'GUEST_UNREACH_OVERBOOK',
    name: 'Không gọi được KH để chốt đơn(Over book)',
  },
  {
    id: 'ROOM_CONFIRM',
    name: 'Gửi lại SMS xác nhận',
  },
  {
    id: 'PAYMENT_INSTRUCTION',
    name: 'Gửi lại SMS hướng dẫn thanh toán',
  },
];
interface Props {
  open: boolean;
  bookingId: number;
  handleClose: () => void;
}

const { TextArea } = Input;

let valueTemps = {};
const SmsModal: React.FC<Props> = ({ open, bookingId, handleClose }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const handleContentMess = (keyMess: some) => {
    fetGetHotelBookingSms({
      bookingId: bookingId,
      smsType: keyMess?.id,
    });
  };

  const fetGetHotelBookingSms = async (queryParams = {}) => {
    try {
      const { data } = await getHotelBookingSms(queryParams);
      if (data.code === 200) {
        form.setFieldsValue(data?.data);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetSendSmsToCustomer = async (queryParams = {}) => {
    try {
      const { data } = await sendSmsToCustomer(queryParams);
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
    const { messageContent, customerPhoneNumber } = values;
    fetSendSmsToCustomer({
      bookingId,
      bookingType: 'hotel',
      phoneNumber: customerPhoneNumber,
      smsContent: messageContent,
    });
  };

  useEffect(() => {
    bookingId &&
      fetGetHotelBookingSms({
        bookingId: bookingId,
        smsType: 'SUPPORT_DELAY',
      });
  }, [bookingId]);

  return (
    <Modal
      closeIcon={<IconCloseOutline />}
      className='wrapperModal'
      visible={open}
      onCancel={handleClose}
      footer={false}
    >
      <h3>Gửi tin nhắn cho khách hàng</h3>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        hideRequiredMark
        className='form-modal'
        onFinish={onFinish}
      >
        <div>
          <Form.Item name='customerName' label={intl.formatMessage({ id: 'IDS_TEXT_RECIPIENT' })}>
            <Input
              allowClear
              placeholder={intl.formatMessage({ id: 'IDS_TEXT_RECIPIENT' })}
              disabled
            />
          </Form.Item>

          <Form.Item
            name='customerPhoneNumber'
            label={intl.formatMessage({ id: 'IDS_TEXT_PHONE' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const phoneNumber = value?.match(RULES_REGEXP_PHONE);
                  if (
                    phoneNumber &&
                    phoneNumber?.toString()?.length < 13 &&
                    phoneNumber?.toString()?.length > 8
                  ) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: 'IDS_TEXT_RULES_PHONE_NUMBER' })),
                    );
                  }
                },
              }),
            ]}
          >
            <Input allowClear placeholder={intl.formatMessage({ id: 'IDS_TEXT_PHONE' })} />
          </Form.Item>
          <div className='list-mess-checkbox'>
            {LIST_SMS_MESS?.map((val: some, index: number) => (
              <span key={index} onClick={() => handleContentMess(val)}>
                {val?.name}
              </span>
            ))}
          </div>
          <Form.Item
            name='messageContent'
            label='Nội dung'
            rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
          >
            <TextArea
              placeholder={intl.formatMessage({ id: 'IDS_TEXT_IMPORT_CONTENT' })}
              autoSize={{ minRows: 3, maxRows: 14 }}
            />
          </Form.Item>
        </div>
        <div className='wrapperSubmitSms'>
          <Button onClick={() => {}}>
            <FormattedMessage id='IDS_TEXT_SKIP' />
          </Button>
          <Form.Item shouldUpdate className='buttonSubmit'>
            {() => (
              <Button
                type='primary'
                htmlType='submit'
                disabled={JSON.stringify(valueTemps) === JSON.stringify(form.getFieldsValue(true))}
              >
                <FormattedMessage id='IDS_TEXT_SEND' />
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default SmsModal;
