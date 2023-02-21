import { Button, Col, DatePicker, Form, InputNumber, message, Row, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { findBankTransferRequest } from '~/apis/tools';
import { IconCalendar } from '~/assets';
import { findTransferStatus } from '~/features/payment_support/constant';
import { some } from '~/utils/constants/constant';
import { DATE_FORMAT_FRONT_END, DATE_TIME_FORMAT } from '~/utils/constants/moment';
import { formatMoney, getPaymentStatusHotel } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
const BankTransferPaymentRequest: React.FunctionComponent = () => {
  const [form] = Form.useForm();
  const [listBankRef, setListBankPaymentRef] = useState<some[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const intl = useIntl();

  const onFinish = async (values: any) => {
    setLoading(true);
    const timeResult = moment(values.fromDate).format(DATE_FORMAT_FRONT_END);
    try {
      const dataDto = {
        ...values,
        fromDate: moment(timeResult, DATE_TIME_FORMAT).unix() * 1000,
      };
      const { data } = await findBankTransferRequest(dataDto);
      if (data.code === 200) {
        setListBankPaymentRef(data.data);
      } else {
        message.error(data.message);
      }
      setLoading(false);
    } catch (error) {}
  };

  const columns: ColumnsType<some> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'UserId',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'BookingCode',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
    },
    {
      title: 'Mã giao dịch	',
      dataIndex: 'transactionCode',
      key: 'transactionCode',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => {
        return <b className='text-success'>{formatMoney(text)}</b>;
      },
    },
    {
      title: 'Thời gian tạo	',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (text) => {
        return <div>{moment(text).format(DATE_TIME_FORMAT)}</div>;
      },
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const status = getPaymentStatusHotel(text);
        return <Tag color={status.color}>{`${status?.title}`}</Tag>;
      },
    },
  ];

  return (
    <div>
      <div>
        <Form
          form={form}
          scrollToFirstError
          colon={false}
          initialValues={{
            amount: null,
            threshold: null,
            fromDate: moment(),
          }}
          onFinish={onFinish}
        >
          <Row justify='start' wrap={false} gutter={10}>
            <Col span={6}>
              <Form.Item
                name={'amount'}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                ]}
              >
                <InputNumber
                  type='text'
                  formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_PRICE' })}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={'threshold'}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                ]}
              >
                <InputNumber
                  type='text'
                  formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_GAP' })}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name='fromDate'
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                ]}
              >
                <DatePicker
                  format={DATE_FORMAT_FRONT_END}
                  placeholder='Từ ngày'
                  allowClear
                  suffixIcon={<IconCalendar />}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='fromDate'>
                <Button
                  loading={loading}
                  htmlType='submit'
                  type='primary'
                  shape='round'
                  className='submit-button'
                >
                  Tìm kiếm
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={listBankRef}
        loading={loading}
        pagination={false}
      />
    </div>
  );
};
export default BankTransferPaymentRequest;
