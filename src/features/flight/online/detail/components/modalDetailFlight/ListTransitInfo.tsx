import { Col, DatePicker, Form, Row, Select, TimePicker } from 'antd';
import Input from 'antd/lib/input/Input';
import React from 'react';
import { IconCalendar, IconClock } from '~/assets';
import { FORMAT_DATE, FORMAT_TIME } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

interface Props {
  isOutbound: boolean;
}
const ListTransitInfo: React.FC<Props> = ({ isOutbound }) => {
  const form = Form.useFormInstance();

  const dispatch = useAppDispatch();
  const airlines: some[] = useAppSelector((state) => state.systemReducer.airlines);
  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);

  const handleToAirport = (value: some, idx: number) => {
    const result = form.getFieldValue('updates');
    if (result[idx + 1]?.isOutbound == isOutbound) {
      result[idx + 1].fromAirport = result[idx]?.toAirport;
    }
    form.setFieldsValue({ updates: result });
  };

  const handleChangeMKTAirline = (value: string, item: some) => {
    const result = form.getFieldValue('updates');
    console.log(result);

    form.setFieldsValue({
      updates: result.map((el: some) => ({
        ...el,
        marketingAirline: el.isOutbound == item.isOutbound ? value : el.marketingAirline,
      })),
    });
  };

  return (
    <div>
      <div className='title-change-action text-success'>
        {isOutbound ? 'Hành trình 1' : 'Hành trình 2'}:{' '}
        {isOutbound
          ? `${flightOnlineDetail?.outbound?.fromAirport} -> ${flightOnlineDetail?.outbound?.toAirport}`
          : `${flightOnlineDetail?.inbound?.fromAirport} -> ${flightOnlineDetail?.inbound?.toAirport}`}
      </div>
      <Row gutter={10}>
        <Col style={{ textAlign: 'center' }}>
          <span>Chặng</span>
        </Col>
        <Col span={2}>
          <span>Điểm đi</span>
        </Col>
        <Col span={2}>
          <span>Điểm đến</span>
        </Col>
        <Col span={3}>
          <span>Hãng bán vé</span>
        </Col>
        <Col span={3}>
          <span>Hãng vận hành</span>
        </Col>
        <Col span={3}>
          <span>Mã</span>
        </Col>
        <Col span={5}>
          <span>Ngày khởi hành</span>
        </Col>
        <Col>
          <span>Ngày tới nơi</span>
        </Col>
      </Row>
      <Form.List name='updates'>
        {(fields) => {
          return fields.map(({ key, name }, idx) => {
            const item = form.getFieldValue('updates')[idx];
            return (
              item.isOutbound == isOutbound && (
                <div key={key}>
                  <Row gutter={10}>
                    <Col span={1} style={{ textAlign: 'center' }}>
                      <b>{item.leg + 1} </b>
                    </Col>
                    <Col span={2}>
                      <Form.Item
                        name={[name, 'fromAirport']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Vui lòng không được để trống!',
                          },
                        ]}
                      >
                        <Input
                          onInput={(e: some) =>
                            e?.target?.value && (e.target.value = e?.target?.value.toUpperCase())
                          }
                          maxLength={3}
                          disabled={!!item.leg}
                          placeholder='Nhập địa điểm đi'
                        />
                      </Form.Item>
                    </Col>
                    {/* <Col span={1} className='icon-arrow'>
                      <IconArrow />
                    </Col> */}
                    <Col span={2}>
                      <Form.Item
                        name={[name, 'toAirport']}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng không được để trống!',
                          },
                        ]}
                      >
                        <Input
                          onInput={(e: some) =>
                            e?.target?.value && (e.target.value = e?.target?.value.toUpperCase())
                          }
                          maxLength={3}
                          onChange={(value) => handleToAirport(value, idx)}
                          placeholder='Nhập địa điểm đến'
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name={[name, 'marketingAirline']}>
                        <Select
                          disabled={item.leg != 0}
                          placeholder='Hãng bán vé'
                          dropdownStyle={{ width: 180, minWidth: 180 }}
                          showSearch
                          optionFilterProp='children'
                          style={{ height: 32 }}
                          onChange={(value) => {
                            handleChangeMKTAirline(value, item);
                          }}
                        >
                          {airlines.map((elm: some, index: number) => {
                            return (
                              <Select.Option key={index} value={elm?.code}>
                                {elm?.name}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item name={[name, 'operatingAirline']}>
                        <Select
                          placeholder='Hãng vận hành'
                          dropdownStyle={{ width: 180, minWidth: 180 }}
                          showSearch
                          optionFilterProp='children'
                          style={{ height: 32 }}
                        >
                          {airlines.map((elm: some, index: number) => {
                            return (
                              <Select.Option key={index} value={elm?.code}>
                                {elm?.name}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item
                        name={[name, 'flightCode']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Vui lòng không được để trống!',
                          },
                        ]}
                      >
                        <Input placeholder='Nhập mã' />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <Form.Item name={[name, 'airlineClassCode']}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng không được để trống!',
                          },
                        ]}
                        name={[name, 'departureTime']}
                      >
                        <TimePicker
                          format={FORMAT_TIME}
                          suffixIcon={<IconClock />}
                          onSelect={(value) => {
                            const result = form.getFieldValue('updates');
                            form.setFieldsValue({
                              updates: result.map((el: some, index: number) => ({
                                ...el,
                                departureTime: index == idx ? value : el.departureTime,
                              })),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng không được để trống!',
                          },
                        ]}
                        name={[name, 'departureDate']}
                      >
                        <DatePicker
                          format={FORMAT_DATE}
                          suffixIcon={<IconCalendar />}
                          onChange={() => {}}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng không được để trống!',
                          },
                        ]}
                        name={[name, 'arrivalTime']}
                      >
                        <TimePicker
                          format={FORMAT_TIME}
                          suffixIcon={<IconClock />}
                          onChange={() => {}}
                          onSelect={(value) => {
                            const result = form.getFieldValue('updates');
                            form.setFieldsValue({
                              updates: result.map((el: some, index: number) => ({
                                ...el,
                                arrivalTime: index == idx ? value : el.arrivalTime,
                              })),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng không được để trống!',
                          },
                        ]}
                        name={[name, 'arrivalDate']}
                      >
                        <DatePicker
                          format={FORMAT_DATE}
                          suffixIcon={<IconCalendar />}
                          onChange={() => {}}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )
            );
          });
        }}
      </Form.List>
    </div>
  );
};

export default ListTransitInfo;
