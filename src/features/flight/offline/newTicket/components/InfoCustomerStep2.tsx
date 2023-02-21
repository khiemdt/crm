import { Col, Form, Input, InputNumber, message, Row, Select, TimePicker } from 'antd';
import { useIntl } from 'react-intl';
import { AirlinesType, visibleLoading } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { listTicketClassCode } from '~/utils/constants/dataOptions';
import { IconChevronDown, IconSearch } from '~/assets';
import { retrievePnr } from '~/apis/flight';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import moment from 'moment';
import { FORMAT_TIME } from '~/features/flight/constant';
import { useState } from 'react';

let timeoutSearch: any = null;

const InfoCustomerStep2 = (props: some) => {
  const { agencys } = props;
  const form = Form.useFormInstance();
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);
  const onSearch = async (type: string) => {
    try {
      const guests = form.getFieldValue('guests');
      const outboundTicketInformations = form.getFieldValue('outboundTicketInformations');
      const inboundTicketInformations = form.getFieldValue('inboundTicketInformations');
      const ticketInformations =
        type === 'outbound' ? outboundTicketInformations : inboundTicketInformations;
      const outboundPNRCode = form.getFieldValue('outboundPNRCode');
      const inboundPNRCode = form.getFieldValue('inboundPNRCode');
      const userId = form.getFieldValue('userId');
      dispatch(visibleLoading(true));
      const { data } = await retrievePnr({
        airlineId: ticketInformations?.airlineId,
        pnr: type === 'outbound' ? outboundPNRCode : inboundPNRCode,
        provider: agencys.find((el: some) => el.id === ticketInformations.agencyId)?.name,
        userId: userId,
      });
      dispatch(visibleLoading(false));
      if (data.code === 200) {
        const dataDTO = data.data;
        const guestsTemp: some[] = [];
        let dataForm: some = {};
        // contactInfo
        dataForm = {
          ...dataForm,
          contact: dataDTO.contactInfo,
        };
        // guests
        dataDTO.passengers.forEach((el: some, idx: number) => {
          guestsTemp.push({
            ...guests[idx],
            ...el,
            dob: el.dob ? moment(el.dob, 'DD-MM-YYYY') : undefined,
          });
        });
        dataForm = {
          ...dataForm,
          guests: guestsTemp,
        };
        // outboundTicketInformations
        if (type === 'outbound' || dataDTO.journeys.length === 1) {
          const journey = dataDTO.journeys[0];
          let outboundTicketInformationsTemp = {
            ...outboundTicketInformations,
            flightCode: journey.flightCode,
            ticketClassCode: journey.ticketClass,
          };
          dataDTO.charges.forEach((el: some, idx: number) => {
            if (el.journeyIndex === 0) {
              const feeOutbound = {
                fare: el.priceDetails.find((ol: some) => ol.type === 'FARE')?.totalAmount,
                admin: el.priceDetails.find((ol: some) => ol.type === 'ADMIN_FEE')?.totalAmount,
                tax: el.priceDetails.find((ol: some) => ol.type === 'TAX_AND_FEE')?.totalAmount,
              };
              const passenger = dataDTO.passengers.find(
                (it: some) => it.index === el.passengerIndex,
              );
              if (passenger?.type === 'ADULT') {
                dataForm = {
                  ...dataForm,
                  adultFeeOutbound: feeOutbound,
                };
              } else if (passenger?.type === 'CHILD') {
                dataForm = {
                  ...dataForm,
                  childFeeOutbound: feeOutbound,
                };
              } else {
                dataForm = {
                  ...dataForm,
                  infantFeeOutbound: feeOutbound,
                };
              }
            }
          });
          dataForm = {
            ...dataForm,
            outboundTicketInformations: outboundTicketInformationsTemp,
            departureTimeOutbound: moment(journey.fromTime, 'HH:mm'),
            arrivalTimeOutbound: moment(journey.toTime, 'HH:mm'),
          };
        }
        // inboundTicketInformations
        if (
          (type === 'inbound' && dataDTO.journeys.length === 1) ||
          dataDTO.journeys.length === 2
        ) {
          const journey = dataDTO.journeys.length === 2 ? dataDTO.journeys[1] : dataDTO.journeys[0];
          const inboundTicketInformationsTemp = {
            ...inboundTicketInformations,
            flightCode: journey.flightCode,
            ticketClassCode: journey.ticketClass,
            airlineId: outboundTicketInformations.airlineId,
            agencyId: outboundTicketInformations.agencyId,
          };
          dataDTO.charges.forEach((el: some, idx: number) => {
            if (
              (el.journeyIndex === 0 && dataDTO.journeys.length === 1) ||
              (el.journeyIndex === 1 && dataDTO.journeys.length === 2)
            ) {
              const feeOutbound = {
                fare: el.priceDetails.find((ol: some) => ol.type === 'FARE')?.totalAmount,
                admin: el.priceDetails.find((ol: some) => ol.type === 'ADMIN_FEE')?.totalAmount,
                tax: el.priceDetails.find((ol: some) => ol.type === 'TAX_AND_FEE')?.totalAmount,
              };
              const passenger = dataDTO.passengers.find(
                (it: some) => it.index === el.passengerIndex,
              );
              if (passenger?.type === 'ADULT') {
                dataForm = {
                  ...dataForm,
                  adultFeeInbound: feeOutbound,
                };
              } else if (passenger?.type === 'CHILD') {
                dataForm = {
                  ...dataForm,
                  childFeeInbound: feeOutbound,
                };
              } else {
                dataForm = {
                  ...dataForm,
                  infantFeeInbound: feeOutbound,
                };
              }
            }
          });
          dataForm = {
            ...dataForm,
            inboundPNRCode: outboundPNRCode,
            inboundTicketInformations: inboundTicketInformationsTemp,
            departureTimeInbound: moment(journey.fromTime, 'HH:mm'),
            arrivalTimeInbound: moment(journey.toTime, 'HH:mm'),
          };
        }
        form.setFieldsValue(dataForm);
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra');
      }
    } catch (error) {
      console.log('error', error);
      dispatch(visibleLoading(false));
    }
  };

  const caculator = (type: string) => {
    return (
      form.getFieldValue(type).fare + form.getFieldValue(type).admin + form.getFieldValue(type).tax
    );
  };

  const caculatorTotal = (listField: string[]) => {
    let total = 0;
    listField.forEach((el: string) => {
      total +=
        ((form.getFieldValue(el).fare || 0) +
          (form.getFieldValue(el).admin || 0) +
          (form.getFieldValue(el).tax || 0)) *
        (el?.includes('adultFee')
          ? parseInt(form.getFieldValue('numAdults'))
          : el?.includes('childFee')
          ? parseInt(form.getFieldValue('numChildren'))
          : parseInt(form.getFieldValue('numInfants')));
    });
    return total;
  };
  return (
    <>
      <h2 style={{ marginBottom: 12 }}>Thông tin chuyến bay</h2>
      <div className='item-info-container'>
        <Row gutter={100}>
          <Col span={12}>
            <div className='title'>Chiều đi</div>
            <Form.Item
              name={['outboundTicketInformations', 'airlineId']}
              label='Hãng bay'
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
                optionFilterProp='children'
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {airlines.map((el: some, indx: number) => (
                  <Select.Option key={indx} value={el.id}>
                    {el.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={['outboundTicketInformations', 'agencyId']}
              label='Nhà cung cấp'
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
                optionFilterProp='children'
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {agencys.map((el: some, indx: number) => (
                  <Select.Option key={indx} value={el.id}>
                    {el.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='outboundPNRCode'
              label='Mã đặt chỗ'
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
              ]}
            >
              <Input
                allowClear
                placeholder='Nhập mã đặt chỗ'
                suffix={
                  <IconSearch style={{ cursor: 'pointer' }} onClick={() => onSearch('outbound')} />
                }
                onPressEnter={(e) => {
                  onSearch('outbound');
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </Form.Item>
            <Form.Item
              name={['outboundTicketInformations', 'ticketClassCode']}
              label='Hạng vé'
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
              ]}
            >
              <Select
                placeholder='Chọn'
                suffixIcon={<IconChevronDown />}
                optionFilterProp='children'
              >
                {listTicketClassCode.map((el: some, indx: number) => (
                  <Select.Option key={indx} value={el.id}>
                    {el.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={['outboundTicketInformations', 'flightCode']}
              label='Số hiệu chuyến bay'
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
              ]}
            >
              <Input allowClear placeholder='Nhập số hiệu chuyến bay' />
            </Form.Item>
            <Row gutter={0}>
              <Col span={12}>
                <Row style={{ alignItems: 'baseline' }}>
                  <Col span={16}>
                    <span className='mark-required'>Thời gian bay</span>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name='departureTimeOutbound'
                      label=''
                      labelCol={{ span: 0 }}
                      wrapperCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                        },
                      ]}
                      style={{ width: '100%' }}
                    >
                      <TimePicker
                        onSelect={(value) => {
                          form.setFieldsValue({
                            departureTimeOutbound: value,
                          });
                        }}
                        placeholder='00:00'
                        format='HH:mm'
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row style={{ alignItems: 'baseline' }}>
                  <Col span={16}>
                    <span style={{ display: 'flex', justifyContent: 'end', paddingRight: 8 }}>
                      Thời gian đến
                    </span>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name='arrivalTimeOutbound'
                      label=''
                      labelCol={{ span: 0 }}
                      wrapperCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                        },
                      ]}
                    >
                      <TimePicker
                        onSelect={(value) => {
                          form.setFieldsValue({
                            arrivalTimeOutbound: value,
                          });
                        }}
                        placeholder='00:00'
                        format='HH:mm'
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={16}>
                <Row gutter={10}>
                  <Col span={6}>
                    <span className='mark-required'>Fare</span>
                  </Col>
                  <Col span={6}>
                    <span className='mark-required'>Admin fee</span>
                  </Col>
                  <Col span={6}>
                    <span className='mark-required'>Tax&fee</span>
                  </Col>
                  <Col span={6}>
                    <span>Tổng</span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={8}>Giá vé người lớn</Col>
              <Col span={16}>
                <Row gutter={10}>
                  <Col span={6}>
                    <Form.Item
                      wrapperCol={{ span: 24 }}
                      name={['adultFeeOutbound', 'fare']}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                        },
                      ]}
                    >
                      <InputNumber
                        type='text'
                        formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        placeholder='Nhập'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={['adultFeeOutbound', 'admin']}
                      wrapperCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                        },
                      ]}
                    >
                      <InputNumber
                        type='text'
                        formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        placeholder='Nhập'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={['adultFeeOutbound', 'tax']}
                      wrapperCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                        },
                      ]}
                    >
                      <InputNumber
                        type='text'
                        formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        placeholder='Nhập'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.adultFeeOutbound !== curValues.adultFeeOutbound
                      }
                      wrapperCol={{ span: 24 }}
                    >
                      {() => (
                        <>
                          <InputNumber
                            style={{ width: '100%' }}
                            disabled
                            type='text'
                            formatter={(value: any) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            value={caculator('adultFeeOutbound')}
                          />
                        </>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Form.Item
              style={{ marginBottom: 0 }}
              shouldUpdate={(prevValues, curValues) =>
                prevValues.numChildren !== curValues.numChildren
              }
              wrapperCol={{ span: 24 }}
            >
              {() => (
                <>
                  {parseInt(form.getFieldValue('numChildren')) > 0 && (
                    <Row>
                      <Col span={8}>Giá vé trẻ em</Col>
                      <Col span={16}>
                        <Row gutter={10}>
                          <Col span={6}>
                            <Form.Item
                              name={['childFeeOutbound', 'fare']}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                },
                              ]}
                            >
                              <InputNumber
                                type='text'
                                formatter={(value: any) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                placeholder='Nhập'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              name={['childFeeOutbound', 'admin']}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                },
                              ]}
                            >
                              <InputNumber
                                type='text'
                                formatter={(value: any) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                placeholder='Nhập'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              name={['childFeeOutbound', 'tax']}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                },
                              ]}
                            >
                              <InputNumber
                                type='text'
                                formatter={(value: any) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                placeholder='Nhập'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              shouldUpdate={(prevValues, curValues) =>
                                prevValues.childFeeOutbound !== curValues.childFeeOutbound
                              }
                              wrapperCol={{ span: 24 }}
                            >
                              {() => (
                                <>
                                  <InputNumber
                                    style={{ width: '100%' }}
                                    disabled
                                    type='text'
                                    formatter={(value: any) =>
                                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    value={caculator('childFeeOutbound')}
                                  />
                                </>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 0 }}
              shouldUpdate={(prevValues, curValues) =>
                prevValues.numInfants !== curValues.numInfants
              }
              wrapperCol={{ span: 24 }}
            >
              {() => (
                <>
                  {parseInt(form.getFieldValue('numInfants')) > 0 && (
                    <Row>
                      <Col span={8}>Giá vé em bé</Col>
                      <Col span={16}>
                        <Row gutter={10}>
                          <Col span={6}>
                            <Form.Item
                              wrapperCol={{ span: 24 }}
                              name={['infantFeeOutbound', 'fare']}
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                },
                              ]}
                            >
                              <InputNumber
                                type='text'
                                formatter={(value: any) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                placeholder='Nhập'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              wrapperCol={{ span: 24 }}
                              name={['infantFeeOutbound', 'admin']}
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                },
                              ]}
                            >
                              <InputNumber
                                type='text'
                                formatter={(value: any) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                placeholder='Nhập'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              wrapperCol={{ span: 24 }}
                              name={['infantFeeOutbound', 'tax']}
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                },
                              ]}
                            >
                              <InputNumber
                                type='text'
                                formatter={(value: any) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                placeholder='Nhập'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              shouldUpdate={(prevValues, curValues) =>
                                prevValues.infantFeeOutbound !== curValues.infantFeeOutbound
                              }
                              wrapperCol={{ span: 24 }}
                            >
                              {() => (
                                <>
                                  <InputNumber
                                    style={{ width: '100%' }}
                                    disabled
                                    type='text'
                                    formatter={(value: any) =>
                                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    value={caculator('infantFeeOutbound')}
                                  />
                                </>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </Form.Item>

            <Row>
              <Col span={8}>Tổng vé chiều đi</Col>
              <Col span={16}>
                <Form.Item
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.infantFeeOutbound !== curValues.adultFeeOutbound ||
                    prevValues.infantFeeOutbound !== curValues.childFeeOutbound ||
                    prevValues.infantFeeOutbound !== curValues.infantFeeOutbound
                  }
                  wrapperCol={{ span: 24 }}
                >
                  {() => (
                    <>
                      <InputNumber
                        style={{ width: '100%' }}
                        disabled
                        type='text'
                        formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        value={caculatorTotal([
                          'adultFeeOutbound',
                          'childFeeOutbound',
                          'infantFeeOutbound',
                        ])}
                      />
                    </>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name={['outboundTicketInformations', 'processingFeeUnit']}
              label='Phí dịch vụ/ người'
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                type='text'
                formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder='Nhập số tiền'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              shouldUpdate={(prevValues, curValues) => prevValues.oneWay !== curValues.oneWay}
              wrapperCol={{ span: 24 }}
              style={{ width: '100%' }}
            >
              {() => (
                <>
                  {!form.getFieldValue('oneWay') && (
                    <>
                      <div className='title'>Chiều về</div>
                      <Form.Item
                        labelCol={{ span: 8 }}
                        name={['inboundTicketInformations', 'airlineId']}
                        label='Hãng bay'
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
                          optionFilterProp='children'
                          filterOption={(input, option) =>
                            removeAccent(
                              (option!.children as unknown as string).toLowerCase(),
                            ).indexOf(removeAccent(input.toLowerCase())) >= 0
                          }
                        >
                          {airlines.map((el: some, indx: number) => (
                            <Select.Option key={indx} value={el.id}>
                              {el.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        labelCol={{ span: 8 }}
                        name={['inboundTicketInformations', 'agencyId']}
                        label='Nhà cung cấp'
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
                          optionFilterProp='children'
                          filterOption={(input, option) =>
                            removeAccent(
                              (option!.children as unknown as string).toLowerCase(),
                            ).indexOf(removeAccent(input.toLowerCase())) >= 0
                          }
                        >
                          {agencys.map((el: some, indx: number) => (
                            <Select.Option key={indx} value={el.id}>
                              {el.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        labelCol={{ span: 8 }}
                        name='inboundPNRCode'
                        label='Mã đặt chỗ'
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                          },
                        ]}
                      >
                        <Input
                          allowClear
                          placeholder='Nhập mã đặt chỗ'
                          suffix={
                            <IconSearch
                              style={{ cursor: 'pointer' }}
                              onClick={() => onSearch('inbound')}
                            />
                          }
                          onPressEnter={(e) => {
                            onSearch('inbound');
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        labelCol={{ span: 8 }}
                        name={['inboundTicketInformations', 'ticketClassCode']}
                        label='Hạng vé'
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                          },
                        ]}
                      >
                        <Select
                          placeholder='Chọn'
                          suffixIcon={<IconChevronDown />}
                          optionFilterProp='children'
                        >
                          {listTicketClassCode.map((el: some, indx: number) => (
                            <Select.Option key={indx} value={el.id}>
                              {el.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        labelCol={{ span: 8 }}
                        name={['inboundTicketInformations', 'flightCode']}
                        label='Số hiệu chuyến bay'
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                          },
                        ]}
                      >
                        <Input allowClear placeholder='Nhập số hiệu chuyến bay' />
                      </Form.Item>
                      <Row gutter={0}>
                        <Col span={12}>
                          <Row style={{ alignItems: 'baseline' }}>
                            <Col span={16}>
                              <span className='mark-required'>Thời gian bay</span>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name='departureTimeInbound'
                                label=''
                                labelCol={{ span: 0 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                  {
                                    required: true,
                                    message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                  },
                                ]}
                                style={{ width: '100%' }}
                              >
                                <TimePicker
                                  placeholder='00:00'
                                  format='HH:mm'
                                  style={{ width: '100%' }}
                                  onSelect={(value) => {
                                    form.setFieldsValue({
                                      departureTimeInbound: value,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12}>
                          <Row style={{ alignItems: 'baseline' }}>
                            <Col span={16}>
                              <span
                                style={{ display: 'flex', justifyContent: 'end', paddingRight: 8 }}
                              >
                                Thời gian đến
                              </span>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name='arrivalTimeInbound'
                                label=''
                                labelCol={{ span: 0 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                  {
                                    required: true,
                                    message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                  },
                                ]}
                              >
                                <TimePicker
                                  onSelect={(value) => {
                                    form.setFieldsValue({
                                      arrivalTimeInbound: value,
                                    });
                                  }}
                                  placeholder='00:00'
                                  format='HH:mm'
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}></Col>
                        <Col span={16}>
                          <Row gutter={10}>
                            <Col span={6}>
                              <span className='mark-required'>Fare</span>
                            </Col>
                            <Col span={6}>
                              <span className='mark-required'>Admin fee</span>
                            </Col>
                            <Col span={6}>
                              <span className='mark-required'>Tax&fee</span>
                            </Col>
                            <Col span={6}>
                              <span>Tổng</span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>Giá vé người lớn</Col>
                        <Col span={16}>
                          <Row gutter={10}>
                            <Col span={6}>
                              <Form.Item
                                wrapperCol={{ span: 24 }}
                                name={['adultFeeInbound', 'fare']}
                                rules={[
                                  {
                                    required: true,
                                    message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                  },
                                ]}
                              >
                                <InputNumber
                                  type='text'
                                  formatter={(value: any) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  }
                                  placeholder='Nhập'
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                name={['adultFeeInbound', 'admin']}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                  {
                                    required: true,
                                    message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                  },
                                ]}
                              >
                                <InputNumber
                                  type='text'
                                  formatter={(value: any) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  }
                                  placeholder='Nhập'
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                name={['adultFeeInbound', 'tax']}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                  {
                                    required: true,
                                    message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                  },
                                ]}
                              >
                                <InputNumber
                                  type='text'
                                  formatter={(value: any) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  }
                                  placeholder='Nhập'
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                style={{ marginBottom: 0 }}
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.adultFeeInbound !== curValues.adultFeeInbound
                                }
                                wrapperCol={{ span: 24 }}
                              >
                                {() => (
                                  <>
                                    <InputNumber
                                      style={{ width: '100%' }}
                                      disabled
                                      type='text'
                                      formatter={(value: any) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                      }
                                      value={caculator('adultFeeInbound')}
                                    />
                                  </>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.numChildren !== curValues.numChildren
                        }
                        wrapperCol={{ span: 24 }}
                      >
                        {() => (
                          <>
                            {parseInt(form.getFieldValue('numChildren')) > 0 && (
                              <Row>
                                <Col span={8}>Giá vé trẻ em</Col>
                                <Col span={16}>
                                  <Row gutter={10}>
                                    <Col span={6}>
                                      <Form.Item
                                        name={['childFeeInbound', 'fare']}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                          {
                                            required: true,
                                            message: intl.formatMessage({
                                              id: 'IDS_TEXT_REQUIRED',
                                            }),
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          type='text'
                                          formatter={(value: any) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                          }
                                          placeholder='Nhập'
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item
                                        name={['childFeeInbound', 'admin']}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                          {
                                            required: true,
                                            message: intl.formatMessage({
                                              id: 'IDS_TEXT_REQUIRED',
                                            }),
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          type='text'
                                          formatter={(value: any) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                          }
                                          placeholder='Nhập'
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item
                                        name={['childFeeInbound', 'tax']}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                          {
                                            required: true,
                                            message: intl.formatMessage({
                                              id: 'IDS_TEXT_REQUIRED',
                                            }),
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          type='text'
                                          formatter={(value: any) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                          }
                                          placeholder='Nhập'
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item
                                        style={{ marginBottom: 0 }}
                                        shouldUpdate={(prevValues, curValues) =>
                                          prevValues.childFeeInbound !== curValues.childFeeInbound
                                        }
                                        wrapperCol={{ span: 24 }}
                                      >
                                        {() => (
                                          <>
                                            <InputNumber
                                              style={{ width: '100%' }}
                                              disabled
                                              type='text'
                                              formatter={(value: any) =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                              }
                                              value={caculator('childFeeInbound')}
                                            />
                                          </>
                                        )}
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            )}
                          </>
                        )}
                      </Form.Item>
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.numInfants !== curValues.numInfants
                        }
                        wrapperCol={{ span: 24 }}
                      >
                        {() => (
                          <>
                            {parseInt(form.getFieldValue('numInfants')) > 0 && (
                              <Row>
                                <Col span={8}>Giá vé em bé</Col>
                                <Col span={16}>
                                  <Row gutter={10}>
                                    <Col span={6}>
                                      <Form.Item
                                        wrapperCol={{ span: 24 }}
                                        name={['infantFeeInbound', 'fare']}
                                        rules={[
                                          {
                                            required: true,
                                            message: intl.formatMessage({
                                              id: 'IDS_TEXT_REQUIRED',
                                            }),
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          type='text'
                                          formatter={(value: any) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                          }
                                          placeholder='Nhập'
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item
                                        wrapperCol={{ span: 24 }}
                                        name={['infantFeeInbound', 'admin']}
                                        rules={[
                                          {
                                            required: true,
                                            message: intl.formatMessage({
                                              id: 'IDS_TEXT_REQUIRED',
                                            }),
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          type='text'
                                          formatter={(value: any) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                          }
                                          placeholder='Nhập'
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item
                                        wrapperCol={{ span: 24 }}
                                        name={['infantFeeInbound', 'tax']}
                                        rules={[
                                          {
                                            required: true,
                                            message: intl.formatMessage({
                                              id: 'IDS_TEXT_REQUIRED',
                                            }),
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          type='text'
                                          formatter={(value: any) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                          }
                                          placeholder='Nhập'
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item
                                        style={{ marginBottom: 0 }}
                                        shouldUpdate={(prevValues, curValues) =>
                                          prevValues.infantFeeInbound !== curValues.infantFeeInbound
                                        }
                                        wrapperCol={{ span: 24 }}
                                      >
                                        {() => (
                                          <>
                                            <InputNumber
                                              style={{ width: '100%' }}
                                              disabled
                                              type='text'
                                              formatter={(value: any) =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                              }
                                              value={caculator('infantFeeInbound')}
                                            />
                                          </>
                                        )}
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            )}
                          </>
                        )}
                      </Form.Item>

                      <Row>
                        <Col span={8}>Tổng vé chiều về</Col>
                        <Col span={16}>
                          <Form.Item
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.adultFeeInbound !== curValues.adultFeeInbound ||
                              prevValues.childFeeInbound !== curValues.childFeeInbound ||
                              prevValues.infantFeeInbound !== curValues.infantFeeInbound
                            }
                            wrapperCol={{ span: 24 }}
                          >
                            {() => (
                              <>
                                <InputNumber
                                  style={{ width: '100%' }}
                                  disabled
                                  type='text'
                                  formatter={(value: any) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  }
                                  value={caculatorTotal([
                                    'adultFeeInbound',
                                    'childFeeInbound',
                                    'infantFeeInbound',
                                  ])}
                                />
                              </>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        name={['inboundTicketInformations', 'processingFeeUnit']}
                        label='Phí dịch vụ/ người'
                        labelCol={{ span: 8 }}
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          type='text'
                          formatter={(value: any) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }
                          placeholder='Nhập số tiền'
                        />
                      </Form.Item>
                    </>
                  )}
                </>
              )}
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default InfoCustomerStep2;
