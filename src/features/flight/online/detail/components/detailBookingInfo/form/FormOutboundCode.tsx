import { Button, Col, Divider, Form, Input, message, Popconfirm, Row, Select, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { updateFlightBookingCodes } from '~/apis/flight';
import { IconEdit } from '~/assets';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import ModalRebookTicket from '~/features/flight/online/detail/components/detailBookingInfo/modal/ModalRebookTicket';
import { some } from '~/utils/constants/constant';
import { formatMoney, getPnrStatus, isHandling, listPnrStatus } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

interface Props {
  generalInfo: some;
}

const { Option } = Select;
const FormOutboundCode: React.FunctionComponent<Props> = (props) => {
  const { generalInfo } = props;

  const dispatch = useAppDispatch();
  const [editForm, setEditForm] = useState<boolean>(false);
  const [modalRebookTicket, setModalRebookTicket] = useState<boolean>(false);

  const userInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);

  const [form] = Form.useForm();
  const outboundPnrStatus = listPnrStatus.find((el) => el.stt == booking?.outboundPnrStatus);

  const updateFlightBookingCode = async (queryParams: any) => {
    try {
      const { data } = await updateFlightBookingCodes(queryParams);
      if (data.code === 200) {
        message.success(' Cập nhật mã vé chiều đi thành công!');
        setEditForm(false);
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      outboundCode: booking?.outboundPnrCode,
      outboundStatus: booking?.outboundPnrStatus,
      outboundAgentId: booking?.outboundAgentId,
    });
  }, [booking, editForm]);

  const isReserveSeat =
    ((!booking?.isTwoWay && !booking?.outboundPnrCode) ||
      (booking?.isTwoWay && (!booking?.outboundPnrCode || !booking?.inboundPnrCode))) &&
    booking?.lastSaleId === userInfo?.id &&
    booking.paymentStatus == 'pending';
  const isHandLing = isHandling(booking, userInfo);

  return (
    <Row className='info-airline'>
      <Col className='air-box'>
        <span className='text-name'>Chiều đi</span>
      </Col>
      <Col className='air-box'>
        {!editForm ? (
          <>
            <span className='text-grey text-sm'>{booking?.outboundAgentId}</span>
            <Tag color='success'>{booking?.outboundPnrCode || 'Chưa có'}</Tag>
            <span style={{ color: outboundPnrStatus?.color }}>{outboundPnrStatus?.title}</span>
            {isHandLing && <IconEdit className='pointer' onClick={() => setEditForm(true)} />}
          </>
        ) : (
          <Form form={form} className='form-code'>
            <Form.Item name='outboundAgentId'>
              <Select size='small' style={{ width: 200 }}>
                {generalInfo.agencies?.map((value: some) => {
                  return (
                    <Option key={value.code} value={value.code}>
                      {`${value.code} - ${value.name}`}{' '}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name='outboundCode'>
              <Input size='small' />
            </Form.Item>
            <Form.Item name='outboundStatus'>
              <Select size='small' style={{ width: 120 }}>
                {listPnrStatus?.map((value: some) => {
                  return (
                    <Option key={value.stt} disabled={value?.disable} value={value.stt}>
                      {value.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Popconfirm
              placement='top'
              title='Bạn có chắc chắn muốn sửa mã đặt vé?'
              onConfirm={() => {
                const { outboundStatus, outboundCode, outboundAgentId } =
                  form?.getFieldsValue(true);
                updateFlightBookingCode({
                  bookingId: booking?.id,
                  agencyId:
                    generalInfo.agencies?.find((el: some) => el.code == outboundAgentId)?.id ||
                    null,
                  pnr: outboundCode,
                  status: outboundStatus,
                  ticketId: booking?.outbound?.ticketId,
                });
              }}
              okText='Ok'
              cancelText='Hủy'
            >
              <Button htmlType='submit' type='primary'>
                Lưu
              </Button>
            </Popconfirm>
            <Button onClick={() => setEditForm(false)}>Hủy</Button>
          </Form>
        )}
        {/* {isReserveSeat && (
          <Col style={{ marginLeft: 22 }}>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                setModalRebookTicket(true);
              }}
              size='small'
              className='relay-btn'
              type='primary'
            >
              Giữ chỗ
            </Button>
          </Col>
        )} */}
      </Col>
      <Col style={{ flex: 1 }}>
        <Divider />
      </Col>
      <Col>
        <span>{`Giá fare ${formatMoney(booking?.outbound?.farePrice)}`} </span>
      </Col>
      <ModalRebookTicket modal={modalRebookTicket} setModal={setModalRebookTicket} />
    </Row>
  );
};

export default FormOutboundCode;
