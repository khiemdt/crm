import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { updateFlightBookingCodes, updateFlightPNRCodes } from '~/apis/flight';
import '~/features/flight/components/modal/modal.scss';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { listPnrStatus } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

interface Props {
  modal: string;
  setModal: any;
  sameAirline?: boolean;
}

let valueTemps = {};

const ModalUpdateFlightPNRCode: React.FC<Props> = (props) => {
  const { modal, setModal, sameAirline } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { confirm } = Modal;
  const [isLoading, setLoading] = useState<boolean>(false);
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);

  const temps = {
    outbound: {
      flightPNRs: booking?.departureInfo?.flights[0]?.flightPNR,
      outboundCode: booking?.outboundPnrCode,
      departure: true,
      outboundPnrStatus: booking?.outboundPnrStatus,
    },
    inbound: {
      flightPNRs: booking?.returnInfo?.flights[0]?.flightPNR,
      inboundCode: booking?.inboundPnrCode,
      departure: false,
      inboundPnrStatus: booking?.inboundPnrStatus,
    },
  };
  const updateFlightPNRCode = async (queryParams: any) => {
    const params1 = {
      bookingId: booking.id,
      departure: true,
      flightPNRs: [queryParams?.outbound?.flightPNRs],
    };
    const params2 = {
      bookingId: booking.id,
      departure: false,
      flightPNRs: [queryParams?.inbound?.flightPNRs],
    };
    try {
      let listApi = [updateFlightPNRCodes(params1)];
      if (booking.inbound) {
        listApi.push(updateFlightPNRCodes(params2));
      }
      const res = await Promise.all(listApi);
      res.forEach((el: any, indx: number) => {
        const { data } = el;
        setLoading(false);
        if (data.code === 200) {
          message.success(
            intl.formatMessage({
              id: indx
                ? 'Cập nhật code hãng chiều đi thành công!'
                : 'Cập nhật code hãng chiều về thành công!',
            }),
          );
          if (!indx) {
            handleCancel();
            dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
          }
        } else {
          message.error(data?.message);
        }
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const updateFlightBookingCode = async (queryParams: any) => {
    const params1 = {
      bookingId: booking.id,
      outboundCode: queryParams?.outbound?.outboundCode,
      outboundStatus: queryParams?.outbound?.outboundPnrStatus,
    };
    const params2 = {
      bookingId: booking.id,
      inboundCode: queryParams?.inbound?.inboundCode,
      inboundStatus: queryParams?.inbound?.inboundPnrStatus,
    };
    try {
      let listApi = [updateFlightBookingCodes(params1)];
      if (booking.inbound && !sameAirline) {
        listApi.push(updateFlightBookingCodes(params2));
      }
      const res = await Promise.all(listApi);
      res.forEach((el: any, indx: number) => {
        const { data } = el;
        setLoading(false);
        if (data.code === 200) {
          message.success(
            intl.formatMessage({
              id: indx
                ? 'Cập nhật mã đặt vé chiều đi thành công!'
                : 'Cập nhật mã đặt vé chiều về thành công!',
            }),
          );
          if (!indx) {
            handleCancel();
            dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
          }
        } else {
          message.error(data?.message);
        }
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleCancel = () => {
    setModal(false);
  };
  const onFinish = (values: some) => {
    showConfirm(values);
    setLoading(true);
  };

  const showConfirm = (values: some) => {
    confirm({
      title:
        modal === 'PNRCode'
          ? 'Bạn có chắc chắn muốn sửa code hãng'
          : 'Bạn có chắc chắn muốn sửa mã đặt vé?',
      content: 'Vui lòng xác nhận kỹ thông tin',
      onOk() {
        if (modal === 'PNRCode') {
          updateFlightPNRCode(values);
        } else {
          updateFlightBookingCode(values);
        }
      },
      onCancel() {
        console.log('Cancel');
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    if (!modal) {
      form.resetFields();
    } else {
      form.setFieldsValue(temps);
    }
    valueTemps = temps;
  }, [booking, modal]);

  return (
    <Modal
      className='wrapperModal'
      visible={!!modal}
      onCancel={handleCancel}
      footer={false}
      width={450}
    >
      <span className='title'>{modal === 'PNRCode' ? 'Sửa code hãng' : 'Sửa mã đặt vé'} </span>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        hideRequiredMark
        layout='vertical'
        onFinish={onFinish}
      >
        <div style={{ paddingTop: 10 }}>
          {modal === 'PNRCode' ? (
            <Form.Item
              name={['outbound', 'flightPNRs']}
              rules={[{ message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
              label='Code hãng chiều đi'
            >
              <Input
                type='text'
                placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_OUTBOUND_CODE' })}
              />
            </Form.Item>
          ) : (
            <div className='pnr-code-flight-box'>
              <Form.Item
                name={['outbound', 'outboundCode']}
                rules={[{ message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
                style={{ flex: 1 }}
                label='Mã đặt vé chiều đi'
              >
                <Input
                  type='text'
                  placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_OUTBOUND_CODE' })}
                />
              </Form.Item>
              <Form.Item
                name={['outbound', 'outboundPnrStatus']}
                rules={[{ message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
                style={{ flex: 1 }}
              >
                <Select>
                  {listPnrStatus.map((el: some, indx: number) => (
                    <Select.Option key={indx} value={el.stt}>
                      {el.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          )}
        </div>
        {booking?.inbound && (
          <div>
            {modal === 'PNRCode' ? (
              <Form.Item
                name={['inbound', 'flightPNRs']}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) },
                ]}
                label='Code hãng chiều về'
              >
                <Input
                  type='text'
                  placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_INBOUND_CODE' })}
                />
              </Form.Item>
            ) : (
              <>
                {!sameAirline && (
                  <div className='pnr-code-flight-box'>
                    <Form.Item
                      name={['inbound', 'inboundCode']}
                      rules={[
                        {
                          message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                        },
                      ]}
                      style={{ flex: 1 }}
                      label='Mã đặt vé chiều về'
                    >
                      <Input
                        type='text'
                        placeholder={intl.formatMessage({ id: 'IDS_TEXT_ENTER_INBOUND_CODE' })}
                      />
                    </Form.Item>
                    <Form.Item
                      name={['inbound', 'inboundPnrStatus']}
                      rules={[
                        {
                          message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                        },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Select>
                        {listPnrStatus.map((el: some, indx: number) => (
                          <Select.Option key={indx} value={el.stt}>
                            {el.title}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className='wrapperSubmitSms'>
          <Button onClick={() => handleCancel()}>
            <FormattedMessage id='IDS_TEXT_SKIP' />
          </Button>
          <Form.Item shouldUpdate className='buttonSubmit'>
            {() => (
              <Button
                loading={isLoading}
                disabled={JSON.stringify(valueTemps) === JSON.stringify(form.getFieldsValue(true))}
                type='primary'
                htmlType='submit'
              >
                <FormattedMessage id='IDS_TEXT_SEND' />
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
export default ModalUpdateFlightPNRCode;
