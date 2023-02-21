import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { updateFlightGuestInfo } from '~/apis/flight';
import { IconCalendar, IconChevronDown } from '~/assets';
import { MODAL_KEY_MENU } from '~/features/flight/constant';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { listAgeCategory, listGender } from '~/utils/constants/dataOptions';
import { DATE_FORMAT } from '~/utils/constants/moment';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

interface Props {
  visibleModal: any;
  setVisibleModal: any;
}

const ListCustomerUpload: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);

  const { visibleModal, setVisibleModal } = props;
  const initialValues = {
    bookingId: booking.id,
    updates:
      booking.guests.length == visibleModal?.data?.length
        ? visibleModal?.data?.map((el: some, inx: number) => ({
            dob: el['Ngày sinh'] ? moment(el['Ngày sinh'], DATE_FORMAT) : null,
            firstName: el['Tên'],
            gender: el['Giới tính'] == 'Nam' ? 'M' : 'F',
            guestId: booking.guests[inx].id,
            ageCategory:
              el['Độ tuổi'] == 'Người lớn'
                ? 'adult'
                : el['Độ tuổi'] == 'Trẻ em'
                ? 'children'
                : 'baby',
            lastName: el['Họ'],
            type: booking.guests[inx]?.type,
            outboundEticketNumber: booking.guests[inx]?.outboundEticketNo,
            inboundEticketNumber: booking.guests[inx]?.inboundEticketNo,
            nationalityCode: booking.guests[inx]?.nationality,
            passport: booking.guests[inx]?.passport,
            passportCountryCode: booking.guests[inx]?.passportCountry,
            passportExpiry: booking.guests[inx]?.passportExpiry,
            accompanyPersonIndex: booking.guests[inx]?.accompanyPersonIndex,
          }))
        : [],
  };

  const listAdutls =
    initialValues?.updates
      ?.filter((el: some) => el?.ageCategory == 'adult')
      .map((el: some, index: number) => ({
        id: index,
        name: `Người lớn ${index + 1} `,
      })) || [];

  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const handleClose = () => {
    setVisibleModal({ data: null, type: null });
  };

  const confirmModal = (params: some) => {
    Modal.confirm({
      title: 'Tải lên thông tin khách hàng',
      content: 'Vui lòng xác nhận kỹ thông tin trước khi tải lên!',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        onFinish(params);
      },
    });
  };

  const onFinish = async (params: some) => {
    setLoading(true);
    const queryParams: some = {
      bookingId: booking.id,
      updates: params.updates?.map((el: some) => ({
        ...el,
        dob: el.dob.format('DD-MM-YYYY'),
      })),
    };
    try {
      const { data } = await updateFlightGuestInfo(queryParams);
      if (data.code === 200) {
        message.success('Tải lên thành công');
        handleClose();
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaulAccompanyPersonIndex = () => {
    let inx = 0;
    initialValues?.updates?.forEach((element: some) => {
      if (element.ageCategory == 'baby') {
        if (inx == listAdutls.length) {
          inx = 0;
        }
        element.accompanyPersonIndex = inx;
        inx++;
      }
    });
  };

  useEffect(() => {
    if (listAdutls) {
      getDefaulAccompanyPersonIndex();
    }
  }, [listAdutls, initialValues]);
  useEffect(() => {
    if (isEmpty(visibleModal)) {
      form.resetFields();
    } else {
      form.setFieldsValue(initialValues);
    }
  }, [booking, visibleModal]);
  return (
    <Modal
      className='wrapperModal'
      visible={visibleModal.type == MODAL_KEY_MENU.UPLOAD_FILE_EXCEL}
      onCancel={handleClose}
      footer={false}
      width={900}
      title='Xác nhận thông tin hành khách'
    >
      {isEmpty(initialValues.updates) ? (
        <span>Số lượng khách hàng không phù hợp</span>
      ) : (
        <Form
          form={form}
          initialValues={initialValues}
          hideRequiredMark
          layout='vertical'
          onFinish={confirmModal}
        >
          <div className='item-info-container'>
            <div>
              <Row gutter={4}>
                <Col span={1}>Stt</Col>
                <Col span={3}>Độ tuổi</Col>
                <Col span={3}>Giới tính</Col>
                <Col span={4}>Họ</Col>
                <Col span={5}>Tên</Col>
                <Col span={4}>Ngày sinh</Col>
                <Col span={4}>Đi cùng người lớn</Col>
              </Row>
            </div>
            <div className='list-guests'>
              <Form.List name='updates'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, idx) => {
                      return (
                        <div key={idx} className='item-guest'>
                          <Row gutter={4}>
                            <Col span={1}>{idx + 1}</Col>
                            <Col span={3}>
                              <Form.Item
                                name={[field.name, 'ageCategory']}
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
                                  {listAgeCategory.map((el: some, indx: number) => (
                                    <Select.Option key={el.code} value={el.code}>
                                      {el.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item
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
                            <Col span={4}>
                              <Form.Item
                                name={[field.name, 'lastName']}
                                rules={[
                                  {
                                    required: true,
                                    message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                  },
                                ]}
                              >
                                <Input
                                  placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_SUBJECT' })}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={5}>
                              <Form.Item
                                name={[field.name, 'firstName']}
                                rules={[
                                  {
                                    required: true,
                                    message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                  },
                                ]}
                              >
                                <Input
                                  placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_SUBJECT' })}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                name={[field.name, 'dob']}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                  {
                                    required: true,
                                    message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                  },
                                ]}
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
                              {form.getFieldValue('updates')[idx].ageCategory == 'baby' && (
                                <Form.Item
                                  name={[field.name, 'accompanyPersonIndex']}
                                  wrapperCol={{ span: 24 }}
                                  // rules={[
                                  //   {
                                  //     required: true,
                                  //     message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                  //   },
                                  // ]}
                                >
                                  <Select
                                    placeholder='Chọn'
                                    suffixIcon={<IconChevronDown />}
                                    optionFilterProp='children'
                                  >
                                    {listAdutls?.map((el: some, indx: number) => (
                                      <Select.Option key={el.id} value={el.id}>
                                        {el.name}
                                      </Select.Option>
                                    ))}
                                  </Select>
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

          <div className='wrapperSubmitSms'>
            <Button onClick={() => handleClose()}>
              <FormattedMessage id='IDS_TEXT_SKIP' />
            </Button>
            <Form.Item shouldUpdate className='buttonSubmit'>
              {() => {
                return (
                  <Button loading={isLoading} type='primary' htmlType='submit'>
                    <FormattedMessage id='IDS_TEXT_SEND' />
                  </Button>
                );
              }}
            </Form.Item>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ListCustomerUpload;
