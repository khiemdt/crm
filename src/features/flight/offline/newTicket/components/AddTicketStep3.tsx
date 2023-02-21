import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Popover,
  Row,
  Select,
  Switch,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { checkCode, createPayment, getFlightBookings } from '~/apis/flight';
import { routes, some } from '~/utils/constants/constant';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
const { RangePicker } = DatePicker;
const { Option } = Select;

let timeoutSearch: any = null;
let bookingId: any = null;
let searchRequestId: any = null;
let historyId: any = null;

const AddTicketStep3 = () => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<some>({});
  const [promotion, setPromotion] = useState<some>({});

  const fetFlightBookings = async () => {
    try {
      const { data } = await getFlightBookings({ filters: { dealId: bookingId } });
      if (data.code === 200) {
        setBooking(data?.data?.bookings[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hanldeCheckCode = async () => {
    try {
      const { data } = await checkCode({
        bookingId: parseInt(bookingId),
        code: form.getFieldValue('code'),
        paymentMethodId: booking.paymentMethodId,
        module: 'flight',
      });
      if (data.code === 200) {
        setPromotion(data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {}
  };

  const onFinish = async (values: some) => {
    if (!isEmpty(promotion)) {
      const dataDTO: some = {
        ...values,
        bookingId: booking.id,
        module: 'flight',
        paymentMethodId: booking.paymentMethodId,
        promotionCode: values.code,
      };
      delete dataDTO.code;
      const { data } = await createPayment(dataDTO);
      if (data.code === 200) {
      } else {
        message.error(data.message);
      }
    } else {
      navigate(`/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_OFFLINE}`);
    }
  };

  const handleChangeStep = () => {
    // let params: some = {
    //   historyId,
    //   searchRequestId,
    // };
    navigate({
      pathname: `/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_OFFLINE}`,
    });
  };

  useEffect(() => {
    for (const entry of searchParams.entries()) {
      const [param, value] = entry;
      if (param === 'bookingId') {
        bookingId = value;
        fetFlightBookings();
      } else if (param === 'searchRequestId') {
        searchRequestId = value;
      } else if (param === 'historyId') {
        historyId = value;
      }
    }
  }, []);

  return (
    <>
      <h2>Thông tin thanh toán</h2>
      <Form
        form={form}
        className='form-create-info-user-ticket'
        layout='vertical'
        scrollToFirstError
        colon={false}
        onFinish={onFinish}
        initialValues={{
          code: undefined,
        }}
        onValuesChange={(changedValues, allValues) => {}}
      >
        <Form.Item name='isEdit' hidden>
          <Input />
        </Form.Item>
        <div className='item-info-container'>
          <Row>
            <Col span={10}>
              <Row gutter={12}>
                <Col span={18}>
                  <Form.Item name='code' label='Thêm mã giảm giá'>
                    <Input placeholder='Nhập' />
                  </Form.Item>
                </Col>
                <Col span={6} style={{ paddingTop: 24 }}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    shouldUpdate={(prevValues, curValues) => prevValues.code !== curValues.code}
                  >
                    {() => (
                      <Button
                        type='primary'
                        disabled={isEmpty(form.getFieldValue('code'))}
                        onClick={hanldeCheckCode}
                      >
                        Áp dụng
                      </Button>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {!isEmpty(booking) && (
                <>
                  <Row gutter={12} style={{ paddingBottom: 8 }}>
                    <Col span={18}>Tổng giá trị đơn hàng</Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                      {formatMoney(booking?.totalSellingPrice)}
                    </Col>
                  </Row>
                  <Row gutter={12} style={{ paddingBottom: 8 }}>
                    <Col span={18}>Mã giảm giá </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                      {formatMoney(promotion?.discount || 0)}
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col span={18}>Tổng tiền thu khách</Col>
                    <Col span={6} style={{ textAlign: 'right', color: '#FF2C00', fontWeight: 500 }}>
                      {formatMoney(booking?.totalSellingPrice - (promotion?.discount || 0))}
                    </Col>
                  </Row>
                </>
              )}
            </Col>
            <Col span={14}></Col>
          </Row>
        </div>

        <Row style={{ marginTop: 12 }}>
          <Button onClick={handleChangeStep}>Hủy</Button>
          {/* <Button
            style={{ marginLeft: 8 }}
            className='btn-preview'
            onClick={(event) => {
              window.open(`/sale/flight/offline/${booking?.id}`, '_blank');
            }}
          >
            Xem trước
          </Button> */}
          <Button style={{ marginLeft: 8 }} type='primary' htmlType='submit'>
            Hoàn thành
          </Button>
        </Row>
      </Form>
    </>
  );
};
export default AddTicketStep3;
