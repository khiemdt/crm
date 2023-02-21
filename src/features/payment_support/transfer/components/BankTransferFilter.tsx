import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import moment from 'moment';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconCalendar, IconRefreshGrayrice } from '~/assets';
import { itemListCA } from '~/components/popover/Modal';
import PopoverSelectCA from '~/components/popover/PopoverSelectCA';
import { MAIN_MODULE, some, TIME_OUT_QUERY_API_FLIGHT_SEARCH } from '~/utils/constants/constant';
import { DATE_FORMAT_BACK_END, DATE_FORMAT_FRONT_END } from '~/utils/constants/moment';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { TRANSFER_STATUS_LIST } from '../../constant';
import { fetGetBankTransfer } from '../../PaymentSlice';

let timeoutSearch: any = null;
interface IFlightRefundFilterProps {
  listBank: itemListCA[];
}

const BankTransferFilter: React.FunctionComponent<IFlightRefundFilterProps> = ({ listBank }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const intl = useIntl();
  let location = useLocation();

  const { flightRefundPaging, isLoading, statusList }: some = useAppSelector(
    (state) => state.approvalReducer,
  );
  const [form] = Form.useForm();
  const initValue = {
    statuses: [],
    bookingId: null,
    caIds: [],
    fromDate: null,
    toDate: null,
    freeText: null,
    bankIds: [] || null,
    transactionCode: null,
    module: null,
    bookingCode: null,
  };

  const handleFetDataChangeField = (formData: some = {}) => {
    dispatch(fetGetBankTransfer({ formData: formData, isFilter: true, ...flightRefundPaging }));
  };

  const handleChangeField = (key: string, values: string[] | some) => {
    form.setFieldsValue({ [key]: values });
    const formValue = { ...form.getFieldsValue(true) };
    const {
      statuses,
      bookingId,
      fromDate,
      toDate,
      freeText,
      bankIds,
      transactionCode,
      module,
      bookingCode,
    } = formValue;

    const formData: any = {
      bankIds: !isEmpty(bankIds) ? [bankIds?.value] : [],
      bookingId,
      fromDate: fromDate ? moment(fromDate).format(DATE_FORMAT_BACK_END) : null,
      toDate: toDate ? moment(toDate).format(DATE_FORMAT_BACK_END) : null,
      statuses: key === 'statuses' ? values : statuses,
      freeText,
      transactionCode,
      module,
      bookingCode,
      ...flightRefundPaging,
    };
    handleFetDataChangeField(formData);
  };

  const handleSearch = (allValues: some) => {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      dispatch(fetGetBankTransfer({ formData: allValues, isFilter: true, ...flightRefundPaging }));
    }, TIME_OUT_QUERY_API_FLIGHT_SEARCH);
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutSearch);
    };
  }, []);

  return (
    <div className='fl-approval-filter-container'>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        className='fl-approval-filter-form'
        initialValues={initValue}
        onFinish={(values) => {
          handleSearch({
            ...values,
            fromDate: values?.fromDate
              ? moment(values?.fromDate).format(DATE_FORMAT_BACK_END)
              : null,
            toDate: values?.toDate ? moment(values?.toDate).format(DATE_FORMAT_BACK_END) : null,
          });
        }}
        onValuesChange={(__, allvaluse) => {
          handleSearch({
            ...allvaluse,
            fromDate: allvaluse?.fromDate
              ? moment(allvaluse?.fromDate).format(DATE_FORMAT_BACK_END)
              : null,
            toDate: allvaluse?.toDate
              ? moment(allvaluse?.toDate).format(DATE_FORMAT_BACK_END)
              : null,
          });
        }}
      >
        <Row justify='start' wrap={false}>
          <Col span={18}>
            <Row justify='start' wrap={false} gutter={10}>
              <Col span={6}>
                <Form.Item
                  name={'bookingId'}
                  rules={[
                    {
                      pattern: /^[0-9+]*$/,
                      message: 'Mã đơn hàng không hợp lệ',
                    },
                  ]}
                >
                  <InputNumber
                    controls={false}
                    placeholder={intl.formatMessage({ id: 'IDS_TEXT_ORDER_CODE' })}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={'transactionCode'}>
                  <Input placeholder={intl.formatMessage({ id: 'IDS_TEXT_TRANSACTION_CODE' })} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={'bookingCode'}>
                  <Input
                    placeholder={intl.formatMessage({ id: 'IDS_TEXT_TRANSFER_BOOKING_CODE' })}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={'freeText'}>
                  <Input placeholder={intl.formatMessage({ id: 'IDS_TEXT_TRANSFER_CONTENT' })} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <div style={{ display: 'flex' }}>
                  <Button
                    className='fl-approval-icon-button'
                    style={{ marginTop: 4 }}
                    onClick={() => {
                      form.resetFields();
                      handleFetDataChangeField(initValue);
                    }}
                    loading={isLoading}
                    icon={<IconRefreshGrayrice className='fl-approval-icon' />}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify='start' wrap={false}>
          <Col span={18}>
            <Row justify='start' wrap={false} gutter={10}>
              <Col span={6}>
                <Form.Item name='fromDate'>
                  <DatePicker
                    format={DATE_FORMAT_FRONT_END}
                    placeholder='Từ ngày'
                    allowClear
                    suffixIcon={<IconCalendar />}
                    className='fl-approval-date-picker'
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='toDate'>
                  <DatePicker
                    format={DATE_FORMAT_FRONT_END}
                    placeholder='Đến ngày'
                    allowClear
                    suffixIcon={<IconCalendar />}
                    className='fl-approval-date-picker'
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='statuses'
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.statuses !== curValues.statuses
                  }
                >
                  <PopoverSelectCA
                    listItem={TRANSFER_STATUS_LIST}
                    value={form.getFieldValue('statuses')}
                    handleSelected={(idSelecteds: string[]) => {
                      handleChangeField('statuses', idSelecteds);
                    }}
                    title='IDS_TEXT_STATUS'
                    className='customer-btn-selected'
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='module'>
                  <Select className='fl-approval-select' placeholder='Dịch vụ' allowClear>
                    {MAIN_MODULE.map((elm: some, index: number) => {
                      return (
                        <Select.Option key={index} value={elm.id}>
                          {elm?.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='bankIds'>
                  <PopoverSelectCA
                    listItem={listBank}
                    value={form.getFieldValue('bankIds')}
                    handleSelected={(idSelecteds: string[]) => {
                      handleChangeField('bankIds', idSelecteds);
                    }}
                    title='IDS_TEXT_BANK'
                    className='customer-btn-selected'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BankTransferFilter;
