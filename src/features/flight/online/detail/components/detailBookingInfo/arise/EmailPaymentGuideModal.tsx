import { Button, Form, Input, message, Modal, Select } from 'antd';
import { CKEditor } from 'ckeditor4-react';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { getPaymentGuideEmail, sendEmail } from '~/apis/flight';
import { IconCloseOutline } from '~/assets';
import { RULES_REGEXP_EMAIL, SETTING_INIT_CKEDITOR } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
let valueTemps = {};
const childrenTagEmail: React.ReactNode[] = [];
interface Props {
  open: boolean;
  handleClose: () => void;
  typeModal?: string;
  item: some;
}

const EmailPaymentGuideModal: React.FC<Props> = (props: any) => {
  const { open, handleClose, item } = props;
  const [editor, setEditor] = useState<string | undefined>(undefined);
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const intl = useIntl();
  const [form] = Form.useForm();
  const { id } = useParams();
  const isDataForm = isEmpty(form.getFieldsValue(true));

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

  const fetSupportPayBankTransMail = async (queryParams = {}) => {
    try {
      const { data } = await getPaymentGuideEmail(queryParams);
      if (data.code === 200) {
        if (!isEmpty(data?.data)) {
          setEditor(data?.data?.bodyHtml);
          const temps = {
            ...data?.data,
            emails: [data?.data?.emailAddress],
          };
          form.setFieldsValue(temps);
          valueTemps = temps;
        }
      } else {
        setEditor(undefined);
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetSendEmail = async (queryParams = {}) => {
    try {
      const { data } = await sendEmail(queryParams);
      if (data.code === 200) {
        message.success(intl.formatMessage({ id: 'IDS_TEXT_EMAIL_SENT_SUCCESS' }));
        handleClose();
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = (values: any) => {
    editor &&
      fetSendEmail({
        emails: values?.emails,
        caId: booking.caInfo?.id,
        htmlContent: editor,
        subject: values?.subject,
      });
  };

  useEffect(() => {
    if (open) {
      setEditor(undefined);
      fetSupportPayBankTransMail({
        bookingCode: 'F' + id + 'PP' + item.id,
      });
    }
  }, [open]);
  return (
    <Modal
      closeIcon={<IconCloseOutline />}
      className='wrapperModal'
      visible={open}
      onCancel={handleClose}
      footer={false}
      width={900}
    >
      <h2 style={{ fontSize: '16px', marginBottom: 14 }}>
        <FormattedMessage id='IDS_TEXT_PAYMENT_GUIDE' />
      </h2>
      {editor && (
        <Form
          form={form}
          scrollToFirstError
          colon={false}
          hideRequiredMark
          className='form-modal'
          onFinish={onFinish}
        >
          <div>
            <Form.Item
              name='emails'
              label={intl.formatMessage({ id: 'IDS_TEXT_RECIPIENT' })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const isEmail = value
                      ?.map((val: string) => val.match(RULES_REGEXP_EMAIL))
                      ?.includes(null);
                    if (!isEmail) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'IDS_TEXT_EMAIL_INVALIDATE' })),
                      );
                    }
                  },
                }),
              ]}
            >
              <Select
                disabled={isDataForm}
                mode='tags'
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({ id: 'IDS_TEXT_RECIPIENT' })}
              >
                {childrenTagEmail}
              </Select>
            </Form.Item>

            <Form.Item
              name='subject'
              label={intl.formatMessage({ id: 'IDS_TEXT_SUBJECT' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <Input
                disabled={isDataForm}
                allowClear
                placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_SUBJECT' })}
              />
            </Form.Item>
            <div style={{ marginBottom: 24 }}>
              <CKEditor
                initData={editor}
                onChange={(evt: any) => setEditor(evt.editor.getData())}
                config={SETTING_INIT_CKEDITOR}
              />
            </div>
          </div>
          <div className='wrapperSubmitSms'>
            <Button onClick={() => handleClose()}>
              <FormattedMessage id='IDS_TEXT_SKIP' />
            </Button>
            <Form.Item shouldUpdate className='buttonSubmit'>
              {() => (
                <Button disabled={isDataForm} type='primary' htmlType='submit'>
                  <FormattedMessage id='IDS_TEXT_SEND' />
                </Button>
              )}
            </Form.Item>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default EmailPaymentGuideModal;
