import { Button, Col, DatePicker, Form, Input, InputNumber, Popconfirm, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getFlightBaggageList } from '~/apis/flight';
import { IconCalendar, IconChevronDown } from '~/assets';
import { some } from '~/utils/constants/constant';
import { listGender } from '~/utils/constants/dataOptions';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';

let paramsSearchPre = {
  ticketClassCode: '',
  airlineId: '',
};

let paramsSearchPreIn = {
  ticketClassCode: '',
  airlineId: '',
};

const InfoGuestsStep2 = (props: some) => {
  const form = Form.useFormInstance();
  const intl = useIntl();
  const outboundTicketInformations: some = Form.useWatch('outboundTicketInformations', form);
  const inboundTicketInformations: some = Form.useWatch('inboundTicketInformations', form);
  const oneWay: some = Form.useWatch('oneWay', form);
  const [baggageListOutbound, setBaggageListOutbound] = useState<some[]>([]);
  const [baggageListInbound, setBaggageListInbound] = useState([]);

  useEffect(() => {
    const ticketClassCode = outboundTicketInformations?.ticketClassCode;
    const airlineId = outboundTicketInformations?.airlineId;
    if (
      !isEmpty(ticketClassCode) &&
      !isEmpty(airlineId) &&
      (paramsSearchPre.ticketClassCode !== ticketClassCode ||
        paramsSearchPre.airlineId !== airlineId)
    ) {
      fetFlightBaggageList();
    }
  }, [outboundTicketInformations]);

  useEffect(() => {
    const ticketClassCode = inboundTicketInformations?.ticketClassCode;
    const airlineId = inboundTicketInformations?.airlineId;
    if (
      !isEmpty(ticketClassCode) &&
      !isEmpty(airlineId) &&
      (paramsSearchPreIn.ticketClassCode !== ticketClassCode ||
        paramsSearchPreIn.airlineId !== airlineId)
    ) {
      fetFlightBaggageListIn();
    }
  }, [inboundTicketInformations]);

  const fetFlightBaggageList = async () => {
    try {
      const valueTemp = {
        airlineId: outboundTicketInformations?.airlineId,
        ticketClassCode: outboundTicketInformations?.ticketClassCode,
      };
      paramsSearchPre = valueTemp;
      const { data } = await getFlightBaggageList({
        ...valueTemp,
        departureDate: form.getFieldValue('departureDate'),
        fromAirportCode: form.getFieldValue('fromAirport'),
        toAirportCode: form.getFieldValue('toAirport'),
      });
      if (data.code === 200) {
        setBaggageListOutbound(data.data);
        form.setFieldsValue({
          baggageListOutbound: data.data,
        });
      }
    } catch (error) {}
  };

  const fetFlightBaggageListIn = async () => {
    try {
      const valueTemp = {
        airlineId: inboundTicketInformations?.airlineId,
        ticketClassCode: inboundTicketInformations?.ticketClassCode,
      };
      paramsSearchPreIn = valueTemp;
      const { data } = await getFlightBaggageList({
        ...valueTemp,
        returnDate: form.getFieldValue('returnDate'),
        fromAirportCode: form.getFieldValue('fromAirport'),
        toAirportCode: form.getFieldValue('toAirport'),
      });
      if (data.code === 200) {
        setBaggageListInbound(data.data);
        form.setFieldsValue({
          baggageListInbound: data.data,
        });
      }
    } catch (error) {}
  };

  const hanldeSelectedBag = (value: any, idx: number, field: string) => {
    const temp = form.getFieldValue('guests');
    const data = field === 'inboundBaggageAmount' ? baggageListInbound : baggageListOutbound;
    temp[idx] = {
      ...temp[idx],
      [field]: data?.find((el: some) => el.id === value)?.price || 0,
    };
    form.setFieldsValue({
      guests: temp,
    });
  };

  const handleAutoFillGuestsInfo = (stt: boolean) => {
    const temp = form.getFieldValue('guests');
    console.log(temp);
    form.setFieldsValue({
      guests: temp.map((el: some) => ({
        ...el,
        firstName: stt ? 'NGUYEN' : null,
        lastName: stt ? 'VAN A' : null,
        dob: stt ? formatDobAutoFill(el.type) : null,
        outboundEticketNo: stt ? '123' : null,
        inboundEticketNo: oneWay ? null : stt ? '123' : null,
      })),
    });
  };

  const formatDobAutoFill = (type: string) => {
    switch (type) {
      case 'ADULT':
        return moment().add(-18, 'y');
        break;
      case 'CHILD':
        return moment().add(-5, 'y');
        break;
      default:
        return moment().add(-1, 'y');
    }
  };

  return (
    <>
      <Row style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: '32px 0 12px' }}>Thông tin hành khách</h2>
        <Row style={{ margin: '32px 0 12px' }}>
          <Col>
            <Popconfirm
              placement='top'
              title='Bạn có chắc chắn muốn điền tạm thông tin?'
              onConfirm={() => {
                handleAutoFillGuestsInfo(true);
              }}
              okText='Ok'
              cancelText='Hủy'
            >
              <Button type='text'>
                <b className='text-blue'>Điền tạm thông tin</b>
              </Button>
            </Popconfirm>
            <Popconfirm
              placement='top'
              title='Bạn có chắc chắn muốn xóa toàn bộ thông tin?'
              onConfirm={() => {
                handleAutoFillGuestsInfo(false);
              }}
              okText='Ok'
              cancelText='Hủy'
            >
              <Button type='text'>
                <b className='text-danger'>Xóa toàn bộ thông tin</b>
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      </Row>
      <div className='item-info-container'>
        <div style={{ padding: '0 12px 12px' }}>
          <Row gutter={16}>
            <Col span={1}>Stt</Col>
            <Col span={2}>Độ tuổi</Col>
            <Col span={2}>Giới tính</Col>
            <Col span={3}>Họ</Col>
            <Col span={3}>Tên</Col>
            <Col span={3}>Ngày sinh</Col>
            <Col span={4}>
              <Row>
                <Col span={8}></Col>
                <Col span={16}>Hành lý</Col>
              </Row>
            </Col>
            <Col span={3}>Số khác(nếu có)</Col>
            <Col span={3}>Số vé</Col>
          </Row>
        </div>

        <div className='list-guests'>
          <Form.List name='guests'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, idx) => {
                  const item = form.getFieldValue('guests')[idx];
                  return (
                    <div key={idx} className='item-guest'>
                      <Row gutter={16}>
                        <Col span={1}>{idx + 1}</Col>
                        <Col span={2}>
                          {item.type === 'ADULT'
                            ? 'Người lớn'
                            : item.type === 'CHILD'
                            ? 'Trẻ em'
                            : 'Em bé'}
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            //   {...field}
                            name={[field.name, 'gender']}
                            wrapperCol={{ span: 24 }}
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
                              {listGender.map((el: some, indx: number) => (
                                <Select.Option key={el.code} value={el.code}>
                                  {el.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            //   {...field}
                            name={[field.name, 'firstName']}
                            wrapperCol={{ span: 24 }}
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                              },
                            ]}
                          >
                            <Input placeholder='Nhập' />
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            //   {...field}
                            name={[field.name, 'lastName']}
                            wrapperCol={{ span: 24 }}
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                              },
                            ]}
                          >
                            <Input placeholder='Nhập' />
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            //   {...field}
                            name={[field.name, 'dob']}
                            wrapperCol={{ span: 24 }}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                            //   },
                            // ]}
                          >
                            <DatePicker
                              className='itemForm'
                              format='DD/MM/YYYY'
                              placeholder='dd/mm/yyyy'
                              allowClear={false}
                              suffixIcon={<IconCalendar />}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            //   {...field}
                            name={[field.name, 'outboundBaggageWeight']}
                            label='Chiều đi'
                          >
                            <Select
                              placeholder='Chọn'
                              suffixIcon={<IconChevronDown />}
                              optionFilterProp='children'
                              onChange={(value) =>
                                hanldeSelectedBag(value, idx, 'outboundBaggageAmount')
                              }
                              dropdownMatchSelectWidth={210}
                            >
                              {form
                                .getFieldValue('baggageListOutbound')
                                .map((el: some, indx: number) => (
                                  <Select.Option
                                    key={`outbound - ${indx} - ${el.id}`}
                                    value={el.id}
                                  >
                                    {`${el.name} - ${formatMoney(el.price)}`}
                                  </Select.Option>
                                ))}
                            </Select>
                          </Form.Item>
                          {!oneWay && (
                            <Form.Item
                              //   {...field}
                              name={[field.name, 'inboundBaggageWeight']}
                              wrapperCol={{ span: 24 }}
                              label='Chiều về'
                            >
                              <Select
                                placeholder='Chọn'
                                suffixIcon={<IconChevronDown />}
                                optionFilterProp='children'
                                onChange={(value) =>
                                  hanldeSelectedBag(value, idx, 'inboundBaggageAmount')
                                }
                                dropdownMatchSelectWidth={210}
                              >
                                {form
                                  .getFieldValue('baggageListInbound')
                                  .map((el: some, indx: number) => (
                                    <Select.Option key={`inbound - ${indx}`} value={el.id}>
                                      {`${el.name} - ${formatMoney(el.price)}`}
                                    </Select.Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          )}
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            //   {...field}
                            name={[field.name, 'outboundBaggageAmount']}
                            wrapperCol={{ span: 24 }}
                          >
                            <InputNumber
                              placeholder='Nhập'
                              formatter={(value: string | undefined) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              parser={(value: string | undefined) =>
                                `${value}`.replace(/\$\s?|(,*)/g, '')
                              }
                            />
                          </Form.Item>
                          {!oneWay && (
                            <Form.Item
                              //   {...field}
                              name={[field.name, 'inboundBaggageAmount']}
                              wrapperCol={{ span: 24 }}
                            >
                              <InputNumber
                                placeholder='Nhập'
                                formatter={(value: string | undefined) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                parser={(value: string | undefined) =>
                                  `${value}`.replace(/\$\s?|(,*)/g, '')
                                }
                              />
                            </Form.Item>
                          )}
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            //   {...field}
                            name={[field.name, 'outboundEticketNo']}
                            wrapperCol={{ span: 24 }}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                            //   },
                            // ]}
                          >
                            <Input placeholder='Nhập' />
                          </Form.Item>
                          {!oneWay && (
                            <Form.Item
                              //   {...field}
                              name={[field.name, 'inboundEticketNo']}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                },
                              ]}
                            >
                              <Input placeholder='Nhập' />
                            </Form.Item>
                          )}
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </>
            )}
          </Form.List>
        </div>
      </div>
    </>
  );
};
export default InfoGuestsStep2;
