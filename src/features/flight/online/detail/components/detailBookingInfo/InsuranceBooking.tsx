import { Button, Divider, Form, message, Popconfirm, Row, Select } from 'antd';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { adminBookInsurance, fetchUpdateFlightTaskBookStatus } from '~/apis/flight';
import { IconCalenderMove, IconEdit, IconInsurance } from '~/assets';
import { TASK_TYPES } from '~/features/flight/constant';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import {
  formatMoney,
  insuranceBookStatuses,
  isEmpty,
  isHandling,
  listFlightTaskBookStatus,
  taskPaymentStatusFlight,
  taskStatusFlight,
} from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import PopoverFlightTask from './popover/PopoverFlightTask';

const InsuranceBooking = () => {
  const { Option } = Select;
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const [insuranceStatus, setInsuranceStatus] = useState(
    insuranceBookStatuses(booking.insuranceBookStatus, booking.paymentStatus),
  );
  const [editTaskStatus, setEditTaskStatus] = useState<any>(null);
  const [form] = Form.useForm();
  const userInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const isHandLing = isHandling(booking, userInfo);
  const intl = useIntl();

  const updateFlightTaskBookStatus = async (queryParams: any) => {
    try {
      const { data } = await fetchUpdateFlightTaskBookStatus(queryParams);
      if (data.code === 200) {
        message.success(' Cập nhật trạng thái thành công!');
        setEditTaskStatus(null);
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const reBookInsuranceChubb = async () => {
    const queryParams = {
      bookingId: booking.id,
    };
    try {
      const { data } = await adminBookInsurance(queryParams);
      if (data.code === 200) {
        message.success(intl.formatMessage({ id: 'IDS_TEXT_INSURANCE_RESET_SUCCESS' }));
        setInsuranceStatus(insuranceBookStatuses('success', ''));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className='insurance-booking'
      style={{
        padding: isEmpty(booking.insuranceBookStatus) && isEmpty(booking.tasks) ? '0px' : '20px',
      }}
    >
      {booking.insuranceBookStatus && (
        <Row className='insurance-box'>
          <IconInsurance />
          <span>Bảo hiểm</span>
          <b style={{ color: insuranceStatus.color }}>{insuranceStatus.title} </b>
          {booking.insuranceBookStatus !== 'success' && (
            <>
              <Popconfirm
                placement='topRight'
                title='Bạn có chắc muốn đặt lại bảo hiểm?'
                okText='Đồng ý'
                cancelText='Hủy'
                onConfirm={() => reBookInsuranceChubb()}
              >
                <Button className='relay-btn' type='primary'>
                  <FormattedMessage id={'IDS_TEXT_RELAY'} />
                </Button>
              </Popconfirm>
            </>
          )}
          {booking?.insuranceContact?.contractLink && (
            <a href={booking?.insuranceContact?.contractLink}>
              <span className='text-blue'>(HDBH) </span>
            </a>
          )}
          <div style={{ flex: 1 }}>
            <Divider style={{ margin: '10px 0px' }} />
          </div>
          {formatMoney(booking.insuranceAmount)}
        </Row>
      )}
      {booking?.tasks?.map((task: some) => (
        <Row key={task.id} className='insurance-box'>
          <IconCalenderMove />
          <PopoverFlightTask
            children={<span className='text-blue'>{task?.paymentDescription}</span>}
            title={
              task.type == TASK_TYPES.CHANGE_ITINERARY ? 'Thông tin thay đổi' : 'Thông tin chi tiết'
            }
            content={task}
          />
          <span>{task.created} </span>
          {editTaskStatus == task.id ? (
            <Form
              id={task.id}
              form={form}
              initialValues={{
                [`bookStatus_${task.id}`]: task?.bookStatus,
              }}
              className='form-code'
            >
              <Form.Item name={`bookStatus_${task.id}`}>
                <Select size='small' style={{ width: 200 }}>
                  {listFlightTaskBookStatus?.map((value: some) => {
                    return (
                      <Option disabled={value?.disable} key={value.stt} value={value.stt}>
                        {value.title}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Popconfirm
                placement='top'
                title='Bạn có chắc chắn muốn update trạng thái?'
                onConfirm={() => {
                  updateFlightTaskBookStatus({
                    taskId: task?.id,
                    bookStatus: form?.getFieldValue(`bookStatus_${task.id}`),
                  });
                }}
                okText='Ok'
                cancelText='Hủy'
              >
                <Button htmlType='submit' type='primary'>
                  Lưu
                </Button>
              </Popconfirm>
              <Button
                onClick={() => {
                  setEditTaskStatus(null);
                }}
              >
                Hủy
              </Button>
            </Form>
          ) : (
            <>
              <span style={{ color: taskStatusFlight(task.bookStatus).color }}>
                {taskStatusFlight(task.bookStatus).title}
              </span>
              <span>{task?.paymentMethod?.name}</span>
              <span
                className='border-status'
                style={{
                  color: taskPaymentStatusFlight(task?.paymentStatus)?.color,
                }}
              >
                {taskPaymentStatusFlight(task?.paymentStatus)?.title}
              </span>
              {isHandLing && (
                <IconEdit
                  className='pointer'
                  onClick={() => {
                    form.resetFields();
                    setEditTaskStatus(task.id);
                  }}
                />
              )}
            </>
          )}
          <div style={{ flex: 1 }}>
            <Divider style={{ margin: '10px 0px' }} />
          </div>
          {`${formatMoney(task?.amount)}`}
        </Row>
      ))}
    </div>
  );
};
export default InsuranceBooking;
