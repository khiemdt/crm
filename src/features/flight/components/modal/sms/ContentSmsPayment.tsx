import { Button, Form, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getActiveBankTransferList, getSupportPaySms, updateSupportPaySms } from '~/apis/flight';
import { RULES_REGEXP_PHONE } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';

const { Option } = Select;
const { TextArea } = Input;

const messageClose = (mess: string, handleClose: () => void) => {
  return (
    <div>
      <div className='wrapper-message-model-sms'>
        <div className='content-message-model-sms'>
          <p>{mess}</p>
        </div>
      </div>
      <div className='wrapperSubmitSms'>
        <Button onClick={() => handleClose()}>
          <FormattedMessage id='IDS_TEXT_SKIP' />
        </Button>
      </div>
    </div>
  );
};

interface Props {
  handleClose: () => void;
  dataModal: some;
}

let valueTemps = {};
const ContentSmsPayment: React.FC<Props> = ({ handleClose, dataModal }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);

  const [payMent, setPayMent] = useState<some>([]);
  const [messageSupportPaySms, setMessageSupportPaySms] = useState<string | undefined | null>(
    undefined,
  );

  const fetActiveBankTransferList = async (queryParams: object) => {
    try {
      const { data } = await getActiveBankTransferList(queryParams);
      if (data.code === 200) {
        setPayMent(data?.data);
        if (!isEmpty(data?.data)) {
          form.setFieldsValue({
            payMent: data?.data[0]?.id,
          });
          valueTemps = {
            ...valueTemps,
            payMent: data?.data[0]?.id,
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetSupportPaySms = async (queryParams = {}) => {
    try {
      const { data } = await getSupportPaySms(queryParams);
      if (data.code === 200) {
        setMessageSupportPaySms(null);
        if (!isEmpty(data?.data)) {
          const temp = {
            recipient: data?.data?.customerName,
            phone: data?.data?.customerPhoneNumber,
            note: data?.data?.messageContent,
          };
          form.setFieldsValue(temp);
          valueTemps = {
            ...valueTemps,
            ...temp,
          };
        }
      } else {
        setMessageSupportPaySms(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (dataModal?.item?.caInfo?.id) {
      fetActiveBankTransferList({
        caId: dataModal?.item?.caInfo?.id,
        module: 'flight',
      });
    }
  }, [dataModal]);

  useEffect(() => {
    const firstPayMent = payMent[0]?.id;
    if (firstPayMent && dataModal?.item?.id) {
      fetSupportPaySms({
        bankId: firstPayMent,
        bookingId: dataModal?.item?.id,
        product: 'flight',
      });
    }
  }, [payMent]);

  const saveSupportPaySms = async (queryParams = {}) => {
    try {
      const { data } = await updateSupportPaySms(queryParams);
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

  const onFinish = (values: any) => {
    saveSupportPaySms({
      bookingType: 'flight',
      bookingId: dataModal?.item?.id,
      phoneNumber: values?.phone,
      smsContent: values?.note,
      bankId: values?.payMent,
    });
  };

  const isShowPaymentGuide =
    booking?.status && booking?.status != 'success' && booking?.status != 'completed';
  if (!isShowPaymentGuide)
    return messageClose('Đơn hàng này đã thanh toán thành công', handleClose);
  if (messageSupportPaySms === undefined) return <div style={{ height: 250 }} />;
  return (
    <>
      {messageSupportPaySms ? (
        messageClose(messageSupportPaySms, handleClose)
      ) : (
        <Form
          form={form}
          scrollToFirstError
          colon={false}
          hideRequiredMark
          className='form-modal'
          onFinish={onFinish}
        >
          <div>
            <Form.Item name='recipient' label={intl.formatMessage({ id: 'IDS_TEXT_RECIPIENT' })}>
              <Input
                allowClear
                placeholder={intl.formatMessage({ id: 'IDS_TEXT_RECIPIENT' })}
                disabled
              />
            </Form.Item>

            <Form.Item
              name='phone'
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

            <Form.Item name='payMent' label={intl.formatMessage({ id: 'IDS_TEXT_PAY' })}>
              <Select
                onChange={(valueSelect) => {
                  valueSelect &&
                    fetSupportPaySms({
                      bankId: valueSelect,
                      bookingId: dataModal?.item?.id,
                      product: 'flight',
                    });
                }}
              >
                {payMent?.map((val: some) => {
                  return (
                    <Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name='note'
              label={intl.formatMessage({ id: 'IDS_TEXT_NOTE' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <TextArea
                placeholder={intl.formatMessage({ id: 'IDS_TEXT_IMPORT_CONTENT' })}
                autoSize={{ minRows: 3, maxRows: 14 }}
              />
            </Form.Item>
          </div>
          <div className='wrapperSubmitSms'>
            <Button onClick={() => handleClose()}>
              <FormattedMessage id='IDS_TEXT_SKIP' />
            </Button>
            <Form.Item shouldUpdate className='buttonSubmit'>
              {() => (
                <Button type='primary' htmlType='submit'>
                  <FormattedMessage id='IDS_TEXT_SEND' />
                </Button>
              )}
            </Form.Item>
          </div>
        </Form>
      )}
    </>
  );
};

export default ContentSmsPayment;
