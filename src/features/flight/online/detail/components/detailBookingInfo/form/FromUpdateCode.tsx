import { Button, Form, Input, message, Popconfirm, Select, Tag } from 'antd';
import React, { useState } from 'react';
import { updateFlightPNRCodes } from '~/apis/flight';
import { IconEdit } from '~/assets';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { TYPE_TICKET_INFO } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { isHandling } from '~/utils/helpers/helpers';

interface Props {
  index: number;
  type: string;
  flightPNR: string;
}

const FromUpdateCode: React.FC<Props> = ({ flightPNR, type, index }) => {
  const dispatch = useAppDispatch();
  const [editForm, setEditForm] = useState<boolean>(false);

  const userInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);

  const [form] = Form.useForm();

  const fetUpdateFlightPNRCodes = async (queryParams: any) => {
    try {
      const { data } = await updateFlightPNRCodes(queryParams);
      if (data.code === 200) {
        message.success('Cập nhật code hãng thành công!');
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
        setEditForm(false);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isHandLing = isHandling(booking, userInfo);
  return (
    <>
      {editForm ? (
        <Form initialValues={{ flightPNRs: flightPNR }} form={form} className='form-code'>
          <Form.Item name='flightPNRs'>
            <Input size='small' />
          </Form.Item>
          <Popconfirm
            placement='top'
            title='Bạn có chắc chắn muốn sửa code hãng?'
            onConfirm={() => {
              const { flightPNRs } = form.getFieldsValue(true);
              const dataInfo =
                type === TYPE_TICKET_INFO.DEPARTURE ? booking?.departureInfo : booking?.returnInfo;
              const arrayPNR = dataInfo?.flights?.map((val: some, indexPNR: number) =>
                index === indexPNR ? flightPNRs : val?.flightPNR,
              );
              fetUpdateFlightPNRCodes({
                bookingId: booking?.id,
                departure: type === TYPE_TICKET_INFO.DEPARTURE,
                flightPNRs: arrayPNR,
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
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Tag color='success'>{flightPNR ?? 'Chưa có'}</Tag>
          {isHandLing && <IconEdit className='pointer' onClick={() => setEditForm(true)} />}
        </div>
      )}
    </>
  );
};

export default FromUpdateCode;
