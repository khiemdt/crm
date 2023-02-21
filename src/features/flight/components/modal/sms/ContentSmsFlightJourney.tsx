import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getConfirmationSms, sendSmsToCustomer } from '~/apis/flight';
import MessageNotDataModel from '~/features/flight/components/modal/MessageNotDataModel';
import { RULES_REGEXP_PHONE } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';

const { TextArea } = Input;

interface Props {
  handleClose: () => void;
  dataModal: some;
}

let valueTemps = {};
const ContentSmsFlightJourney: React.FC<Props> = ({ handleClose, dataModal }) => {
  const intl = useIntl();

  const [form] = Form.useForm();
  const [customer, setCustomer] = useState<some | undefined>(undefined);

  const fetConfirmationSms = async (queryParams: object) => {
    try {
      const { data } = await getConfirmationSms(queryParams);
      if (data.code === 200) {
        if (!isEmpty(data?.data)) {
          setCustomer(data?.data);
          form.setFieldsValue(data?.data);
          valueTemps = {
            ...valueTemps,
            ...data?.data,
          };
        } else {
          setCustomer({});
          message.error(data?.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (dataModal?.item?.caInfo?.id) {
      fetConfirmationSms({
        bookingType: 'flight',
        bookingId: dataModal?.item?.id,
      });
    }
  }, [dataModal]);

  const sendSmsCustomer = async (queryParams = {}) => {
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

  const onFinish = (values: any) => {
    sendSmsCustomer({
      bookingType: 'flight',
      bookingId: dataModal?.item?.id,
      phoneNumber: values?.customerPhoneNumber,
      smsContent: values?.messageContent,
    });
  };

  if (customer === undefined) return <div style={{ height: 250 }} />;
  return (
    <>
      {!isEmpty(customer) ? (
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
                      phoneNumber?.toString()?.length < 12 &&
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
              <Input placeholder={intl.formatMessage({ id: 'IDS_TEXT_PHONE' })} />
            </Form.Item>

            <Form.Item
              name='messageContent'
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
                <Button
                  type='primary'
                  htmlType='submit'
                >
                  <FormattedMessage id='IDS_TEXT_SEND' />
                </Button>
              )}
            </Form.Item>
          </div>
        </Form>
      ) : (
        <div>
          <MessageNotDataModel />
          <div className='wrapperSubmitSms'>
            <Button onClick={() => handleClose()}>
              <FormattedMessage id='IDS_TEXT_SKIP' />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentSmsFlightJourney;
