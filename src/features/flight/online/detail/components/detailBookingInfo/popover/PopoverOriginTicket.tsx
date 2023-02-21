import { Button, Form, Input, Popover, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { IconCloseOutline, IconEdit, IconInfoHover } from '~/assets';
import { some } from '~/utils/constants/constant';
import { formatMoney } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';

interface InOutBoundType {
  title: string;
  content: some;
  ticket?: object;
}

const PopoverOriginTicket: FC<InOutBoundType> = (props: some) => {
  const { title, content, ticket } = props;
  const [originTicket, setOriginTicket] = useState(ticket);

  const intl = useIntl();

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const hide = () => {
    setVisible(false);
    setOriginTicket({ ...booking });
  };
  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };
  useEffect(() => {
    setOriginTicket({ ...booking });
    console.log(originTicket);
  }, []);

  const onFinish = (values: any) => {
    console.log(values);
  };
  const items = (
    <>
      <div className='popover-ct-info'>
        <Row className='popover-ct-title'>
          <b>{title}</b>
          <IconCloseOutline onClick={hide} style={{ cursor: 'pointer' }} />
        </Row>
        <Form form={form} scrollToFirstError colon={false} hideRequiredMark onFinish={onFinish}>
          <b>
            Tổng giá vé gốc chiều đi: {formatMoney(originTicket?.ticket?.inbound?.totalNetPrice)}
          </b>
          <Form.Item
            name='note'
            label='Giá người lớn:'
            rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
          >
            <Input
              defaultValue={originTicket?.ticket?.inbound?.totalNetPrice}
              suffix={'x ' + originTicket?.numAdults + ' người lớn'}
              style={{ width: '100%' }}
              placeholder={intl.formatMessage({ id: 'IDS_TEXT_RECIPIENT' })}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
            <Button htmlType='button'>Reset</Button>
            <Button type='link' htmlType='button'>
              Fill form
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
  return (
    <Popover
      content={items}
      placement='leftTop'
      trigger='click'
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <IconEdit className='pointer' />
    </Popover>
  );
};
export default PopoverOriginTicket;
