import { Button, Col, DatePicker, Form, Input, message, Modal, Row, TimePicker } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { updateItineraryInfo } from '~/apis/flight';
import { IconArrow, IconCalendar, IconClock, IconCloseOutline, IconWarning } from '~/assets';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import { FORMAT_DATE, FORMAT_TIME, FORMAT_TIME_BACKEND } from '~/features/flight/constant';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { FORMAT_DATE_BACKEND } from './../../../../constant';
import ListTransitInfo from './ListTransitInfo';

interface Props {
  open: boolean;
  handleClose: () => void;
}

let valueTemps = {};
const EditChangeAction: React.FC<Props> = ({ open, handleClose }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);

  const initialValueForm = () => {
    const { outbound, inbound, returnInfo, departureInfo, id } = flightOnlineDetail;
    console.log(departureInfo);

    let result: some = [];
    result = result?.concat(
      departureInfo.flights.map((el: some, idx: number) => ({
        isOutbound: true,
        outbound: true,
        transit: !departureInfo.isStraightFlight,
        ticketId: el?.transitTicketId || el?.ticketId,
        fromAirport: el?.fromAirport,
        toAirport: el?.toAirport,
        marketingAirline: el.marketingAirline,
        operatingAirline: el.operatingAirline,
        departureTime: moment(el?.departureTime, FORMAT_TIME),
        departureDate: moment(el?.departureDate, FORMAT_DATE),
        arrivalTime: moment(el?.arrivalTime, FORMAT_TIME),
        arrivalDate: moment(el?.arrivalDate, FORMAT_DATE),
        flightCode: el?.flightCode,
        airlineClassCode: el?.airlineClassCode,
        leg: idx,
      })),
    );
    if (inbound) {
      result = result?.concat(
        returnInfo.flights.map((el: some, idx: number) => ({
          isOutbound: false,
          outbound: false,
          transit: !returnInfo.isStraightFlight,
          ticketId: el?.transitTicketId || el?.ticketId,
          fromAirport: el?.fromAirport,
          toAirport: el?.toAirport,
          marketingAirline: el.marketingAirline,
          operatingAirline: el.operatingAirline,
          departureTime: moment(el?.departureTime, FORMAT_TIME),
          departureDate: moment(el?.departureDate, FORMAT_DATE),
          arrivalTime: moment(el?.arrivalTime, FORMAT_TIME),
          arrivalDate: moment(el?.arrivalDate, FORMAT_DATE),
          flightCode: el?.flightCode,
          airlineClassCode: el?.airlineClassCode,
          leg: idx,
        })),
      );
    }
    return result;
  };

  const fetUpdateItineraryInfo = async (query = {}) => {
    const param = {
      bookingId: flightOnlineDetail.id,
      updates: query,
    };
    try {
      const { data } = await updateItineraryInfo(param);
      if (data.code === 200) {
        message.success('Thông tin thay đổi thành công');
        handleCloseModal();
        dispatch(fetFlightBookingsDetail({ filters: { dealId: flightOnlineDetail?.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    form.resetFields();
    handleClose();
  };

  const onFinish = (values: some) => {
    const covertItinerary = values?.updates?.map((val: some) => ({
      ...val,
      departureTime: `${val?.departureDate?.format(
        FORMAT_DATE_BACKEND,
      )} ${val?.departureTime?.format(FORMAT_TIME_BACKEND)}`,
      arrivalTime: `${val?.arrivalDate?.format(FORMAT_DATE_BACKEND)} ${val?.arrivalTime?.format(
        FORMAT_TIME_BACKEND,
      )}`,
    }));
    confirm({
      title: 'Chỉnh sửa hành trình',
      content: 'Hãy chắc chắn rằng bạn muốn sửa hành trình',
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      wrapClassName: 'wrap-show-confirm',
      onOk() {
        fetUpdateItineraryInfo(covertItinerary);
      },
    });
  };

  useEffect(() => {
    valueTemps = form.getFieldsValue(true);
  }, []);

  useEffect(() => {
    open && form.setFieldsValue({ updates: initialValueForm() });
  }, [open]);

  const selfHandling =
    flightOnlineDetail.handlingStatus == 'handling' &&
    flightOnlineDetail.lastSaleId === userInfo.id;

  const isShowButtonSave = flightOnlineDetail?.handlingStatus == 'handling' && selfHandling;
  // selfHandling &&
  // flightOnlineDetail?.status == 'success';
  console.log(isShowButtonSave);

  return (
    <Modal
      className='wrapper-modal'
      title={<div className='title-modal'>Sửa thông tin hành trình</div>}
      visible={open}
      footer={false}
      closeIcon={<IconCloseOutline />}
      onCancel={handleCloseModal}
      width={1200}
    >
      <Form
        form={form}
        hideRequiredMark
        layout='vertical'
        className='wrapper-form-change-action'
        onFinish={onFinish}
        initialValues={{
          bookingId: flightOnlineDetail?.id || 'aa',
          isStraightFlight: false,
          updates: initialValueForm(),
        }}
      >
        <Row>
          <Col>
            <div className='wrapper-box-warning-modal'>
              <div>
                <IconWarning />
              </div>
              <span>
                Chỉnh sửa thông tin hành trình có thể ảnh hưởng đến các nghiệp vụ sau khi booking và
                gây thiệt hại. Yêu cầu người dùng thực hiện thao tác và cập nhật chính xác thông tin
                booking.
              </span>
            </div>
          </Col>
        </Row>
        <ListTransitInfo isOutbound={true} />
        {flightOnlineDetail.inbound && <ListTransitInfo isOutbound={false} />}
        <Row className='wrapperSubmitSms'>
          <Button
            onClick={() => {
              handleCloseModal();
            }}
          >
            <FormattedMessage id='IDS_TEXT_SKIP' />
          </Button>
          {isShowButtonSave && (
            <Form.Item shouldUpdate className='buttonSubmit'>
              {() => {
                return (
                  <Button
                    type='primary'
                    htmlType='submit'
                    disabled={
                      JSON.stringify(valueTemps) === JSON.stringify(form.getFieldsValue(true))
                    }
                  >
                    Lưu
                  </Button>
                );
              }}
            </Form.Item>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default EditChangeAction;
