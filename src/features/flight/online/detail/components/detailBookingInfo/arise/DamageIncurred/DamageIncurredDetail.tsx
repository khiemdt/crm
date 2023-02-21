import { Button, Col, DatePicker, Form, Input, InputNumber, message, Row, Select } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import moment from 'moment';
import { useEffect } from 'react';
import {
  addFlightBookingPostProcessing,
  deleteFlightPostProcessing,
  editFlightPostProcessing,
} from '~/apis/flight';
import { IconCalendar, IconChevronDown } from '~/assets';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import { fetFlightBookingPostProcessing } from '~/features/flight/flightSlice';
import { AirlinesType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { listPostProcessingFly } from '~/utils/constants/dataOptions';
import { removeAccent } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import '../AriseMoreFlight.scss';

let timeoutSearch: any = null;

const colStyles = {
  flexBasis: '20%',
  width: '20%',
};

export const listPostProcessingEdit = [
  {
    id: 'Thiệt hại',
    name: 'Thiệt hại',
  },
  {
    id: 'Được lợi',
    name: 'Được lợi',
  },
];

const DamageIncurredDetail = (props: some) => {
  const { record, addItemDone, keyTab, setKeyTab } = props;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { salesList, flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearch);
    };
  }, []);

  const salesListAll = [{ id: 0, name: 'Tất cả' }, ...salesList];

  const listRelatedDepartment = [
    { id: 0, name: 'Hệ thống' },
    { id: 1, name: 'IT' },
    { id: 2, name: 'Marketing' },
    { id: 3, name: 'DVKH' },
    { id: 4, name: 'Kế toán' },
    { id: 5, name: 'Khác' },
  ];

  const listTicketNumber = (number: number) => {
    let ticketNumber = [];
    for (let index = 1; index < number; index++) {
      ticketNumber.push({
        id: index,
        name: `${index} vé`,
      });
    }
    return ticketNumber;
  };

  const fetData = () => {
    dispatch(fetFlightBookingPostProcessing({ bookingId: flightOnlineDetail?.id }));
  };

  const hanldeDeleteItem = async () => {
    try {
      const { data } = await deleteFlightPostProcessing({
        id: record.id,
      });
      if (data.code === 200) {
        message.success('Xóa phát sinh thêm thành công!');
        fetData();
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!');
      }
    } catch (error) {}
  };

  const onFinish = async (values: any) => {
    const isAdd = record.id === 'yuhcouqnart';
    if (!isAdd) {
      showConfirm(false);
      return null;
    }

    const eticketData = values?.eticketData
      ?.filter((val: some) => val?.eticketNumber)
      ?.map((val: some) => {
        return {
          eticketNumber: val?.eticketNumber,
          fee: 0,
          price: val?.price,
        };
      });

    const eticketPrice =
      values?.price -
      eticketData
        ?.map((val: some) => val?.price)
        ?.reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    const bodyData = {
      processingTime: values.processingTime.format('DD-MM-YYYY'),
      isOutbound: values?.isOutbound,
      saleId: values?.saleId,
      relatedSaleId: values?.relatedSaleId,
      pnrCode: values?.pnrCode,
      eticketData: eticketData,
      airlineId: values?.airlineId,
      type: values?.type,
      saleName:
        values.saleId === 0
          ? 'Tất cả'
          : `${salesList.find((el: some) => el.id === values.saleId)?.name}`,
      relatedDepartment: listRelatedDepartment?.find(
        (el: some) => el?.id === values?.relatedDepartment,
      )?.name,
      relatedSaleName:
        values?.relatedSaleId === 0
          ? 'Tất cả'
          : `${salesList.find((el: some) => el.id === values?.relatedSaleId)?.name}`,
      price: values?.price,
      note: values?.note,
      group: 'loss',
      bookingId: flightOnlineDetail?.id,
      lossAmount: eticketPrice,
    };

    try {
      const { data } = await addFlightBookingPostProcessing(bodyData);
      if (data.code === 200) {
        message.success('Thêm mới thiệt hại thành công!');
        form.resetFields();
        fetData();
        addItemDone();
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra');
      }
    } catch (error) {}
  };

  const handleEditItem = async () => {
    const values = form.getFieldsValue(true);
    const eticketData = values?.eticketData
      ?.filter((val: some) => val?.eticketNumber)
      ?.map((val: some) => {
        return {
          eticketNumber: val?.eticketNumber,
          fee: 0,
          price: val?.price,
        };
      });

    const eticketPrice =
      values?.price -
      eticketData
        ?.map((val: some) => val?.price)
        ?.reduce((previousValue: number, currentValue: number) => previousValue + currentValue);

    const bodyData = {
      ...record,
      processingTime: values.processingTime.format('DD-MM-YYYY'),
      isOutbound: values?.isOutbound,
      saleId: values?.saleId,
      relatedSaleId: values?.relatedSaleId,
      pnrCode: values?.pnrCode,
      eticketData: eticketData,
      type: values?.type,
      saleName:
        values.saleId === 0
          ? 'Tất cả'
          : `${salesList.find((el: some) => el.id === values.saleId)?.name}`,
      relatedDepartment: listRelatedDepartment?.find(
        (el: some) => el?.id === values?.relatedDepartment,
      )?.name,
      relatedSaleName:
        values?.relatedSaleId === 0
          ? 'Tất cả'
          : `${salesList.find((el: some) => el.id === values?.relatedSaleId)?.name}`,
      price: values?.price,
      note: values?.note,
      group: 'loss',
      bookingId: flightOnlineDetail?.id,
      lossAmount: eticketPrice,
    };

    try {
      const { data } = await editFlightPostProcessing(bodyData);
      if (data.code === 200) {
        message.success('Chỉnh sửa phát sinh thiệt hại thành công!');
        fetData();
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!');
      }
    } catch (error) {}
  };

  const showConfirm = (isDelete: boolean) => {
    confirm({
      title: !isDelete
        ? 'Bạn có chắc chắn muốn lưu lại thông tin đã sửa?'
        : 'Bạn có chắc chắn muốn xóa phát sinh này?',
      content: 'Vui lòng xác nhận kỹ thông tin',
      onOk() {
        if (isDelete) {
          hanldeDeleteItem();
        } else {
          handleEditItem();
        }
      },
      onCancel() {},
    });
  };

  const isAdd = record.id === 'yuhcouqnart';
  const relatedDepartment = listRelatedDepartment?.find(
    (val: some, index: number) => val?.name == record?.relatedDepartment,
  );

  return (
    <div>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        hideRequiredMark
        className='filter-form-flight'
        initialValues={{
          type: isAdd ? undefined : record.type,
          processingTime: isAdd ? moment() : moment(record.processingTime),
          saleId: isAdd ? userInfo.id : record.saleId,
          isOutbound: isAdd ? 1 : record.isOutbound,
          airlineId: isAdd ? flightOnlineDetail?.outbound?.airlineId : record.airlineId,
          signIn: isAdd ? undefined : record.signIn,
          pnrCode: isAdd ? flightOnlineDetail.outboundPnrCode : record.pnrCode,
          price: isAdd ? undefined : record.price,
          note: isAdd ? undefined : record.note,
          eticketData: isAdd ? undefined : record.eticketData,
          relatedDepartment: isAdd ? undefined : relatedDepartment?.id,
          relatedSaleId: isAdd ? undefined : record?.relatedSaleId,
        }}
        onFinish={onFinish}
        layout='vertical'
      >
        <Row gutter={12} className='left-filter'>
          <Col style={colStyles}>
            <Form.Item
              name='type'
              label='Loại phát sinh'
              rules={[{ required: true, message: 'Vui lòng chọn loại phát sinh!' }]}
            >
              <Select placeholder='Chọn loại phát sinh' suffixIcon={<IconChevronDown />}>
                {listPostProcessingEdit?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col style={colStyles}>
            <Form.Item
              name='processingTime'
              label='Ngày phát sinh'
              rules={[{ required: true, message: 'Vui lòng nhập ngày phát sinh!' }]}
            >
              <DatePicker
                format='DD-MM-YYYY'
                placeholder='DD-MM-YYYY'
                suffixIcon={<IconCalendar />}
                allowClear={false}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col style={colStyles}>
            <Form.Item
              name='saleId'
              label='Người xử lý'
              rules={[{ required: true, message: 'Vui lòng chọn người xử lý!' }]}
            >
              <Select
                placeholder='Chọn người xử lý'
                optionFilterProp='children'
                suffixIcon={<IconChevronDown />}
                showSearch
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {salesListAll?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col style={colStyles}>
            <Form.Item
              name='relatedDepartment'
              label='Bộ phận liên quan'
              rules={[{ required: true, message: 'Vui lòng chọn bộ phận liên quan' }]}
            >
              <Select
                placeholder='Chọn bộ phận liên quan'
                optionFilterProp='children'
                suffixIcon={<IconChevronDown />}
                showSearch
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {listRelatedDepartment?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col style={colStyles}>
            <Form.Item
              name='relatedSaleId'
              label='Người chịu thiệt hại'
              rules={[{ required: true, message: 'Vui lòng chọn người chịu thiệt hại!' }]}
            >
              <Select
                placeholder='Chọn người xử lý'
                optionFilterProp='children'
                suffixIcon={<IconChevronDown />}
                showSearch
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {salesListAll?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col style={colStyles}>
            <Form.Item
              name='isOutbound'
              label='Chiều xử lý'
              rules={[{ required: true, message: 'Vui lòng chọn chiều xử lý!' }]}
            >
              <Select placeholder='Chọn chiều xử lý' suffixIcon={<IconChevronDown />}>
                {listPostProcessingFly?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col style={colStyles}>
            <Form.Item
              name='airlineId'
              label='Hãng bay'
              rules={[{ required: true, message: 'Vui lòng chọn hãng bay!' }]}
            >
              <Select
                placeholder='Chọn hãng bay'
                suffixIcon={<IconChevronDown />}
                showSearch
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {airlines?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col style={colStyles}>
            <Form.Item
              name='pnrCode'
              label='Mã vé'
              rules={[{ required: true, message: 'Vui lòng chọn mã vé!' }]}
            >
              <Input placeholder='Nhập' />
            </Form.Item>
          </Col>
          <Col
            style={{
              flexBasis: '40%',
            }}
          >
            <Form.List name='eticketData' initialValue={[1]}>
              {(fields, { add, remove }) => {
                return fields.map(({ key, name }) => {
                  const checkTicket = form.getFieldsValue(true)?.eticketData?.length - 1;
                  const isRequired = checkTicket === 0 || checkTicket !== key ? true : false;
                  return (
                    <Row key={key} gutter={16} style={{ flexBasis: '100%' }}>
                      <Col span={12}>
                        <Form.Item
                          label='Số vé'
                          name={[name, 'eticketNumber']}
                          rules={[{ required: isRequired, message: 'Vui lòng nhập số vé!' }]}
                        >
                          <Input
                            placeholder='Chọn số vé'
                            onChange={(e) => {
                              if (checkTicket === key && e) {
                                add();
                                // isEmpty(e.target.value) && remove(fields?.eticketData);
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[name, 'price']}
                          label='Tiền trả hãng'
                          rules={[
                            {
                              required: isRequired,
                              message: 'Vui lòng nhập tiền trả hãng!',
                            },
                          ]}
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
                      </Col>
                    </Row>
                  );
                });
              }}
            </Form.List>
          </Col>

          <Col style={colStyles}>
            <Form.Item
              name='price'
              label='Số tiền thu khách'
              rules={[{ required: true, message: 'Vui lòng nhập số tiền thu khách!' }]}
            >
              <InputNumber
                placeholder='Nhập'
                formatter={(value: string | undefined) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: string | undefined) => `${value}`.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col
            style={{
              flexBasis: '80%',
            }}
          >
            <Form.Item
              name='note'
              label='Lý do'
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
            >
              <Input placeholder='Nhập lý do' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <div className='action-form'>
            {isAdd ? (
              <>
                <Button type='primary' htmlType='submit'>
                  Tạo
                </Button>
                <Button
                  className='action-remover'
                  onClick={() => {
                    setKeyTab({ ...keyTab, type: '' });
                    form.resetFields();
                  }}
                >
                  Bỏ qua
                </Button>
              </>
            ) : (
              <>
                <Button type='primary' htmlType='submit'>
                  Lưu
                </Button>
                <Button className='action-remover' onClick={() => showConfirm(true)}>
                  Xóa
                </Button>
              </>
            )}
          </div>
        </Row>
      </Form>
    </div>
  );
};

export default DamageIncurredDetail;
