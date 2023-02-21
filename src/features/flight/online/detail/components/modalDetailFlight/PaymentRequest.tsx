import { Button, Form, Input, message, Modal, Select } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import React, { useEffect, useState } from 'react';
import { createPayment, paymentMethods } from '~/apis/flight';
import { IconCloseOutline } from '~/assets';
import { fetFlightBookingsDetail1 } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const PaymentRequest: React.FC<Props> = ({ open, handleClose }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);
  const [payment, setPayment] = useState<some[]>([[]]);

  const fetPaymentMethods = async (queryParams = {}) => {
    try {
      const { data } = await paymentMethods(queryParams);
      if (data.code === 200) {
        form.setFieldsValue({
          paymentMethodId:
            flightOnlineDetail?.caInfo?.code === 'MYTOUR'
              ? data?.data?.find((el: some) => el.code == 'DBT')?.id
              : data?.data[0]?.id,
          promotionCode: flightOnlineDetail?.promotionCode,
        });
        setPayment(data?.data);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetCreatePayment = async (queryParams = {}) => {
    try {
      const { data } = await createPayment(queryParams);
      if (data.code === 200) {
        message.success('Tạo yêu cầu thành công');
        dispatch(fetFlightBookingsDetail1({ id: flightOnlineDetail.id }));
        handleClose();
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = (values: { paymentMethodId: some[number]; promotionCode: string }) => {
    confirm({
      title: 'Tạo yêu cầu thanh toán',
      content: 'Hãy chắc chắn rằng bạn muốn tạo yêu cầu thanh toán',
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      wrapClassName: 'wrap-show-confirm',
      onOk() {
        fetCreatePayment({
          bookingId: flightOnlineDetail?.id,
          module: 'flight',
          paymentMethodId: values?.paymentMethodId,
          promotionCode: values?.promotionCode ?? null,
          point: 0,
        });
      },
    });
  };

  useEffect(() => {
    if (open) {
      fetPaymentMethods({
        caId: flightOnlineDetail?.caInfo?.id,
        module: 'flight',
      });
    }
  }, [open]);

  return (
    <Modal
      className='wrapper-modal-payment-request'
      title={<div className='title-modal'>Tạo yêu cầu thanh toán</div>}
      visible={open}
      footer={false}
      closeIcon={<IconCloseOutline />}
      onCancel={handleClose}
    >
      <Form className='form-payment-method' form={form} onFinish={onFinish} layout='vertical'>
        <Form.Item
          name='paymentMethodId'
          label='Phương thức thanh toán'
          rules={[{ required: true, message: 'Yêu cầu chọn phương thức thanh toán' }]}
        >
          <Select
            options={payment?.map((val: some) => ({ label: val?.name, value: val?.id }))}
            placeholder='Chọn phương tức thanh toán'
          />
        </Form.Item>
        <Form.Item label='Mã giảm giá' name='promotionCode'>
          <Input placeholder='Nhập mã giảm giá' />
        </Form.Item>
        <div className='wrapper-submit-payment-request'>
          <Button htmlType='submit' type='primary'>
            Tạo yêu cầu
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PaymentRequest;
