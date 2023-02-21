import { Button, Checkbox, Col, Form, Input, message, Row, Select, Space, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  addNewOfflineFlightBooking,
  fetchCheckOverBudget,
  fetchGetByPassApproval,
  fetchTripsByUser,
  getFlightSearchRequestCreatorBody,
  getGeneralInfo,
} from '~/apis/flight';
import { IconChevronDown } from '~/assets';
import { LAST_DATA_BOOKING_FLIGHT_OFFLINE, some } from '~/utils/constants/constant';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import { PURCHASE_TYPES } from '../../constant';
import InfoContactStep2 from './InfoContactStep2';
import InfoCustomerStep2 from './InfoCustomerStep2';
import InfoGuestsStep2 from './InfoGuestsStep2';

const genGuests = (numAdults: number, numChildren: number, numInfants: number) => {
  let result = [];
  for (let index = 0; index < numAdults; index++) {
    result.push({
      dob: null,
      firstName: null,
      gender: 'M',
      inboundBaggageAmount: null,
      inboundBaggageInfo: null,
      inboundBaggageWeight: null,
      lastName: null,
      outboundBaggageAmount: null,
      outboundBaggageInfo: null,
      outboundBaggageWeight: null,
      outboundEticketNo: null,
      insuranceInfo: null,
      type: 'ADULT',
    });
  }
  for (let index = 0; index < numChildren; index++) {
    result.push({
      dob: null,
      firstName: null,
      gender: 'M',
      inboundBaggageAmount: null,
      inboundBaggageInfo: null,
      inboundBaggageWeight: null,
      lastName: null,
      outboundBaggageAmount: null,
      outboundBaggageInfo: null,
      outboundBaggageWeight: null,
      outboundEticketNo: null,
      insuranceInfo: null,
      type: 'CHILD',
    });
  }
  for (let index = 0; index < numInfants; index++) {
    result.push({
      dob: null,
      firstName: null,
      gender: 'M',
      inboundBaggageAmount: null,
      inboundBaggageInfo: null,
      inboundBaggageWeight: null,
      lastName: null,
      outboundBaggageAmount: null,
      outboundBaggageInfo: null,
      outboundBaggageWeight: null,
      outboundEticketNo: null,
      insuranceInfo: null,
      type: 'infants',
    });
  }
  return result;
};

let searchRequestId: any = null;
let historyId: any = null;
let paymentMethodId: any = null;

