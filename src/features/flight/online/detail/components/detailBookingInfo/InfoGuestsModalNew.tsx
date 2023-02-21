import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { updateFlightGuestInfo } from '~/apis/flight';
import {
  IconCalendar,
  IconChevronDown,
  IconCloseNoneCycle,
  IconEditBlue,
  IconInfomation,
} from '~/assets';
import { MODAL_KEY_MENU } from '~/features/flight/constant';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import '~/features/flight/online/detail/FlightDetail.scss';
import { some } from '~/utils/constants/constant';
import { listGender } from '~/utils/constants/dataOptions';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

const getEatGuest = (
  guestId: number,
  ancillaries: some[],
  isDeparture: boolean,
  ancillaryType: string,
) => {
  let result: some[] = [];
  ancillaries.forEach((el: some) => {
    if (el.departure === isDeparture) {
      el.items.forEach((item: some) => {
        if (item.guestId === guestId && item.ancillaryType === ancillaryType) {
          result.push({
            quantity: item.quantity,
            title: item.title,
            price: item.price,
            ancillaryBookingId: item.ancillaryBookingId,
          });
        }
      });
    }
  });

  return result;
};

let countApiUpdate = 0;

const InfoGuestsModalNew = (props: any) => {
  const { visibleModal, setVisibleModal } = props;
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const [data, setData] = useState(booking?.guests || []);

  const handleCloseModal = () => {
    if (countApiUpdate > 0) {
      dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
    }
    setVisibleModal({
      type: null,
      data: null,
    });
  };

  useEffect(() => {
    if (visibleModal) {
      countApiUpdate = 0;
      setData(booking?.guests);
    }
  }, [visibleModal]);

  return (
    <Modal
      className='modal-delete-invoice modal-info-guests'
      visible={visibleModal}
      onCancel={handleCloseModal}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={1000}
      title='Thông tin hành khách'
    >
      <Button
        className='btn-action'
        onClick={() => {
          setVisibleModal({
            type: MODAL_KEY_MENU.UPLOAD_FILE,
            data: null,
          });
        }}
        style={{ marginLeft: '0px' }}
      >
        Tải lên danh sách hành khách
      </Button>
      <div className='content'>
        {data.map((el: some, idx: number) => (
          <GuestDetail key={el.id} idx={idx} item={el} />
        ))}
      </div>
    </Modal>
  );
};
export default InfoGuestsModalNew;

