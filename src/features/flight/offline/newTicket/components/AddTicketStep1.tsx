import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  addNewFlightSearchRequestOffline,
  getFlightSearchRequestCreatorBody,
  getGeneralInfo,
  getOfflineFlightSearching,
  searchUsers,
  updateOflineSearchingInfo,
} from '~/apis/flight';
import { IconArrow2way, IconCalendar, IconChevronDown } from '~/assets';
import { FORMAT_DATE_BACKEND, SUCCESS_CODE } from '~/features/flight/constant';
import { AllowAgentType } from '~/features/flight/flightSlice';
import {
  LAST_DATA_BOOKING_FLIGHT_OFFLINE,
  routes,
  some,
  TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD,
} from '~/utils/constants/constant';
import { DATE_FORMAT_FRONT_END } from '~/utils/constants/moment';
import { isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
import { purchaseTypes, PURCHASE_TYPES } from '../../constant';
const { RangePicker } = DatePicker;
const { Option } = Select;

let timeoutSearch: any = null;
let historyId: any = null;
let paymentMethodName: any = null;
let paymentMethodsListP: any = [];
let paymentMethodsListB: any = [];

const AddTicketStep1 = () => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [paymentMethodsList, setPaymentMethodsList] = useState<some[]>([]);
  const [disableCorporate, setDisableCorporate] = useState<boolean>(true);

  const allowAgents: AllowAgentType[] = useAppSelector((state) => state.systemReducer.allowAgents);

  const onFinish = (values: some) => {
    const dataDTO: some = {
      ...values,
      departureDate: values.oneWay
        ? moment(values.date[0]).format(FORMAT_DATE_BACKEND)
        : moment(values.departureDate).format(FORMAT_DATE_BACKEND),
      returnDate: values.oneWay ? moment(values.date[1]).format(FORMAT_DATE_BACKEND) : null,
      oneWay: !values.oneWay,
      processingTime: moment(values.processingTime).format(FORMAT_DATE_BACKEND),
      reservedCodes: [],
      purchaseType: values.supportPurchaseType ? PURCHASE_TYPES.BUSINESS : PURCHASE_TYPES.PERSONAL,
    };
    delete dataDTO.date;
    if (dataDTO.isEdit) {
      editFlightSearchRequest({
        ...dataDTO,
        id: historyId,
      });
    } else {
      addNewFlightSearchRequest(dataDTO);
    }
  };

  const addNewFlightSearchRequest = async (dataDTO: some) => {
    try {
      const { data } = await addNewFlightSearchRequestOffline(dataDTO);
      if (data.code === SUCCESS_CODE) {
        let dataBookingOffline: any = localStorage.getItem(LAST_DATA_BOOKING_FLIGHT_OFFLINE);
        dataBookingOffline = !isEmpty(dataBookingOffline)
          ? JSON.parse(dataBookingOffline || '')
          : {};
        dataBookingOffline = {
          ...data.data,
          paymentMethodId: dataDTO.paymentMethodId,
        };
        localStorage.setItem(LAST_DATA_BOOKING_FLIGHT_OFFLINE, JSON.stringify(dataBookingOffline));
        navigate({
          pathname: location.pathname,
          search: createSearchParams({
            ...data.data,
          }).toString(),
        });
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editFlightSearchRequest = async (dataDTO: some) => {
    try {
      const { data } = await updateOflineSearchingInfo(dataDTO);
      if (data.code === SUCCESS_CODE) {
        let dataBookingOffline: any = localStorage.getItem(LAST_DATA_BOOKING_FLIGHT_OFFLINE);
        dataBookingOffline = !isEmpty(dataBookingOffline)
          ? JSON.parse(dataBookingOffline || '')
          : {};
        const isKeep = dataBookingOffline.historyId == historyId;
        const dataTemp = isKeep ? dataBookingOffline : {};
        dataBookingOffline = {
          ...dataTemp,
          ...data.data,
          historyId,
          paymentMethodId: dataDTO.paymentMethodId,
        };
        localStorage.setItem(LAST_DATA_BOOKING_FLIGHT_OFFLINE, JSON.stringify(dataBookingOffline));
        navigate({
          pathname: location.pathname,
          search: createSearchParams({
            ...data.data,
            historyId,
            paymentMethodId: dataDTO.paymentMethodId,
          }).toString(),
        });
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  const fetUsers = async (searchText: string) => {
    const dataDTO = {
      caId: form.getFieldValue('caId'),
      size: 5,
      term: searchText,
    };
    try {
      const { data } = await searchUsers(dataDTO);
      if (data.code === SUCCESS_CODE) {
        if (!data.data?.length && form.getFieldValue('caId') == '17') {
          data?.data?.push({
            id: null,
            name: 'User chưa đăng ký',
            phoneNumber: undefined,
            email: undefined,
          });
        }
        const arr = data.data?.map((el: some, idx: number) => {
          return {
            value: `${el.name} - ${el.phoneNumber || 'không có'} - ${el.email || 'không có'}`,
            label: (
              <Row
                className='option-item-user'
                style={{
                  borderBottom: idx + 1 !== options.length ? '1px solid #d9d9d9' : 'none',
                }}
                gutter={0}
              >
                <Col span={3} className=''>
                  {el.id}
                </Col>
                <Col span={7}>{el.name}</Col>
                <Col span={3}>{el.phoneNumber || ''}</Col>
                <Col span={8}>{el.email || ''}</Col>
                <Col span={3}>{el.isCorporate ? 'TK công ty' : ''}</Col>
              </Row>
            ),
            key: el.id,
            isCorporate: el.isCorporate,
            phoneNumber: el.phoneNumber,
          };
        });
        setOptions(arr);
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  const onSelect = (value: some, op: some) => {
    form.setFieldsValue({
      userId: op.key,
      isCorporate: op.isCorporate,
      supportPurchaseType: false,
      phoneNumber: op.phoneNumber,
      disableCorporate: true,
    });
    setDisableCorporate(!op.isCorporate);
    handlePaymentMethodList();
  };

  const onSearch = (searchText: string) => {
    if (!form.getFieldValue('caId')) {
      message.error('Cần chọn CA');
      return;
    }
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      fetUsers(searchText);
    }, TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD);
  };

  const handleSearchPaymentMenthod = async (caId: any) => {
    paymentMethodsListB = [];
    paymentMethodsListP = [];
    try {
      const { data } = await getGeneralInfo({ caId });
      if (data.code === 200) {
        const paymentMethodsListTEmp = data.data.paymentMethodsList || [];
        paymentMethodsListTEmp?.forEach((element: some) => {
          if (
            element?.supportPurchaseTypes?.includes(PURCHASE_TYPES.PERSONAL) ||
            !element?.supportPurchaseTypes
          ) {
            paymentMethodsListP.push(element);
          }
          if (
            element?.supportPurchaseTypes?.includes(PURCHASE_TYPES.BUSINESS) ||
            !element?.supportPurchaseTypes
          ) {
            paymentMethodsListB.push(element);
          }
        });
        const itemPayment = paymentMethodsListTEmp.find(
          (el: some) => el.code === paymentMethodName,
        );
        if (!isEmpty(itemPayment)) {
          form.setFieldsValue({
            paymentMethodId: itemPayment.id,
          });
        }
        setPaymentMethodsList(
          form.getFieldValue('supportPurchaseType') ? paymentMethodsListB : paymentMethodsListP,
        );
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  const fetDataFlightSearch = async (value: any) => {
    try {
      const { data } = await getOfflineFlightSearching({ bookingOfflineHistoryId: value });
      if (data.code === 200) {
        fetFlightSearchRequestCreatorBody(data.data.id);
      } else {
      }
    } catch (error) {}
  };

  const fetFlightSearchRequestCreatorBody = async (value: any) => {
    try {
      const { data } = await getFlightSearchRequestCreatorBody({ searchRequestId: value });
      if (data.code === 200) {
        const dataRes = data.data;
        handleSearchPaymentMenthod(dataRes?.caInfo?.id);
        let dataBookingOffline: any = localStorage.getItem(LAST_DATA_BOOKING_FLIGHT_OFFLINE);
        dataBookingOffline = !isEmpty(dataBookingOffline)
          ? JSON.parse(dataBookingOffline || '')
          : {};
        let paymentMethodIdTemp = null;
        if (
          historyId === dataBookingOffline.historyId &&
          !isEmpty(dataBookingOffline.paymentMethodId)
        ) {
          paymentMethodIdTemp = parseInt(dataBookingOffline.paymentMethodId);
        }
        form.setFieldsValue({
          processingTime: moment(dataRes.processingTime, 'DD-MM-YYYY'),
          fromAirport: dataRes.fromAirport,
          toAirport: dataRes.toAirport,
          oneWay: !dataRes.oneWay,
          departureDate: moment(dataRes.departureDate, 'DD-MM-YYYY'),
          returnDate: dataRes.oneWay ? undefined : moment(dataRes.returnDate, 'DD-MM-YYYY'),
          date: dataRes.oneWay
            ? undefined
            : [
                moment(dataRes.departureDate, 'DD-MM-YYYY'),
                moment(dataRes.returnDate, 'DD-MM-YYYY'),
              ],
          numAdults: dataRes.numAdults,
          numChildren: dataRes.numChildren,
          numInfants: dataRes.numInfants,
          caId: !isEmpty(dataRes.caId) ? parseInt(dataRes.caId) : parseInt(dataRes?.caInfo?.id),
          paymentMethodId: !isEmpty(paymentMethodIdTemp)
            ? paymentMethodIdTemp
            : dataRes.paymentMethodId,
          amount: dataRes.amount,
          phoneNumber: dataRes.phoneNumber,
          userNameFormat: dataRes.userNameFormat,
          isEdit: true,
          supportPurchaseType: dataRes.purchaseType === PURCHASE_TYPES.BUSINESS,
          userId: dataRes.userId,
          isCorporate: false,
        });
        setDisableCorporate(dataRes.purchaseType === PURCHASE_TYPES.PERSONAL);
      } else {
      }
    } catch (error) {}
  };

  const handlePaymentMethodList = () => {
    form.setFieldsValue({
      paymentMethodId: undefined,
    });
    const data = form.getFieldsValue(true);
    setPaymentMethodsList(data.supportPurchaseType ? paymentMethodsListB : paymentMethodsListP);
  };

  useEffect(() => {
    for (const entry of searchParams.entries()) {
      const [param, value] = entry;
      if (param === 'historyId') {
        historyId = value;
        fetDataFlightSearch(value);
      } else if (param === 'paymentMethodName') {
        paymentMethodName = value;
      }
    }
  }, []);

  return (
    <>
      <h2>Thông tin đơn hàng offline</h2>
      <Form
        form={form}
        className='form-create-ticket'
        layout='vertical'
        scrollToFirstError
        colon={false}
        onFinish={onFinish}
        initialValues={{
          processingTime: moment(),
          fromAirport: undefined,
          toAirport: undefined,
          oneWay: false,
          departureDate: undefined,
          returnDate: undefined,
          date: undefined,
          numAdults: 1,
          numChildren: 0,
          numInfants: 0,
          caId: undefined,
          paymentMethodId: undefined,
          amount: undefined,
          phoneNumber: undefined,
          userNameFormat: undefined,
          supportPurchaseType: false,
          userId: null,
          isCorporate: false,
        }}
        onValuesChange={(changedValues, allValues) => {
          if (changedValues.caId !== undefined) {
            handleSearchPaymentMenthod(allValues.caId);
            setOptions([]);
            form.setFieldsValue({
              paymentMethodId: undefined,
              userId: undefined,
              phoneNumber: undefined,
              userNameFormat: undefined,
              supportPurchaseType: false,
              isCorporate: false,
            });
          } else if (
            changedValues.fromAirport !== undefined ||
            changedValues.toAirport !== undefined
          ) {
            form.setFieldsValue({
              fromAirport: allValues.fromAirport?.toUpperCase(),
              toAirport: allValues.toAirport?.toUpperCase(),
            });
          } else if (changedValues.supportPurchaseType !== undefined) {
            handlePaymentMethodList();
          }
        }}
      >
        <Form.Item name='isEdit' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='userId' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='phoneNumber' hidden>
          <Input />
        </Form.Item>
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item
              name='processingTime'
              label='Thời gian phát sinh'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <DatePicker
                className='itemForm'
                format={DATE_FORMAT_FRONT_END}
                placeholder={DATE_FORMAT_FRONT_END}
                allowClear={false}
                suffixIcon={<IconCalendar />}
              />
            </Form.Item>
          </Col>
          <Col span={6} style={{ position: 'relative' }}>
            <Form.Item
              name='fromAirport'
              label='Từ sân bay'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <Input className='itemForm' type='text' placeholder='Nhập'></Input>
            </Form.Item>
            <div
              className='icon-two-way'
              onClick={() =>
                form.setFieldsValue({
                  fromAirport: form.getFieldValue('toAirport'),
                  toAirport: form.getFieldValue('fromAirport'),
                })
              }
            >
              <IconArrow2way />
            </div>
          </Col>
          <Col span={6}>
            <Form.Item
              name='toAirport'
              label='Đến sân bay'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <Input className='itemForm' type='text' placeholder='Nhập'></Input>
            </Form.Item>
          </Col>
          <Col span={6} style={{ position: 'relative' }}>
            <Form.Item name='oneWay' className='form-item-way' valuePropName='checked'>
              <Switch
                className='switch-way'
                checkedChildren='Khứ hồi'
                unCheckedChildren='Một chiều'
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 0 }}
              shouldUpdate={(prevValues, curValues) => prevValues.oneWay !== curValues.oneWay}
            >
              {() => (
                <>
                  {form.getFieldValue('oneWay') ? (
                    <Form.Item
                      name='date'
                      label='Ngày đi - Ngày về'
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                        },
                      ]}
                    >
                      <RangePicker
                        className='itemForm'
                        format={DATE_FORMAT_FRONT_END}
                        allowClear={true}
                        suffixIcon={<IconCalendar />}
                        placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name='departureDate'
                      label='Ngày đi'
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                        },
                      ]}
                    >
                      <DatePicker
                        className='itemForm'
                        format={DATE_FORMAT_FRONT_END}
                        placeholder='dd/mm/yyyy'
                        allowClear={false}
                        suffixIcon={<IconCalendar />}
                      />
                    </Form.Item>
                  )}
                </>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={6}>
            <span>Số lượng Người lớn - Trẻ em - Em bé</span>
            <Space>
              <Form.Item
                name='numAdults'
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                ]}
              >
                <InputNumber max={100} min={1} type='number' placeholder='Số người lớn' />
              </Form.Item>
              <Form.Item
                name='numChildren'
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                ]}
              >
                <InputNumber max={100} type='number' placeholder='Số trẻ em' />
              </Form.Item>
              <Form.Item
                name='numInfants'
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value <= form.getFieldValue('numAdults')) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(
                          new Error(intl.formatMessage({ id: 'IDS_TEXT_VALID_NUM_INFANTS' })),
                        );
                      }
                    },
                  }),
                ]}
              >
                <InputNumber max={100} type='numberF' placeholder='Số em bé' />
              </Form.Item>
            </Space>
          </Col>
          <Col span={6}>
            <Form.Item
              name='amount'
              label='Số tiền thu KH'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <InputNumber
                type='text'
                formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder='Nhập số tiền'
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='caId'
              label='CA'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <Select
                showSearch
                placeholder='Chọn'
                suffixIcon={<IconChevronDown />}
                optionFilterProp='children'
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
                disabled={form.getFieldValue('isEdit')}
              >
                {allowAgents.map((el: some, indx: number) => (
                  <Select.Option key={indx} value={el.id}>
                    {el.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              name='userNameFormat'
              label='Số điện thoại/Email khách hàng'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <AutoComplete
                className='itemForm'
                onSelect={onSelect}
                onSearch={onSearch}
                options={options}
              >
                <Input
                  size='large'
                  onPressEnter={(e) => {
                    onSearch(e.target.value);
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  placeholder='input here'
                />
              </AutoComplete>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='userId'
              label='BookerId'
              rules={[
                {
                  required: form.getFieldValue('caId') == 1,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
              ]}
            >
              <Input disabled type='text' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6} style={{ position: 'relative' }}>
            <Form.Item name='supportPurchaseType' className='form-item-way' valuePropName='checked'>
              <Switch
                className='switch-way'
                checkedChildren='Theo công ty'
                unCheckedChildren='Theo cá nhân'
                disabled={disableCorporate}
              />
            </Form.Item>
            <Form.Item
              name='paymentMethodId'
              label='Phương thức thanh toán'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <Select
                showSearch
                placeholder='Chọn'
                suffixIcon={<IconChevronDown />}
                optionFilterProp='children'
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {paymentMethodsList.map((el: some, indx: number) => (
                  <Select.Option key={indx} value={el.id}>
                    {el.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Button
            htmlType='button'
            onClick={() => navigate(`/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_OFFLINE}`)}
          >
            Hủy
          </Button>
          <Button style={{ margin: '0 8px' }} type='primary' htmlType='submit'>
            Tiếp tục
          </Button>
        </Row>
      </Form>
    </>
  );
};
export default AddTicketStep1;