const AddTicketStep2 = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [agencys, setAgencys] = useState<some[]>([]);
  const [tripsList, setTripsList] = useState<some[]>([]);
  const intl = useIntl();

  const fetFlightSearchRequestCreatorBody = async (value: any) => {
    try {
      const { data } = await getFlightSearchRequestCreatorBody({ searchRequestId: value });
      if (data.code === 200) {
        const dataRes = data.data;
        let dataBookingOffline: any = localStorage.getItem(LAST_DATA_BOOKING_FLIGHT_OFFLINE);
        dataBookingOffline = !isEmpty(dataBookingOffline)
          ? JSON.parse(dataBookingOffline || '')
          : {};

        let item: any = {};
        if (
          historyId == dataBookingOffline.historyId &&
          searchRequestId == dataBookingOffline.searchRequestId
        ) {
          item = dataBookingOffline.item;
        }
        let dataInit = {
          oneWay: dataRes.oneWay,
          numAdults: dataRes.numAdults,
          numChildren: dataRes.numChildren,
          numInfants: dataRes.numInfants,
          paymentMethodId: dataRes.paymentMethodId || paymentMethodId,
          departureDate: dataRes.departureDate,
          returnDate: dataRes.returnDate,
          fromAirport: dataRes.fromAirport,
          toAirport: dataRes.toAirport,
          userId: dataRes.userId,
          amount: dataRes.amount,
          guests: genGuests(dataRes.numAdults, dataRes.numChildren, dataRes.numInfants),
          purchaseType: dataRes.purchaseType,
        };
        if (!isEmpty(item)) {
          dataInit = {
            ...item,
            departureTimeOutbound: !isEmpty(item.departureTimeOutbound)
              ? moment(item.departureTimeOutbound, 'HH:mm')
              : undefined,
            arrivalTimeOutbound: !isEmpty(item.arrivalTimeOutbound)
              ? moment(item.arrivalTimeOutbound, 'HH:mm')
              : undefined,
            departureTimeInbound: !isEmpty(item.departureTimeInbound)
              ? moment(item.departureTimeInbound, 'HH:mm')
              : undefined,
            arrivalTimeInbound: !isEmpty(item.arrivalTimeInbound)
              ? moment(item.arrivalTimeInbound, 'HH:mm')
              : undefined,
            ...dataInit,
            guests: genGuests(dataRes.numAdults, dataRes.numChildren, dataRes.numInfants),
          };
        }
        form.setFieldsValue(dataInit);
        if (dataRes.purchaseType === PURCHASE_TYPES.BUSINESS) {
          getByPassApproval(dataRes.userId);
        }
      } else {
      }
    } catch (error) {}
  };

  const fetGeneralInfo = async () => {
    try {
      const { data } = await getGeneralInfo();
      if (data.code === 200) {
        let temp: some[] = [];
        data.data.agencies.forEach((el: some) => {
          temp.push({
            id: el.id,
            name: `${el.code} - ${el.name}`,
          });
        });
        setAgencys(temp);
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  const onFinish = async (values: some) => {
    const dataDTO: some = {
      ...values,
      contact: {
        ...values.contact,
        phone1: values.contact.phone,
      },
      outboundTicketInformations: {
        ...values.outboundTicketInformations,
        arrivalTimeHour: values.arrivalTimeOutbound.hours(),
        arrivalTimeMinute: values.arrivalTimeOutbound.minutes(),
        departureTimeHour: values.departureTimeOutbound.hours(),
        departureTimeMinute: values.departureTimeOutbound.minutes(),
        priceDetails: {
          adultFee: [
            {
              baseAmount: Math.round(values.adultFeeOutbound.fare / 1.1),
              taxAmount:
                values.adultFeeOutbound.fare - Math.round(values.adultFeeOutbound.fare / 1.1),
              totalAmount: values.adultFeeOutbound.fare,
              type: 'FARE',
            },
            {
              baseAmount: Math.round(values.adultFeeOutbound.admin / 1.1),
              taxAmount:
                values.adultFeeOutbound.admin - Math.round(values.adultFeeOutbound.admin / 1.1),
              totalAmount: values.adultFeeOutbound.admin,
              type: 'ADMIN_FEE',
            },
            {
              baseAmount: Math.round(values.adultFeeOutbound.tax / 1.1),
              taxAmount:
                values.adultFeeOutbound.tax - Math.round(values.adultFeeOutbound.tax / 1.1),
              totalAmount: values.adultFeeOutbound.tax,
              type: 'TAX_AND_FEE',
            },
          ],
          childFee:
            parseInt(values.numChildren) > 0
              ? [
                  {
                    baseAmount: Math.round(values.childFeeOutbound.fare / 1.1),
                    taxAmount:
                      values.childFeeOutbound.fare - Math.round(values.childFeeOutbound.fare / 1.1),
                    totalAmount: values.childFeeOutbound.fare,
                    type: 'FARE',
                  },
                  {
                    baseAmount: Math.round(values.childFeeOutbound.admin / 1.1),
                    taxAmount:
                      values.childFeeOutbound.admin -
                      Math.round(values.childFeeOutbound.admin / 1.1),
                    totalAmount: values.childFeeOutbound.admin,
                    type: 'ADMIN_FEE',
                  },
                  {
                    baseAmount: Math.round(values.childFeeOutbound.tax / 1.1),
                    taxAmount:
                      values.childFeeOutbound.tax - Math.round(values.childFeeOutbound.tax / 1.1),
                    totalAmount: values.childFeeOutbound.tax,
                    type: 'TAX_AND_FEE',
                  },
                ]
              : [],
          infantFee:
            parseInt(values.numInfants) > 0
              ? [
                  {
                    baseAmount: Math.round(values.infantFeeOutbound.fare / 1.1),
                    taxAmount:
                      values.infantFeeOutbound.fare -
                      Math.round(values.infantFeeOutbound.fare / 1.1),
                    totalAmount: values.infantFeeOutbound.fare,
                    type: 'FARE',
                  },
                  {
                    baseAmount: Math.round(values.infantFeeOutbound.admin / 1.1),
                    taxAmount:
                      values.infantFeeOutbound.admin -
                      Math.round(values.infantFeeOutbound.admin / 1.1),
                    totalAmount: values.infantFeeOutbound.admin,
                    type: 'ADMIN_FEE',
                  },
                  {
                    baseAmount: Math.round(values.infantFeeOutbound.tax / 1.1),
                    taxAmount:
                      values.infantFeeOutbound.tax - Math.round(values.infantFeeOutbound.tax / 1.1),
                    totalAmount: values.infantFeeOutbound.tax,
                    type: 'TAX_AND_FEE',
                  },
                ]
              : [],
        },
        searchRequestId: searchRequestId,
        totalNetPrice: 0,
      },
      inboundTicketInformations: values.oneWay
        ? undefined
        : {
            ...values.inboundTicketInformations,
            arrivalTimeHour: values.arrivalTimeInbound.hours(),
            arrivalTimeMinute: values.arrivalTimeInbound.minutes(),
            departureTimeHour: values.departureTimeInbound.hours(),
            departureTimeMinute: values.departureTimeInbound.minutes(),
            priceDetails: {
              adultFee: [
                {
                  baseAmount: Math.round(values.adultFeeInbound.fare / 1.1),
                  taxAmount:
                    values.adultFeeInbound.fare - Math.round(values.adultFeeInbound.fare / 1.1),
                  totalAmount: values.adultFeeInbound.fare,
                  type: 'FARE',
                },
                {
                  baseAmount: Math.round(values.adultFeeInbound.admin / 1.1),
                  taxAmount:
                    values.adultFeeInbound.admin - Math.round(values.adultFeeInbound.admin / 1.1),
                  totalAmount: values.adultFeeInbound.admin,
                  type: 'ADMIN_FEE',
                },
                {
                  baseAmount: Math.round(values.adultFeeInbound.tax / 1.1),
                  taxAmount:
                    values.adultFeeInbound.tax - Math.round(values.adultFeeInbound.tax / 1.1),
                  totalAmount: values.adultFeeInbound.tax,
                  type: 'TAX_AND_FEE',
                },
              ],
              childFee:
                parseInt(values.numChildren) > 0
                  ? [
                      {
                        baseAmount: Math.round(values.childFeeInbound.fare / 1.1),
                        taxAmount:
                          values.childFeeInbound.fare -
                          Math.round(values.childFeeInbound.fare / 1.1),
                        totalAmount: values.childFeeInbound.fare,
                        type: 'FARE',
                      },
                      {
                        baseAmount: Math.round(values.childFeeInbound.admin / 1.1),
                        taxAmount:
                          values.childFeeInbound.admin -
                          Math.round(values.childFeeInbound.admin / 1.1),
                        totalAmount: values.childFeeInbound.admin,
                        type: 'ADMIN_FEE',
                      },
                      {
                        baseAmount: Math.round(values.childFeeInbound.tax / 1.1),
                        taxAmount:
                          values.childFeeInbound.tax - Math.round(values.childFeeInbound.tax / 1.1),
                        totalAmount: values.childFeeInbound.tax,
                        type: 'TAX_AND_FEE',
                      },
                    ]
                  : [],
              infantFee:
                parseInt(values.numInfants) > 0
                  ? [
                      {
                        baseAmount: Math.round(values.infantFeeInbound.fare / 1.1),
                        taxAmount:
                          values.infantFeeInbound.fare -
                          Math.round(values.infantFeeInbound.fare / 1.1),
                        totalAmount: values.infantFeeInbound.fare,
                        type: 'FARE',
                      },
                      {
                        baseAmount: Math.round(values.infantFeeInbound.admin / 1.1),
                        taxAmount:
                          values.infantFeeInbound.admin -
                          Math.round(values.infantFeeInbound.admin / 1.1),
                        totalAmount: values.infantFeeInbound.admin,
                        type: 'ADMIN_FEE',
                      },
                      {
                        baseAmount: Math.round(values.infantFeeInbound.tax / 1.1),
                        taxAmount:
                          values.infantFeeInbound.tax -
                          Math.round(values.infantFeeInbound.tax / 1.1),
                        totalAmount: values.infantFeeInbound.tax,
                        type: 'TAX_AND_FEE',
                      },
                    ]
                  : [],
            },
            searchRequestId: searchRequestId,
            totalNetPrice: 0,
          },
      guests: values.guests.map((el: some) => ({
        ...el,
        dob: el?.dob?.format('DD-MM-YYYY'),
        outboundBaggageWeight: !isEmpty(el.outboundBaggageWeight)
          ? values.baggageListOutbound?.find((it: some) => it.id === el.outboundBaggageWeight)
              ?.weight || 0
          : el.outboundBaggageWeight,
        inboundBaggageWeight: !isEmpty(el.inboundBaggageWeight)
          ? values.baggageListInbound?.find((it: some) => it.id === el.inboundBaggageWeight)
              ?.weight || 0
          : el.inboundBaggageWeight,
      })),
      searchRequestId: searchRequestId,
      paymentMethodId: values.paymentMethodId,
    };
    delete dataDTO.arrivalTimeOutbound;
    delete dataDTO.departureTimeOutbound;
    delete dataDTO.adultFeeOutbound;
    delete dataDTO.childFeeOutbound;
    delete dataDTO.infantFeeOutbound;
    delete dataDTO.departureTimeInbound;
    delete dataDTO.arrivalTimeInbound;
    delete dataDTO.adultFeeInbound;
    delete dataDTO.childFeeInbound;
    delete dataDTO.infantFeeInbound;
    delete dataDTO.numAdults;
    delete dataDTO.numChildren;
    delete dataDTO.numInfants;
    delete dataDTO.oneWay;
    delete dataDTO.returnDate;
    delete dataDTO.departureDate;
    delete dataDTO.fromAirport;
    delete dataDTO.toAirport;
    delete dataDTO.baggageListOutbound;
    delete dataDTO.baggageListInbound;
    if (dataDTO.purchaseType == PURCHASE_TYPES.PERSONAL) {
      addNewOfflineFlight(dataDTO);
    } else {
      if (!dataDTO.byPassApproval) {
        if (dataDTO.byPassApprovalRoot) {
          addNewOfflineFlight(dataDTO);
        } else {
          const params = {
            bookingId: null,
            bookingType: 'FLIGHT',
            finalPrice: dataDTO.amount,
            originPrice: dataDTO.amount,
            tripCode: dataDTO?.businessInfo?.code,
            userId: dataDTO.userId,
          };
          try {
            const { data } = await fetchCheckOverBudget(params);
            if (data.code === 200) {
              delete dataDTO.userId;
              delete dataDTO.amount;
              addNewOfflineFlight(dataDTO);
            } else {
              message.error(data.message);
            }
          } catch (error) {}
        }
      } else {
        addNewOfflineFlight(dataDTO);
      }
    }
  };

  const addNewOfflineFlight = async (dataDTO: some) => {
    try {
      const { data } = await addNewOfflineFlightBooking(dataDTO);
      if (data.code === 200) {
        navigate({
          pathname: location.pathname,
          search: createSearchParams({
            ...data.data,
            searchRequestId,
            historyId,
          }).toString(),
        });
      } else {
        message.error(data.message);
      }
    } catch (error) {}
  };

  const getByPassApproval = async (id: string) => {
    try {
      const { data } = await fetchGetByPassApproval({ userId: id });
      if (data.code === 200) {
        const { byPassApproval } = data?.data;
        if (!byPassApproval) {
          getListTripsByUser(id);
        }
        form.setFieldsValue({
          byPassApproval: byPassApproval || false,
        });
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  const getListTripsByUser = async (id: string) => {
    try {
      const { data } = await fetchTripsByUser({ userId: id, page: 1, pageSize: 100 }); //tam thay userId
      if (data.code === 200) {
        const { itemList } = data.data;
        setTripsList(itemList);
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    for (const entry of searchParams.entries()) {
      const [param, value] = entry;
      if (param === 'searchRequestId') {
        searchRequestId = value;
        fetFlightSearchRequestCreatorBody(value);
        fetGeneralInfo();
      } else if (param === 'historyId') {
        historyId = value;
      } else if (param === 'paymentMethodId') {
        paymentMethodId = value;
      }
    }
  }, []);

  const caculatorTotal = () => {
    const guests = form.getFieldValue('guests');
    let totalPriceBag = 0;
    guests.forEach((el: some) => {
      if (!isEmpty(el.inboundBaggageAmount)) {
        totalPriceBag += el.inboundBaggageAmount;
      }
      if (!isEmpty(el.outboundBaggageAmount)) {
        totalPriceBag += el.outboundBaggageAmount;
      }
    });
    let total = 0;
    let listField: string[] = ['adultFeeOutbound', 'childFeeOutbound', 'infantFeeOutbound'];
    if (!form.getFieldValue('oneWay')) {
      listField = [...listField, ...['adultFeeInbound', 'childFeeInbound', 'infantFeeInbound']];
    }
    listField.forEach((el: string) => {
      total +=
        ((form.getFieldValue(el)?.fare || 0) +
          (form.getFieldValue(el)?.admin || 0) +
          (form.getFieldValue(el)?.tax || 0)) *
        (el?.includes('adultFee')
          ? parseInt(form.getFieldValue('numAdults') || 0)
          : el?.includes('childFee')
          ? parseInt(form.getFieldValue('numChildren') || 0)
          : parseInt(form.getFieldValue('numInfants') || 0));
    });
    return (
      total +
      ((form.getFieldValue('outboundTicketInformations')?.processingFeeUnit || 0) +
        (form.getFieldValue('inboundTicketInformations')?.processingFeeUnit || 0)) *
        (parseInt(form.getFieldValue('numAdults') || 0) +
          parseInt(form.getFieldValue('numChildren') || 0)) +
      totalPriceBag
    );
  };

  const handleChangeStep = () => {
    let params: some = {
      historyId,
    };
    navigate({
      pathname: location.pathname,
      search: createSearchParams(params).toString(),
    });
  };

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      let dataBookingOffline: any = localStorage.getItem(LAST_DATA_BOOKING_FLIGHT_OFFLINE);
      dataBookingOffline = !isEmpty(dataBookingOffline) ? JSON.parse(dataBookingOffline || '') : {};
      dataBookingOffline = {
        ...dataBookingOffline,
        historyId,
        searchRequestId,
        paymentMethodId,
        item: {
          ...data,
          arrivalTimeOutbound: !isEmpty(data.arrivalTimeOutbound)
            ? data.arrivalTimeOutbound.format('HH:mm')
            : undefined,
          departureTimeOutbound: !isEmpty(data.departureTimeOutbound)
            ? data.departureTimeOutbound.format('HH:mm')
            : undefined,
          arrivalTimeInbound: !isEmpty(data.arrivalTimeInbound)
            ? data.arrivalTimeInbound.format('HH:mm')
            : undefined,
          departureTimeInbound: !isEmpty(data.departureTimeInbound)
            ? data.departureTimeInbound.format('HH:mm')
            : undefined,
          guests: data.guests.map((el: some) => ({
            ...el,
            dob: !isEmpty(el.dob) ? el.dob.format('DD-MM-YYYY') : null,
          })),
        },
      };
      localStorage.setItem(LAST_DATA_BOOKING_FLIGHT_OFFLINE, JSON.stringify(dataBookingOffline));
    };
  }, []);

  return (
    <>
      <Form
        form={form}
        className='form-create-info-user-ticket'
        scrollToFirstError
        colon={false}
        initialValues={{
          // info customer outbound
          outboundTicketInformations: {
            airlineId: undefined,
            agencyId: undefined,
            ticketClassCode: undefined,
            flightCode: undefined,
            arrivalTimeHour: undefined,
            arrivalTimeMinute: undefined,
            departureTimeHour: undefined,
            departureTimeMinute: undefined,
          },
          outboundPNRCode: undefined,
          departureTimeOutbound: undefined,
          arrivalTimeOutbound: undefined,
          adultFeeOutbound: {
            fare: undefined,
            admin: undefined,
            tax: undefined,
          },
          childFeeOutbound: {
            fare: undefined,
            admin: undefined,
            tax: undefined,
          },
          infantFeeOutbound: {
            fare: undefined,
            admin: undefined,
            tax: undefined,
          },
          // info customer inbound
          inboundTicketInformations: {
            airlineId: undefined,
            agencyId: undefined,
            ticketClassCode: undefined,
            flightCode: undefined,
            arrivalTimeHour: undefined,
            arrivalTimeMinute: undefined,
            departureTimeHour: undefined,
            departureTimeMinute: undefined,
          },
          inboundPNRCode: undefined,
          departureTimeInbound: undefined,
          arrivalTimeInbound: undefined,
          adultFeeInbound: {
            fare: undefined,
            admin: undefined,
            tax: undefined,
          },
          childFeeInbound: {
            fare: undefined,
            admin: undefined,
            tax: undefined,
          },
          infantFeeInbound: {
            fare: undefined,
            admin: undefined,
            tax: undefined,
          },
          contact: {
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            phone1: undefined,
            title: undefined,
          },
          guests: [],
          baggageListInbound: [],
          baggageListOutbound: [],
          tripId: null,
          businessInfo: null,
          byPassApproval: false,
          byPassApprovalRoot: false,
          purchaseType: PURCHASE_TYPES.PERSONAL,
        }}
        onValuesChange={(changedValues, allValues) => {
          if (
            changedValues?.outboundTicketInformations?.airlineId !== undefined ||
            changedValues?.outboundTicketInformations?.agencyId !== undefined
          ) {
            let guestTemp: any[] = [];
            allValues.guests.forEach((el: some) => {
              guestTemp.push({
                ...el,
                outboundBaggageAmount: null,
                outboundBaggageInfo: null,
                outboundBaggageWeight: null,
              });
            });
            form.setFieldsValue({
              guests: guestTemp,
            });
          } else if (
            changedValues?.inboundTicketInformations?.airlineId !== undefined ||
            changedValues?.inboundTicketInformations?.agencyId !== undefined
          ) {
            let guestTemp: any[] = [];
            allValues.guests.forEach((el: some) => {
              guestTemp.push({
                ...el,
                inboundBaggageAmount: null,
                inboundBaggageInfo: null,
                inboundBaggageWeight: null,
              });
            });
            form.setFieldsValue({
              guests: guestTemp,
            });
          }
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
      >
        <Form.Item name='oneWay' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='numAdults' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='numChildren' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='numInfants' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='paymentMethodId' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='departureDate' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='returnDate' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='fromAirport' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='toAirport' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='userId' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='amount' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='byPassApproval' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='baggageListInbound' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='baggageListOutbound' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='purchaseType' hidden>
          <Input />
        </Form.Item>
        <InfoCustomerStep2 agencys={agencys} />
        <InfoContactStep2 />
        <InfoGuestsStep2 />
        {form.getFieldValue('purchaseType') === PURCHASE_TYPES.BUSINESS &&
          !form.getFieldValue('byPassApproval') && (
            <>
              <Space align='center' style={{ margin: '32px 0px 0px' }}>
                <h2 style={{ marginBottom: '18px' }}>Tờ trình </h2>
                <Form.Item name='byPassApprovalRoot' valuePropName='checked' style={{ width: 300 }}>
                  <Checkbox>Bỏ qua kiểm tra hạn mức</Checkbox>
                </Form.Item>
              </Space>
              <>
                <Form.Item
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.byPassApprovalRoot !== curValues.byPassApprovalRoot
                  }
                >
                  {() => (
                    <div className='item-info-container'>
                      <Row gutter={16}>
                        <Col span={12}>
                          <div style={{ marginBottom: 4 }}>Danh sách tờ trình</div>
                          <Form.Item
                            name={['businessInfo', 'name']}
                            wrapperCol={{ span: 24 }}
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder='Chọn'
                              suffixIcon={<IconChevronDown />}
                              onSelect={(ele: string, op: some) => {
                                form.setFieldsValue({
                                  businessInfo: {
                                    id: op.id,
                                    code: op.value,
                                    name: op.name,
                                  },
                                });
                              }}
                              options={(tripsList || []).map((d: some) => ({
                                value: d.code,
                                label: (
                                  <span>
                                    {d.code} - {d.name}{' '}
                                  </span>
                                ),
                                name: d.name,
                                id: d.id,
                              }))}
                            ></Select>
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <div style={{ marginBottom: 4 }}>Mã tờ trình</div>
                          <Form.Item
                            name={['businessInfo', 'code']}
                            wrapperCol={{ span: 24 }}
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                              },
                            ]}
                          >
                            <Input disabled />
                          </Form.Item>
                          <Form.Item name={['businessInfo', 'id']} hidden>
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                      {form.getFieldValue('byPassApprovalRoot') && (
                        <Row>
                          <Tag color='warning'>
                            Đơn hàng đã Bỏ qua kiểm tra hạn mức. Hãy chắc chắn bạn đã xác nhận với
                            doanh nghiệp!
                          </Tag>
                        </Row>
                      )}
                    </div>
                  )}
                </Form.Item>
              </>
            </>
          )}
        <Form.Item
          style={{ marginBottom: 12 }}
          shouldUpdate={(prevValues, curValues) =>
            prevValues.adultFeeOutbound !== curValues.adultFeeOutbound ||
            prevValues.childFeeOutbound !== curValues.childFeeOutbound ||
            prevValues.infantFeeOutbound !== curValues.infantFeeOutbound ||
            prevValues.adultFeeInbound !== curValues.adultFeeInbound ||
            prevValues.childFeeInbound !== curValues.childFeeInbound ||
            prevValues.infantFeeInbound !== curValues.infantFeeInbound ||
            prevValues.outboundTicketInformations.processingFeeUnit !==
              curValues.outboundTicketInformations.processingFeeUnit ||
            prevValues.inboundTicketInformations.processingFeeUnit !==
              curValues.inboundTicketInformations.processingFeeUnit ||
            prevValues.guests !== curValues.guests
          }
        >
          {() => (
            <>
              <h2 style={{ margin: '32px 0 12px' }}>Tổng tiền</h2>
              <div className='total-price'>
                <div className='item-price' style={{ marginBottom: 8 }}>
                  <span style={{ marginRight: 4 }}>Tổng giá trị đơn hàng:</span>
                  <span style={{ color: '#FF2C00', fontWeight: 500 }}>
                    {formatMoney(caculatorTotal())}
                  </span>
                </div>
                <div className='item-price'>
                  <span style={{ marginRight: 4 }}>Tổng tiền thu khách:</span>
                  <span style={{ color: '#FF2C00', fontWeight: 500 }}>
                    {formatMoney(form.getFieldValue('amount'))}
                  </span>
                </div>
              </div>
            </>
          )}
        </Form.Item>

        <Row style={{ marginTop: 12 }}>
          <Button htmlType='button' onClick={handleChangeStep}>
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
export default AddTicketStep2;
