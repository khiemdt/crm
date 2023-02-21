import { Button, Form, InputNumber, message, Modal } from 'antd';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { purchasingFlight } from '~/apis/flight';
import '~/features/flight/components/modal/modal.scss';
import { some } from '~/utils/constants/constant';
import { formatMoney } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';

interface Props {
  modal: boolean;
  setModal: any;
}

let valueTemps = {};

const ModalOriginTicket: React.FC<Props> = (props) => {
  const { modal, setModal } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const temps = {
    outbound: {
      total_net_price: booking.ticket?.outbound?.totalNetPrice,
      total_net_price_adult: booking.ticket?.outbound?.totalNetPriceAdult,
      total_net_price_child: booking.ticket?.outbound?.totalNetPriceChild,
      total_net_price_infant: booking.ticket?.outbound?.totalNetPriceInfant,
      numAdults: booking.numAdults,
      numChildren: booking.numChildren,
      numInfants: booking.numInfants,
    },
    inbound: {
      total_net_price: booking?.ticket?.inbound?.totalNetPrice,
      total_net_price_adult: booking?.ticket?.inbound?.totalNetPriceAdult,
      total_net_price_child: booking?.ticket?.inbound?.totalNetPriceChild,
      total_net_price_infant: booking?.ticket?.inbound?.totalNetPriceInfant,
      numAdults: booking.numAdults,
      numChildren: booking.numChildren,
      numInfants: booking.numInfants,
    },
  };
  const purchasing = async (queryParams = {}) => {
    try {
      const { data } = await purchasingFlight(queryParams, booking.id);
      if (data.code === 200) {
        message.success(intl.formatMessage({ id: 'IDS_TEXT_UPDATE_PRICE_SUCCESS' }));
        handleCancel();
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setModal(false);
  };
  const onFinish = (values: some) => {
    purchasing(values);
  };
  useEffect(() => {
    form.setFieldsValue(temps);
    valueTemps = temps;
  }, [booking]);

  return (
    <Modal
      className='wrapperModal'
      visible={modal}
      onCancel={handleCancel}
      footer={false}
      width={450}
    >
      <span className='title'>Cập nhật thay đổi giá vé máy bay</span>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        hideRequiredMark
        layout='horizontal'
        onFinish={onFinish}
        className='form-origin-ticket'
      >
        <div style={{ paddingTop: 10 }}>
          <b>Tổng giá vé gốc chiều đi: {formatMoney(temps?.outbound?.total_net_price)} </b>
          <Form.Item
            name={['outbound', 'total_net_price_adult']}
            label='Giá người lớn:'
            rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
          >
            <InputNumber
              type='text'
              formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_SUBJECT' })}
            />
          </Form.Item>
          {booking.numChildren > 0 && (
            <Form.Item
              name={['outbound', 'total_net_price_child']}
              label='Giá trẻ em:'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <InputNumber
                type='text'
                formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_SUBJECT' })}
              />
            </Form.Item>
          )}
          {booking.numInfants > 0 && (
            <Form.Item
              name={['outbound', 'total_net_price_infant']}
              label='Giá em bé:'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <InputNumber
                type='text'
                formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_SUBJECT' })}
              />
            </Form.Item>
          )}
        </div>
        {booking?.inbound && (
          <div>
            <b>Tổng giá vé gốc chiều về: {formatMoney(temps?.inbound?.total_net_price)} </b>
            <Form.Item
              name={['inbound', 'total_net_price_adult']}
              label='Giá người lớn:'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <InputNumber
                type='text'
                formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_SUBJECT' })}
              />
            </Form.Item>
            {booking.numChildren > 0 && (
              <Form.Item
                name={['inbound', 'total_net_price_child']}
                label='Giá trẻ em:'
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                ]}
              >
                <InputNumber
                  type='text'
                  formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_SUBJECT' })}
                />
              </Form.Item>
            )}
            {booking.numInfants > 0 && (
              <Form.Item
                name={['inbound', 'total_net_price_infant']}
                label='Giá em bé:'
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                ]}
              >
                <InputNumber
                  type='text'
                  formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_SUBJECT' })}
                />
              </Form.Item>
            )}
          </div>
        )}
        <div className='wrapperSubmitSms'>
          <Button onClick={() => handleCancel()}>
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
    </Modal>
  );
};
export default ModalOriginTicket;
