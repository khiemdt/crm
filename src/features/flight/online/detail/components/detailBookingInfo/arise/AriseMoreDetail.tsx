import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  addFlightBookingPostProcessing,
  deleteFlightPostProcessing,
  editFlightPostProcessing,
  getBankTransferTransactionsPostProcessing,
  getTransInfoPostProcessing,
  interpolateAdditionalPostProcessing,
} from '~/apis/flight';
import {
  IconBill,
  IconCalendar,
  IconCheckGreen,
  IconChevronDown,
  IconCloseNoneCycle,
  IconEmailBlue,
  IconPaymentJcb,
  IconRefeshBlue,
  IconRejectRed,
} from '~/assets';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import { fetFlightBookingPostProcessing } from '~/features/flight/flightSlice';
import { AirlinesType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { listPostProcessingEdit, listPostProcessingFly } from '~/utils/constants/dataOptions';
import { getPaymentStatusPSTFlight, isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import './AriseMoreFlight.scss';
import EmailPaymentGuideModal from './EmailPaymentGuideModal';
import ProcessModal from './ProcessModal';
import TransInfoPostProcessingModal from './TransInfoPostProcessingModal';

let timeoutSearch: any = null;
let eticketDataTemp = [];
const typeModal = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  TRANSINFO: 'TRANSINFO',
  TRANS_BANK: 'TRANS_BANK',
  PAYMENT_EMAIL: 'PAYMENT_EMAIL',
};
const AriseMoreDetail = (props: some) => {
  const { confirm } = Modal;
  const { record, id, addItemDone, setKeyTab, keyTab } = props;
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState({ type: '', item: {} });
  const { salesList, generalInfo, flightOnlineDetail } = useAppSelector(
    (state: some) => state?.flightReducer,
  );
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);
  const handleClose = () => {
    setModal({
      type: '',
      item: {},
    });
  };
  const [loading, setLoading] = useState(false);

  const fetInterpolateAdditionalPostProcessing = async (allValues: some) => {
    try {
      const { data } = await interpolateAdditionalPostProcessing({
        airlineId: allValues.airlineId,
        bookingId: id,
        eticketData: allValues.eticketData || [],
        group: 'additional',
        isOutbound: allValues.isOutbound,
        totalNetPrice: allValues.totalNetPrice,
        type: allValues.type,
      });
      if (data.code === 200) {
        form.setFieldsValue({
          eticketData: data?.data?.eticketData,
        });
        eticketDataTemp = data?.data?.eticketData;
      } else {
        message.error(data.message || '');
      }
    } catch (error) {}
  };

  const handleBankTransferTransactions = async (params: some) => {
    try {
      const { data } = await getBankTransferTransactionsPostProcessing(params.id);
      if (data.code === 200) {
        if (data?.data?.transactions?.length) {
          setModal({ type: typeModal.TRANS_BANK, item: data?.data });
        } else {
          message.error('Không có thông tin danh sách chuyển khoản!');
        }
      } else {
        message.error(data.message || '');
      }
    } catch (error) {}
  };

  const fetTransInfoPostProcessing = async (params: some) => {
    try {
      const { data } = await getTransInfoPostProcessing(params.id);
      if (data.code === 200) {
        console.log(data.data);
        setModal({ type: typeModal.TRANSINFO, item: data.data });
      } else {
        message.error(data.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearch);
    };
  }, []);

  const getNameGust = (id: number) => {
    const guest = flightOnlineDetail?.guests.find((el: some) => el.id === id);
    return guest?.fullName || '';
  };

  const onFinish = async (values: any) => {
    const isAdd = record.id === 'yuhcouqnart';
    if (!isAdd) {
      showConfirm(false);
      return null;
    }
    try {
      setLoading(true);
      const dataTDO = {
        ...values,
        processingTime: values.processingTime.format('DD-MM-YYYY'),
        saleName:
          values.saleId === 0
            ? 'Tất cả'
            : `${salesList.find((el: some) => el.id === values.saleId)?.name}`,
        bookingId: id,
        group: 'additional',
        numAdults: flightOnlineDetail.numAdults,
        numChildren: flightOnlineDetail.numChildren,
        numInfants: flightOnlineDetail.numInfants,
      };
      const { data } = await addFlightBookingPostProcessing(dataTDO);
      if (data.code === 200) {
        message.success('Thêm mới phát sinh thêm thành công!');
        form.resetFields();
        fetData();
        addItemDone();
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra');
      }
      setLoading(false);
    } catch (error) {}
  };

  const isShowRightAction = () => {
    const paymentMenthod = generalInfo.paymentMethodsList.find(
      (el: some) => el.id === record.paymentMethodId,
    );
    return paymentMenthod.code === 'DBT';
  };

  const handleChangeIsOutbound = (allValues: some) => {
    if (allValues.isOutbound === 1 || allValues.isOutbound === 2) {
      form.setFieldsValue({
        pnrCode: flightOnlineDetail?.outboundPnrCode,
        airlineId: flightOnlineDetail?.outbound?.airlineId,
        signIn: flightOnlineDetail?.outboundAgentId,
      });
    } else {
      form.setFieldsValue({
        pnrCode: flightOnlineDetail?.inboundPnrCode,
        airlineId: flightOnlineDetail?.inbound?.airlineId,
        signIn: flightOnlineDetail?.inboundAgentId,
      });
    }
  };

  const showConfirm = (isDelete: boolean) => {
    confirm({
      title: !isDelete
        ? 'Bạn có chắc chắn muốn lưu lại thông tin đã sửa?'
        : 'Bạn có chắc chắn muốn xóa phát sinh này?',
      content: 'Vui lòng xác nhận kỹ thông tin',
      onOk() {
        setLoading(true);
        if (isDelete) {
          hanldeDeleteItem();
        } else {
          handleEditItem();
        }
      },
      onCancel() {},
    });
  };

  const updateAdditionalStatuses = (data: some, stt: string) => {
    confirm({
      title:
        stt == 'SUCCESS'
          ? 'Bạn chắc chắn đã xử lý phát sinh thêm thành công?'
          : 'Bạn chắc chắn đã xử lý phát sinh thêm thất bại?',
      content: 'Vui lòng xác nhận kỹ thông tin',
      onOk() {
        handleUpdateAdditionalStatuses(data, stt);
      },
      onCancel() {},
    });
  };

  const handleUpdateAdditionalStatuses = async (record: some, stt: string) => {
    try {
      const { data } = await deleteFlightPostProcessing({
        id: record.id,
        status: stt,
      });
      if (data.code === 200) {
        message.success(data.message);
        fetData();
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!');
      }
    } catch (error) {}
  };

  const hanldeDeleteItem = async () => {
    try {
      const { data } = await deleteFlightPostProcessing({
        id: record.id,
      });
      if (data.code === 200) {
        message.success('Xóa phát sinh thêm thành công!');
        fetData();
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!');
      }
      setLoading(false);
    } catch (error) {}
  };

  const handleEditItem = async () => {
    const values = form.getFieldsValue(true);
    const dataDTO = {
      ...values,
      id: record.id,
      isDisableEdit: true,
      isEditting: true,
      processingTime: values.processingTime.format('DD-MM-YYYY'),
      saleName:
        values.saleId === 0
          ? 'Tất cả'
          : `${salesList.find((el: some) => el.id === values.saleId)?.name}`,
      bookingId: id,
      group: 'additional',
      numAdults: flightOnlineDetail.numAdults,
      numChildren: flightOnlineDetail.numChildren,
      numInfants: flightOnlineDetail.numInfants,
    };
    try {
      const { data } = await editFlightPostProcessing(dataDTO);
      if (data.code === 200) {
        message.success('Chỉnh sửa phát sinh thêm thành công!');
        fetData();
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!');
      }
      setLoading(false);
    } catch (error) {}
  };

  const fetData = () => {
    dispatch(fetFlightBookingPostProcessing({ bookingId: id }));
  };

  const salesListAll = [{ id: 0, name: 'Tất cả' }, ...salesList];
  const paymentMethodsList =
    generalInfo?.paymentMethodsList?.filter(
      (el: some) =>
        (flightOnlineDetail.caInfo.id === 17 && (el.code === 'DBT' || el.code === 'CD')) ||
        (flightOnlineDetail.caInfo.id === 1 && (el.code === 'DBT' || el.code === 'CD')) ||
        (flightOnlineDetail.caInfo.id !== 17 && flightOnlineDetail.caInfo.id !== 1),
    ) || [];
  const isAdd = record.id === 'yuhcouqnart';
  // const selfHandling =
  //   record.paymentStatus === 'success' &&
  //   record.status === 'IN_PROGRESS' &&
  //   flightOnlineDetail.handlingStatus == 'handling' &&
  //   flightOnlineDetail.lastSaleId === userInfo.id;
  const selfHandling =
    (record.paymentStatus === 'success' ||
      (record.paymentStatus === 'holding' && record.paymentMethodId === 7)) &&
    record.status === 'IN_PROGRESS';
  const paymentStatus = getPaymentStatusPSTFlight(record.paymentStatus);

  const isShowDelete =
    record.paymentMethodId !== 7 &&
    (record.paymentStatus === 'awaiting_payment' || record.paymentStatus === 'awaiting-payment');
  if (loading) {
    return (
      <Spin tip='Loading...'>
        <div style={{ height: 325 }}></div>
      </Spin>
    );
  }
  return (
    <div>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        hideRequiredMark
        className='filter-form-flight'
        initialValues={{
          type: isAdd ? undefined : record.type,
          processingTime: isAdd ? moment() : moment(record.processingTime),
          saleId: isAdd ? userInfo.id : record.saleId,
          isOutbound: isAdd ? 1 : record.isOutbound,
          airlineId: isAdd ? flightOnlineDetail?.outbound?.airlineId : record.airlineId,
          signIn: isAdd ? flightOnlineDetail?.outboundAgentId : record.signIn,
          paymentMethodId: isAdd ? undefined : record.paymentMethodId,
          pnrCode: isAdd ? flightOnlineDetail.outboundPnrCode : record.pnrCode,
          totalNetPrice: isAdd ? undefined : record.totalNetPrice,
          price: isAdd ? undefined : record.price,
          note: isAdd ? undefined : record.note,
          eticketData: isAdd ? undefined : record.eticketData,
        }}
        onFinish={onFinish}
        onValuesChange={(changedValues, allValues) => {
          if (
            (changedValues.airlineId !== undefined ||
              changedValues.isOutbound !== undefined ||
              (changedValues.eticketData !== undefined &&
                eticketDataTemp.length !== allValues?.eticketData?.length) ||
              changedValues.totalNetPrice !== undefined ||
              changedValues.type !== undefined) &&
            allValues.totalNetPrice > 0
          ) {
            clearTimeout(timeoutSearch);
            timeoutSearch = setTimeout(() => {
              fetInterpolateAdditionalPostProcessing(allValues);
            }, 1000);
          }
          if (changedValues.isOutbound !== undefined) {
            handleChangeIsOutbound(allValues);
          }
        }}
        layout='vertical'
      >
        <Row gutter={12} className='left-filter' wrap={false}>
          <Col span={5}>
            <Form.Item
              name='type'
              label='Loại phát sinh'
              rules={[{ required: true, message: 'Vui lòng chọn loại phát sinh!' }]}
            >
              <Select placeholder='Chọn loại phát sinh' suffixIcon={<IconChevronDown />}>
                {listPostProcessingEdit?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name='processingTime'
              label='Ngày phát sinh'
              rules={[{ required: true, message: 'Vui lòng nhập ngày phát sinh!' }]}
            >
              <DatePicker
                format='DD-MM-YYYY'
                placeholder='DD-MM-YYYY'
                suffixIcon={<IconCalendar />}
                allowClear={false}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name='saleId'
              label='Người xử lý'
              rules={[{ required: true, message: 'Vui lòng chọn người xử lý!' }]}
            >
              <Select
                placeholder='Chọn người xử lý'
                optionFilterProp='children'
                suffixIcon={<IconChevronDown />}
                showSearch
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {salesListAll?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name='isOutbound'
              label='Chiều xử lý'
              rules={[{ required: true, message: 'Vui lòng chọn chiều xử lý!' }]}
            >
              <Select placeholder='Chọn chiều xử lý' suffixIcon={<IconChevronDown />}>
                {listPostProcessingFly?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col flex={1}>
            <Form.Item
              name='airlineId'
              label='Hãng bay'
              rules={[{ required: true, message: 'Vui lòng chọn hãng bay!' }]}
            >
              <Select
                placeholder='Chọn hãng bay'
                suffixIcon={<IconChevronDown />}
                showSearch
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {airlines?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12} className='left-filter' wrap={false}>
          <Col span={5}>
            <Form.Item
              name='signIn'
              label='Sign-in'
              rules={[{ required: true, message: 'Vui lòng chọn Sign-in!' }]}
            >
              <Select placeholder='Chọn Sign-in' suffixIcon={<IconChevronDown />}>
                {generalInfo?.agencies?.map((value: some) => {
                  return (
                    <Select.Option key={value.id} value={value.code}>
                      {`${value.code} - ${value.name}`}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name='pnrCode'
              label='Mã đặt chỗ'
              rules={[{ required: true, message: 'Vui lòng nhập mã đặt chỗ!' }]}
            >
              <Input allowClear placeholder='Nhập mã đặt chỗ' />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name='paymentMethodId'
              label='Phương thức thanh toán'
              rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
            >
              <Select
                placeholder='Chọn phương thức thanh toán'
                suffixIcon={<IconChevronDown />}
                disabled={!isAdd}
              >
                {paymentMethodsList?.map((val: some) => {
                  return (
                    <Select.Option key={val?.id} value={val?.id}>
                      {val?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name='totalNetPrice'
              label='Số tiền trả hãng'
              rules={[{ required: true, message: 'Vui lòng nhập số tiền trả hãng!' }]}
            >
              <InputNumber
                placeholder='Nhập'
                formatter={(value: string | undefined) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: string | undefined) => `${value}`.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col flex={1}>
            <Form.Item
              name='price'
              label='Số tiền thu khách'
              rules={[{ required: true, message: 'Vui lòng nhập số tiền thu khách!' }]}
            >
              <InputNumber
                disabled={!isAdd}
                placeholder='Nhập'
                formatter={(value: string | undefined) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: string | undefined) => `${value}`.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          style={{ marginBottom: 0 }}
          shouldUpdate={(prevValues, curValues) => prevValues.eticketData !== curValues.eticketData}
        >
          {() => (
            <>
              {!isEmpty(form.getFieldValue('eticketData')) && (
                <>
                  <Row gutter={12} className='left-filter' style={{ marginBottom: 4 }}>
                    <Col span={5}>Tên</Col>
                    <Col span={5}>Số vé</Col>
                    <Col span={5}>Tiền vé chênh</Col>
                    <Col span={5}>Phí</Col>
                  </Row>
                  <Form.List name='eticketData'>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, idx) => (
                          <Row gutter={12} className='left-filter' key={idx}>
                            <Col span={5}>
                              {getNameGust(form.getFieldValue('eticketData')[idx].guestId)}
                            </Col>
                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'eticketNumber']}
                                className='form-item-hozi'
                                rules={[{ required: true, message: 'Vui lòng nhập số vé!' }]}
                              >
                                <Input placeholder='Nhập số vé' />
                              </Form.Item>
                            </Col>
                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'price']}
                                className='form-item-hozi'
                                rules={[
                                  { required: true, message: 'Vui lòng nhập số tiền vé chênh' },
                                ]}
                              >
                                <InputNumber
                                  placeholder='Nhập'
                                  formatter={(value: string | undefined) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  }
                                  parser={(value: string | undefined) =>
                                    `${value}`.replace(/\$\s?|(,*)/g, '')
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'fee']}
                                className='form-item-hozi'
                                rules={[{ required: true, message: 'Vui lòng nhập số tiền phí' }]}
                              >
                                <InputNumber
                                  placeholder='Nhập'
                                  formatter={(value: string | undefined) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  }
                                  parser={(value: string | undefined) =>
                                    `${value}`.replace(/\$\s?|(,*)/g, '')
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <div className='btn-clear'>
                                <IconCloseNoneCycle onClick={() => remove(field.name)} />
                              </div>
                            </Col>
                          </Row>
                        ))}
                      </>
                    )}
                  </Form.List>
                </>
              )}
            </>
          )}
        </Form.Item>
        <Row gutter={12} className='left-filter'>
          <Col span={24}>
            <Form.Item name='note' label='Ghi chú'>
              <Input allowClear placeholder='Nhập' />
            </Form.Item>
          </Col>
        </Row>
        {isAdd ? (
          <div className='action-form'>
            <Button type='primary' htmlType='submit'>
              Tạo
            </Button>
            <Button
              className='btn-refresh'
              onClick={() => {
                setKeyTab({ ...keyTab, type: '' });
                form.resetFields();
              }}
            >
              Bỏ qua
            </Button>
          </div>
        ) : (
          <div className='action-form edit-form'>
            <div className='action-form'>
              <Button type='primary' loading={loading} htmlType='submit'>
                Lưu
              </Button>
              {isShowDelete && (
                <Button
                  loading={loading}
                  style={{ marginLeft: 12 }}
                  onClick={() => showConfirm(true)}
                >
                  Xóa
                </Button>
              )}
              {(record.paymentStatus == 'success' || record.paymentStatus == 'holding') &&
                record.status == 'IN_PROGRESS' && (
                  <>
                    <Button
                      type='text'
                      className='btn-right-item'
                      onClick={() => setModal({ type: typeModal.SUCCESS, item: record })}
                    >
                      <IconCheckGreen style={{ marginRight: 4 }} />
                      <span className='text-success'>Xử lý thành công</span>
                    </Button>
                    <Button
                      type='text'
                      className='btn-right-item'
                      onClick={() => setModal({ type: typeModal.FAILED, item: record })}
                    >
                      <IconRejectRed style={{ marginRight: 4 }} />
                      <span className='text-danger'>Xử lý thất bại</span>
                    </Button>
                  </>
                )}
            </div>
            {isShowRightAction() && (
              <div className='action-form'>
                <Button
                  type='text'
                  className='btn-right-item'
                  onClick={() => handleBankTransferTransactions(record)}
                >
                  <IconBill style={{ marginRight: 4 }} />
                  Danh sách chuyển khoản
                </Button>
                {record.paymentStatus !== 'success' && (
                  <>
                    <Button
                      type='text'
                      className='btn-right-item'
                      onClick={() => fetTransInfoPostProcessing(record)}
                    >
                      <IconPaymentJcb style={{ marginRight: 4 }} />
                      Thông tin chuyển khoản
                    </Button>
                    <Button
                      type='text'
                      className='btn-right-item'
                      onClick={() =>
                        setModal({
                          type: typeModal.PAYMENT_EMAIL,
                          item: record,
                        })
                      }
                    >
                      <IconEmailBlue style={{ marginRight: 4 }} />
                      Gửi email hướng dẫn thanh toán
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Form>
      <ProcessModal modal={modal} setModal={setModal} handleOk={fetData} />
      <TransInfoPostProcessingModal modal={modal} setModal={setModal} />
      <EmailPaymentGuideModal
        item={modal?.item}
        open={modal?.type == 'PAYMENT_EMAIL'}
        handleClose={handleClose}
        typeModal={modal?.type}
      />
    </div>
  );
};

export default AriseMoreDetail;
