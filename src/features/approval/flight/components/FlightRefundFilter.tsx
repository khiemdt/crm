import { Button, Checkbox, Col, DatePicker, Form, InputNumber, Row, Select } from 'antd';
import moment from 'moment';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { IconCalendar, IconRefreshGrayrice } from '~/assets';
import { itemListCA, ItemListOptionFilterFlight } from '~/components/popover/Modal';
import PopoverSelect from '~/components/popover/PopoverSelect';
import PopoverSelectCA from '~/components/popover/PopoverSelectCA';
import { AllowAgentType } from '~/features/flight/flightSlice';
import { AirlinesType } from '~/features/systems/systemSlice';
import { some, TIME_OUT_QUERY_API_FLIGHT_SEARCH } from '~/utils/constants/constant';
import { DATE_FORMAT_BACK_END, DATE_FORMAT_FRONT_END } from '~/utils/constants/moment';
import { isEmpty, removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { fetFlightRefundBookings } from '../../approvalSlice';
import { FLIGHT_APPROVAL_STATUS, FLIGHT_REFUND_STATUS } from '../constant';

interface IFlightRefundFilterProps {
  providerList: [];
}

let timeoutSearch: any = null;

const FlightRefundFilter: React.FunctionComponent<IFlightRefundFilterProps> = ({
  providerList,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const intl = useIntl();
  let location = useLocation();
  const salesList: some[] = useAppSelector((state) => state.flightReducer.salesList);
  const allowAgents: AllowAgentType[] = useAppSelector((state) => state.systemReducer.allowAgents);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);

  const { flightRefundPaging, isLoading, statusList }: some = useAppSelector(
    (state) => state.approvalReducer,
  );
  const [form] = Form.useForm();
  const statuses: string[] = Form.useWatch('statuses', form) || [];

  const initValue = {
    statuses: !isEmpty(statusList) ? statusList : ['pending', 'approved', 'rejected'],
    bookingId: null,
    caIds: [],
    fromDate: null,
    toDate: null,
    refundTypes: null,
    airlineIds: null,
    refundToTripi: null,
    saleId: null,
    agencyIds: [],
  };
  const handleChangeRoute = (formData: object) => {
    const searchParams = removeFieldEmptyFilter(formData);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...searchParams,
        ...flightRefundPaging,
      }).toString(),
    });
  };

  const handleFetDataChangeField = (formData: some = {}) => {
    handleChangeRoute(formData);
    dispatch(
      fetFlightRefundBookings({ formData: formData, isFilter: true, ...flightRefundPaging }),
    );
  };

  const handleChangeField = (key: string, values: string[] | some) => {
    form.setFieldsValue({ [key]: values });
    const formValue = { ...form.getFieldsValue(true) };
    const {
      bookingId,
      caIds,
      fromDate,
      toDate,
      refundTypes,
      refundToTripi,
      saleId,
      agencyIds,
      statuses,
      airlineIds,
    } = formValue;

    const refundType = FLIGHT_APPROVAL_STATUS?.find(
      (elm: some) => elm.id === refundTypes?.value,
    )?.refundType;

    const formData: any = {
      caIds: key === 'caIds' ? values : caIds,
      airlineIds: !isEmpty(airlineIds) ? [airlineIds?.value] : [],
      agencyIds: key === 'agencyIds' ? values : agencyIds,
      bookingId,
      fromDate: fromDate ? moment(fromDate).format(DATE_FORMAT_BACK_END) : null,
      toDate: toDate ? moment(toDate).format(DATE_FORMAT_BACK_END) : null,
      refundTypes: !isEmpty(refundType) ? [refundType] : [],
      refundToTripi,
      saleId,
      statuses,
      ...flightRefundPaging,
    };
    handleFetDataChangeField(formData);
  };

  const handleSearch = (allValues: some) => {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      handleChangeRoute(allValues);
      dispatch(
        fetFlightRefundBookings({ formData: allValues, isFilter: true, ...flightRefundPaging }),
      );
    }, TIME_OUT_QUERY_API_FLIGHT_SEARCH);
  };

  React.useEffect(() => {
    form.setFieldsValue({ statuses: statusList });
  }, [form, statusList]);

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
        hideRequiredMark
        className='fl-approval-filter-form'
        initialValues={initValue}
        onFinish={(values) => {
          const refundType = FLIGHT_APPROVAL_STATUS?.find(
            (elm: some) => elm.id === values?.refundTypes?.value,
          );
          handleSearch({
            ...values,
            fromDate: values?.fromDate
              ? moment(values?.fromDate).format(DATE_FORMAT_BACK_END)
              : null,
            toDate: values?.toDate ? moment(values?.toDate).format(DATE_FORMAT_BACK_END) : null,
            refundTypes: !isEmpty(refundType) ? [refundType?.refundType] : [],
            types: !isEmpty(refundType) ? [refundType?.type] : [],
            saleId: Number(values?.saleId?.value),
            airlineIds: !isEmpty(values?.airlineIds) ? [values?.airlineIds?.value] : [],
          });
        }}
      >
        <Row justify='start' gutter={10}>
          <Col span={12}>
            <Row justify='start' gutter={10}>
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
                <Form.Item name='refundTypes'>
                  <Select
                    className='fl-approval-select'
                    placeholder='Loại hoàn hủy'
                    allowClear
                    dropdownStyle={{ width: 350, minWidth: 350 }}
                    showSearch
                    labelInValue
                  >
                    {FLIGHT_APPROVAL_STATUS.map((elm: some, index: number) => {
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
                <Form.Item name='fromDate'>
                  <DatePicker
                    format={DATE_FORMAT_FRONT_END}
                    placeholder='Phát sinh từ'
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
                    placeholder='Đến'
                    allowClear
                    suffixIcon={<IconCalendar />}
                    className='fl-approval-date-picker'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ display: 'flex' }}>
            <Form.Item
              name='statuses'
              label='Trạng thái'
              shouldUpdate={(prevValues, curValues) => prevValues.statuses !== curValues.statuses}
            >
              {FLIGHT_REFUND_STATUS?.map((elm: some) => {
                const isActive: boolean = statuses?.includes(elm.id);
                return (
                  <Button
                    key={elm.id}
                    type={isActive ? 'primary' : 'ghost'}
                    shape='round'
                    className='status-button'
                    onClick={() => {
                      if (statuses?.includes(elm.id)) {
                        form.setFieldsValue({
                          statuses: statuses.filter((el: string) => el !== elm.id),
                        });
                      } else {
                        form.setFieldsValue({
                          statuses: [...statuses, elm.id],
                        });
                      }
                    }}
                  >
                    {elm?.label}
                  </Button>
                );
              })}
            </Form.Item>
            <Form.Item name='refundToTripi' valuePropName='checked'>
              <Checkbox style={{ marginLeft: 20, whiteSpace: 'nowrap' }}>Hoàn về Tripi</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='start' gutter={10}>
          <Col span={12}>
            <Row justify='start' gutter={10}>
              <Col span={6}>
                <Form.Item name='saleId'>
                  <Select
                    dropdownStyle={{ width: 220, minWidth: 220 }}
                    placeholder='Người yêu cầu'
                    allowClear
                    className='fl-approval-select'
                    showSearch
                    labelInValue
                    optionFilterProp='children'
                  >
                    {salesList.map((elm: some, index: number) => {
                      return (
                        <Select.Option key={index} value={elm?.id?.toString()}>
                          {elm?.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='airlineIds'>
                  <Select
                    placeholder='Hãng bay'
                    dropdownStyle={{ width: 180, minWidth: 180 }}
                    allowClear
                    className='fl-approval-select'
                    showSearch
                    labelInValue
                    optionFilterProp='children'
                  >
                    {airlines.map((elm: some, index: number) => {
                      return (
                        <Select.Option key={index} value={elm?.id?.toString()}>
                          {elm?.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='caIds'>
                  <PopoverSelectCA
                    listItem={allowAgents}
                    value={form.getFieldValue('caIds')}
                    handleSelected={(idSelecteds: string[]) => {
                      handleChangeField('caIds', idSelecteds);
                    }}
                    title='IDS_TEXT_CA'
                    className='customer-btn-selected'
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='agencyIds'>
                  <PopoverSelectCA
                    listItem={providerList.map((el: itemListCA) => ({
                      ...el,
                      name: `${el.code} - ${el.name}`,
                    }))}
                    value={form.getFieldValue('agencyIds')}
                    handleSelected={(idSelecteds: string[]) => {
                      console.log('idSelecteds', idSelecteds);
                      handleChangeField('agencyIds', idSelecteds);
                    }}
                    title='IDS_TEXT_SUPPLIER'
                    className='customer-btn-selected'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex' }}>
              <Form.Item>
                <Button
                  loading={isLoading}
                  htmlType='submit'
                  type='primary'
                  shape='round'
                  className='submit-button'
                >
                  Tìm kiếm
                </Button>
              </Form.Item>
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
      </Form>
    </div>
  );
};

export default FlightRefundFilter;
