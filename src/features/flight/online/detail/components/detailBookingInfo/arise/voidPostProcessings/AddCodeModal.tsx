import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { refundPaymentMethod, updateRefundRequest } from '~/apis/flight';
import { IconChevronDown, IconCloseNoneCycle } from '~/assets';
import '~/features/flight/components/modal/modal.scss';
import { fetFlightBookingPostProcessing } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

const AddCodeModal = (props: any) => {
  const { modal, setModal, bankAccount, listBank, paymentMethodId } = props;
  const dispatch = useAppDispatch();
  const [listPayment, setListPayment] = useState<some[]>([]);
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);

  // const bankAccount = !isEmpty(booking?.userInfo.bankAccounts)
  //   ? booking?.userInfo.bankAccounts[0]
  //   : {};

  const [form] = Form.useForm();
  const handleCancel = () => {
    setModal({
      visible: false,
      item: {},
    });
  };

  useEffect(() => {
    if (modal?.visible) {
      fetRefundPaymentMethod();
    }
  }, [modal]);

  useEffect(() => {
    if (!modal.visible) {
      form.resetFields();
    }
  }, [modal]);

  const fetRefundPaymentMethod = async () => {
    try {
      const { data } = await refundPaymentMethod();
      if (data.code === 200) {
        setListPayment(data.data);
      }
    } catch (error) {}
  };

  const onFinish = async (values: any) => {
    try {
      const dataDto = {
        ...values,
        refundToTripi: true,
        referenceTag: 'refund_booking',
        product: 'flight',
        bookingId: modal.item.bookingId,
        bookingReferenceId: modal.item.id,
        id: modal.item.accountingPaymentId,
      };
      const { data } = await updateRefundRequest(dataDto);
      if (data.code === 200) {
        message.success('Bổ sung thông tin hoàn tiền thành công!');
        dispatch(fetFlightBookingPostProcessing({ bookingId: booking.id }));
        handleCancel();
      } else {
        message.error(data.message);
      }
    } catch (error) {}
  };

  return (
    <Modal
      className='modal-delete-invoice'
      visible={modal.visible}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={460}
    >
      <div className='title'>Bổ sung thông tin hoàn vé</div>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        className='filter-form-flight void-post-processing add-code-modal'
        initialValues={{
          note: '',
          amount: modal.item.price,
          paymentMethod: paymentMethodId == 'DBT' ? 'BT' : paymentMethodId,
          bankAccountInfo: {
            ...bankAccount,
          },
        }}
        onFinish={onFinish}
        onValuesChange={(changedValues, allValues) => {}}
        layout='vertical'
      >
        <Form.Item
          name='paymentMethod'
          label='Phương thức thanh toán'
          rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
        >
          <Select placeholder='Chọn phương thức thanh toán' suffixIcon={<IconChevronDown />}>
            {listPayment?.map((val: some) => {
              return (
                <Select.Option key={val?.shortName} value={val?.shortName}>
                  {val?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name='amount' label='Số tiền' className='form-item-hozi'>
          <InputNumber
            placeholder='Nhập'
            formatter={(value: string | undefined) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value: string | undefined) => `${value}`.replace(/\$\s?|(,*)/g, '')}
            disabled
          />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 0 }}
          shouldUpdate={(prevValues, curValues) =>
            prevValues.paymentMethod !== curValues.paymentMethod
          }
        >
          {() => (
            <>
              {form.getFieldValue('paymentMethod') === 'BT' && (
                <div>
                  <Form.Item
                    name={['bankAccountInfo', 'accountNumber']}
                    label='Số tài khoản'
                    rules={[{ required: true, message: 'Vui lòng nhập số tài khoản!' }]}
                  >
                    <Input placeholder='Nhập số tài khoản' />
                  </Form.Item>
                  <Form.Item
                    name={['bankAccountInfo', 'beneficiaryName']}
                    label='Tên người thụ hưởng'
                    rules={[{ required: true, message: 'Vui lòng nhập tên người thụ hưởng!' }]}
                  >
                    <Input placeholder='Nhập tên người thụ hưởng' />
                  </Form.Item>
                  <Form.Item
                    name={['bankAccountInfo', 'bankId']}
                    label='Ngân hàng'
                    rules={[{ required: true, message: 'Vui lòng chọn ngân hàng!' }]}
                  >
                    <Select
                      placeholder='Chọn ngân hàng'
                      showSearch
                      suffixIcon={<IconChevronDown />}
                      filterOption={(input, option) =>
                        removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                          removeAccent(input.toLowerCase()),
                        ) >= 0
                      }
                    >
                      {listBank?.map((val: some) => {
                        return (
                          <Select.Option key={val?.id} value={val?.id}>
                            {val?.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              )}
            </>
          )}
        </Form.Item>
        <Form.Item
          name='note'
          label='Ghi chú'
          rules={[{ required: true, message: 'Vui lòng nhập nội dung ghi chú' }]}
        >
          <Input.TextArea rows={4} placeholder='Nội dung ghi chú' />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
          <Button htmlType='button' onClick={() => handleCancel()}>
            Hủy
          </Button>
          <Button type='primary' htmlType='submit'>
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
export default AddCodeModal;