const GuestDetail = (props: some) => {
  const { item, idx } = props;
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const countries = useAppSelector((state) => state.systemReducer.countries);

  const onFinish = async (values: any) => {
    confirm({
      title: 'Bạn có chắc chắn muốn lưu lại thông tin đã sửa?',
      content: 'Vui lòng xác nhận kỹ thông tin',
      onOk() {
        handleSubmitForm(values);
      },
      onCancel() {},
    });
  };

  const handleSubmitForm = async (values: any) => {
    try {
      const itemUpdate: some = {
        ...item,
        ...values,
        guestId: item.id,
        dob: !isEmpty(values.dob) ? values.dob.format('DD-MM-YYYY') : null,
        passportExpiry: !isEmpty(values.passportExpiry)
          ? values.passportExpiry.format('DD-MM-YYYY')
          : null,
        inboundEticketNumber: values.inboundEticketNo,
        outboundEticketNumber: values.outboundEticketNo,
        nationalityCode: !isEmpty(values.nationality)
          ? countries?.find((el: some) => el.name === values.nationality)?.code
          : null,
        passportCountryCode: !isEmpty(values.passportCountry)
          ? countries?.find((el: some) => el.name === values.passportCountry)?.code
          : null,
        firstName: values.firstName ? values.firstName : item.firstName,
        lastName: values.lastName ? values.lastName : item.lastName,
      };
      delete itemUpdate.inboundEticketNo;
      delete itemUpdate.outboundEticketNo;
      delete itemUpdate.nationality;
      delete itemUpdate.passportCountry;
      const dataDto: some = {
        bookingId: booking.id,
        updates: [itemUpdate],
      };
      const { data } = await updateFlightGuestInfo(dataDto);
      if (data.code === 200) {
        message.success('Cập nhật thông tin thành công!');
        form.setFieldsValue({
          isEdit: false,
          fullName: `${itemUpdate.lastName} ${itemUpdate.firstName}`,
        });
        countApiUpdate += 1;
      } else {
        message.error(data.message);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  return (
    <Form
      form={form}
      scrollToFirstError
      colon={false}
      className='form-add-invoice form-edit-guest'
      initialValues={{
        isEdit: false,
        lastName: item.lastName,
        firstName: item.firstName,
        fullName: item.fullName,
        passport: item.passport,
        gender: item.gender,
        passportExpiry: !isEmpty(item.passportExpiry)
          ? moment(item.passportExpiry, 'DD-MM-YYYY')
          : null,
        dob: !isEmpty(item.dob) ? moment(item.dob, 'DD-MM-YYYY') : null,
        outboundEticketNo: item.outboundEticketNo,
        passportCountry: item.passportCountry,
        inboundEticketNo: item.inboundEticketNo,
        nationality: item.nationality,
      }}
      requiredMark={false}
      onFinish={onFinish}
      onValuesChange={(changedValues) => {}}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      layout='vertical'
    >
      <div className='guest-item'>
        <div className='right-content'>
          <Form.Item
            shouldUpdate={(prevValues, curValues) => prevValues.isEdit !== curValues.isEdit}
            style={{ marginBottom: 0 }}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            {() => {
              const listEat: some[] = getEatGuest(item.id, booking.ancillaries || [], true, 'seat');
              const listEatIn: some[] = getEatGuest(
                item.id,
                booking.ancillaries || [],
                false,
                'seat',
              );
              const listEatReal: some[] = getEatGuest(
                item.id,
                booking.ancillaries || [],
                true,
                'meal',
              );
              const listEatRealIn: some[] = getEatGuest(
                item.id,
                booking.ancillaries || [],
                false,
                'meal',
              );
              return (
                <>
                  <div className='header-content'>
                    <Space>
                      <div className='value-text'>{idx + 1}</div>
                      {form.getFieldValue('isEdit') ? (
                        <>
                          <Form.Item
                            name='lastName'
                            style={{ marginBottom: '0' }}
                            rules={[
                              {
                                required: true,
                                message: `Vui lòng nhập họ và tên`,
                              },
                            ]}
                            labelCol={{ span: 0 }}
                          >
                            <Input allowClear placeholder='Họ' />
                          </Form.Item>
                          <Form.Item
                            name='firstName'
                            style={{ marginBottom: '0' }}
                            rules={[
                              {
                                required: true,
                                message: `Vui lòng nhập họ và tên`,
                              },
                            ]}
                            labelCol={{ span: 0 }}
                          >
                            <Input allowClear placeholder='Tên đệm và tên' />
                          </Form.Item>
                          <Form.Item name='gender' style={{ marginBottom: '0' }}>
                            <Select
                              suffixIcon={
                                !form.getFieldValue('isEdit') ? null : <IconChevronDown />
                              }
                            >
                              {listGender.map((el: some) => (
                                <Select.Option value={el.code} key={el.code}>
                                  {el.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name='dob'
                            style={{ marginBottom: '0' }}
                            hidden={!form.getFieldValue('isEdit') && !form.getFieldValue('dob')}
                          >
                            <DatePicker
                              format='DD/MM/YYYY'
                              allowClear={false}
                              suffixIcon={<IconCalendar />}
                              placeholder={form.getFieldValue('isEdit') ? 'Ngày sinh' : ' '}
                              disabled={!form.getFieldValue('isEdit')}
                            />
                          </Form.Item>
                        </>
                      ) : (
                        <Space size={15}>
                          <span className='value-text'>{item.fullName.toUpperCase()}</span>
                          <span>
                            {`${
                              item.ageCategory == 'adult'
                                ? ' Người lớn '
                                : item.ageCategory == 'children'
                                ? ' Trẻ em '
                                : ' Em bé '
                            }`}
                          </span>
                          <span>{`${item.gender == 'M' ? 'Nam' : 'Nữ'}`}</span>
                          <span>{item.dob}</span>
                        </Space>
                      )}
                    </Space>
                    {form.getFieldValue('isEdit') ? (
                      <>
                        <Button
                          type='text'
                          style={{ color: '#004EBC', padding: '0px 8px' }}
                          htmlType='submit'
                        >
                          Lưu
                        </Button>
                        <Button
                          type='text'
                          style={{ color: '#677072', padding: '0px 8px' }}
                          onClick={() => {
                            form.resetFields();
                          }}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <IconEditBlue
                        className='icon-edit'
                        style={{ marginLeft: '10px' }}
                        onClick={() => form.setFieldsValue({ isEdit: true })}
                      />
                    )}
                  </div>
                  <Row gutter={12} className='body-content'>
                    <Col span={16}>
                      <Row gutter={12}>
                        <Col span={8}>
                          <Form.Item name='outboundEticketNo' label='Số vé chiều đi'>
                            <Input
                              allowClear
                              placeholder={form.getFieldValue('isEdit') ? '' : 'Không có'}
                              disabled={!form.getFieldValue('isEdit')}
                              title={form.getFieldValue('outboundEticketNo')}
                              style={{ paddingLeft: form.getFieldValue('isEdit') ? '' : '0px' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={5} className='value-text'>
                          <Form.Item name='outboundEticketNo' label='Hành lý'>
                            {`${
                              item?.outboundBaggage
                                ? `${item?.outboundBaggage?.weight}kg - (${formatMoney(
                                    item?.outboundBaggage?.price,
                                  )})`
                                : '0kg'
                            }`}
                          </Form.Item>
                        </Col>
                        <Col span={5} className='value-text'>
                          <Form.Item label='Chỗ ngồi'>
                            {!isEmpty(listEat) ? (
                              <div className='value-col-list-eat'>
                                {listEat.map((el, idx) => (
                                  <span className='item-eat' key={idx.toString()}>{`${
                                    el.title
                                  } - ${formatMoney(el?.price || 0)}`}</span>
                                ))}
                              </div>
                            ) : (
                              <span></span>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6} className='value-text'>
                          <Form.Item name='outboundEticketNo' label='Suất ăn'>
                            {!isEmpty(listEatReal) ? (
                              <Tooltip
                                placement='rightTop'
                                title={
                                  <div className='value-col-list-eat'>
                                    {listEatReal.map((el, idx) => (
                                      <span className='item-eat' key={idx.toString()}>{`${
                                        el.quantity
                                      } ${el.title} - ${formatMoney(el?.price || 0)}`}</span>
                                    ))}
                                  </div>
                                }
                              >
                                <span className='btn-info'>
                                  <span style={{ paddingRight: 4 }}>{`${listEatReal.reduce(
                                    (a: number, b: some) => a + b.quantity,
                                    0,
                                  )} suất`}</span>
                                  <IconInfomation />
                                </span>
                              </Tooltip>
                            ) : (
                              <span></span>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      {booking.inbound && (
                        <Row gutter={12}>
                          <Col span={8}>
                            <Form.Item name='inboundEticketNo' label='Số vé chiều về'>
                              <Input
                                allowClear
                                placeholder={form.getFieldValue('isEdit') ? '' : 'Không có'}
                                disabled={!form.getFieldValue('isEdit') || !booking.inbound}
                                title={form.getFieldValue('inboundEticketNo')}
                                style={{ paddingLeft: form.getFieldValue('isEdit') ? '' : '0px' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={5} className='value-text'>
                            <Form.Item name='outboundEticketNo' label='Hành lý'>
                              {`${
                                item?.inboundBaggage
                                  ? `${item?.inboundBaggage?.weight}kg - (${formatMoney(
                                      item?.inboundBaggage?.price,
                                    )})`
                                  : '0kg'
                              }`}
                            </Form.Item>
                          </Col>
                          <Col span={5} className='value-text'>
                            <Form.Item label='Chỗ ngồi'>
                              {!isEmpty(listEatIn) ? (
                                <div className='value-col-list-eat'>
                                  {listEatIn.map((el, idx) => (
                                    <span className='item-eat' key={idx.toString()}>{`${
                                      el.title
                                    } - ${formatMoney(el?.price || 0)}`}</span>
                                  ))}
                                </div>
                              ) : (
                                <span></span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={6} className='value-text'>
                            <Form.Item name='outboundEticketNo' label='Suất ăn'>
                              {!isEmpty(listEatRealIn) ? (
                                <Tooltip
                                  placement='rightTop'
                                  title={
                                    <div className='value-col-list-eat'>
                                      {listEatRealIn.map((el, idx) => (
                                        <span className='item-eat' key={idx.toString()}>{`${
                                          el.quantity
                                        } ${el.title} - ${formatMoney(el?.price || 0)}`}</span>
                                      ))}
                                    </div>
                                  }
                                >
                                  <span className='btn-info'>
                                    <span style={{ paddingRight: 4 }}>{`${listEatRealIn.reduce(
                                      (a: number, b: some) => a + b.quantity,
                                      0,
                                    )} suất`}</span>
                                    <IconInfomation />
                                  </span>
                                </Tooltip>
                              ) : (
                                <span></span>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                    </Col>
                    <Col span={8} className='border-passport'>
                      <Row gutter={12}>
                        <Col span={12}>
                          <Form.Item
                            name='passport'
                            label='Số hộ chiếu'
                            className='title-item-ticket'
                          >
                            <Input allowClear disabled={!form.getFieldValue('isEdit')} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name='passportExpiry'
                            label='Thời hạn hộ chiếu'
                            className='title-item-ticket'
                          >
                            <DatePicker
                              format='DD/MM/YYYY'
                              placeholder={''}
                              allowClear={false}
                              suffixIcon={<IconCalendar />}
                              disabled={!form.getFieldValue('isEdit')}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={12}>
                        <Col span={12}>
                          <Form.Item
                            name='passportCountry'
                            label='Quốc tịch'
                            className='title-item-ticket'
                          >
                            <Select
                              disabled={!form.getFieldValue('isEdit')}
                              suffixIcon={
                                !form.getFieldValue('isEdit') ? null : <IconChevronDown />
                              }
                              showSearch
                              filterOption={(input, option) =>
                                (option!.children as unknown as string)
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              placeholder={''}
                            >
                              {countries.map((el: some, idx: number) => (
                                <Select.Option value={el.name} key={`passportCountry-${idx}`}>
                                  {el.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name='nationality'
                            label='Nước cấp hộ chiếu'
                            className='title-item-ticket'
                          >
                            <Select
                              disabled={!form.getFieldValue('isEdit')}
                              suffixIcon={
                                !form.getFieldValue('isEdit') ? null : <IconChevronDown />
                              }
                              showSearch
                              filterOption={(input, option) =>
                                (option!.children as unknown as string)
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              placeholder={''}
                            >
                              {countries.map((el: some, idx: number) => (
                                <Select.Option value={el.name} key={`nationality-${idx}`}>
                                  {el.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              );
            }}
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};
