import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select
} from 'antd';

import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  addFlightBookingPostProcessing,
  createPreviewRefundRequest,
  deleteFlightPostProcessing,
  editFlightPostProcessing,
  getAllBank
} from '~/apis/flight';
import { IconCalendar, IconChevronDown, IconCloseNoneCycle } from '~/assets';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import { fetFlightBookingPostProcessing } from '~/features/flight/flightSlice';
import { AirlinesType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import {
  listPostProcessingFly,
  listTypeVoidPostProcessingEdit,
  listVoidPostProcessingEdit
} from '~/utils/constants/dataOptions';
import { isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import AddCodeModal from './AddCodeModal';

const { Option } = Select;
const VoidPostProcessingsDetail = (props: some) => {
  const { record, id, addItemDone, setKeyTab, keyTab } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const dispatch = useAppDispatch();

  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);
  const { salesList, generalInfo, flightOnlineDetail } = useAppSelector(
    (state: some) => state?.flightReducer,
  );
  const [modal, setModal] = useState({ visible: false, item: {} });
  const [isBankMethod, setIsBankMethod] = useState<boolean>(false);
  const [listBank, setListBankPayment] = useState<some[]>([]);

  const onFinish = async (values: any) => {
    const isAdd = record.id === 'yuhcouqnart';
    if (!isAdd) {
      showConfirm(false);
      return null;
    }
    const eticketDataTemp = values.eticketData.filter((el: some) => !isEmpty(el.eticketNumber));
    const dataTDO = {
      ...values,
      group: 'void',
      eticketData: eticketDataTemp,
      processingTime: values.processingTime.format('DD-MM-YYYY'),
      bookingId: id,
      numAdults: flightOnlineDetail.numAdults,
      numChildren: flightOnlineDetail.numChildren,
      numInfants: flightOnlineDetail.numInfants,
      voidFee: 0,
    };
    delete dataTDO?.listCodeTikets;
    const { data } = await addFlightBookingPostProcessing(dataTDO);
    if (data.code === 200) {
      message.success('Thêm mới phát sinh thêm thành công!');
      form.resetFields();
      fetData();
      addItemDone();
    } else {
      message.error(data.message || 'Đã có lỗi xảy ra');
    }
  };

  const fetData = () => {
    dispatch(fetFlightBookingPostProcessing({ bookingId: id }));
  };

  const isAdd = record.id === 'yuhcouqnart';
  const salesListAll = [{ id: 0, name: 'Tất cả' }, ...salesList];
  const paymentMethodsList = generalInfo?.paymentMethodsList || [];

  const showConfirm = (isDelete: boolean) => {
    confirm({
      title: !isDelete
        ? 'Bạn có chắc chắn muốn lưu lại thông tin đã sửa?'
        : 'Bạn có chắc chắn muốn xóa phát sinh này?',
      content: 'Vui lòng xác nhận kỹ thông tin',
      onOk() {
        if (isDelete) {
          hanldeDeleteItem();
        } else {
          handleEditItem();
        }
      },
      onCancel() {},
    });
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
    } catch (error) {}
  };

  const handleEditItem = async () => {
    const values = form.getFieldsValue(true);
    const eticketDataTemp = values.eticketData.filter((el: some) => !isEmpty(el.eticketNumber));
    const dataDTO = {
      ...values,
      id: record.id,
      isDisableEdit: true,
      isEditting: true,
      group: 'void',
      eticketData: eticketDataTemp,
      processingTime: values.processingTime.format('DD-MM-YYYY'),
      bookingId: id,
      numAdults: flightOnlineDetail.numAdults,
      numChildren: flightOnlineDetail.numChildren,
      numInfants: flightOnlineDetail.numInfants,
      voidFee: 0,
      bankAccountInfo: values.bankAccountInfo?.accountNumber ? values.bankAccountInfo : null,
    };
    try {
      const { data } = await editFlightPostProcessing(dataDTO);
      if (data.code === 200) {
        message.success('Chỉnh sửa phát sinh thêm thành công!');
        fetData();
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!');
      }
    } catch (error) {}
  };

  const fetAllBank = async () => {
    try {
      const { data } = await getAllBank();
      if (data.code === 200) {
        setListBankPayment(data.data);
      }
    } catch (error) {}
  };

  const getMethodBDT = () => {
    const result = isEmpty(paymentMethodsList)
      ? null
      : paymentMethodsList.find((el: some) => el.code == 'DBT')?.id;
    setIsBankMethod(form.getFieldValue('paymentMethodId') === result);
  };

  const getListCodeTikets = (field: string) => {
    let result: some[] = [];
    flightOnlineDetail.guests.forEach((el: some) => {
      if (!isEmpty(el[field])) {
        result.push({
          eticketNumber: el[field],
          fullName: el.fullName,
          ageCategory:
            el.ageCategory == 'adult'
              ? 'Người lớn'
              : el.ageCategory == 'children'
              ? ' - Trẻ em'
              : ' - Em bé',
        });
      }
    });
    return result;
  };

  const handleChangeIsOutbound = (allValues: some) => {
    const guests: any[] = flightOnlineDetail.guests;
    let result: some[] = allValues.eticketData.map((el: some, index: number) => {
      const guest: some = guests[index];
      return {
        ...el,
        eticketNumber:
          allValues.isOutbound === 0 ? guest?.inboundEticketNo : guest?.outboundEticketNo,
      };
    });

    if (allValues.isOutbound === 1 || allValues.isOutbound === 2) {
      form.setFieldsValue({
        pnrCode: flightOnlineDetail?.outboundPnrCode,
        airlineId: flightOnlineDetail?.outbound?.airlineId,
        listCodeTikets: getListCodeTikets('outboundEticketNo'),
        eticketData: result,
        signIn: flightOnlineDetail?.outboundAgentId,
      });
    } else {
      form.setFieldsValue({
        pnrCode: flightOnlineDetail?.inboundPnrCode,
        airlineId: flightOnlineDetail?.inbound?.airlineId,
        listCodeTikets: getListCodeTikets('inboundEticketNo'),
        eticketData: result,
        signIn: flightOnlineDetail?.inboundAgentId,
      });
    }
  };

  const handleChangePaymentMethodId = (allValues: some) => {
    let result = '';
    const userInfo = flightOnlineDetail.paymentUserInfo;
    const payment = paymentMethodsList.find((el: some) => el.id === allValues.paymentMethodId);
    if (payment.code === 'CD') {
      if (!isEmpty(userInfo)) {
        result =
          'ID: ' +
          userInfo.id +
          '\nTên: ' +
          userInfo.name +
          '\nEmail: ' +
          userInfo.email +
          '\nSố điện thoại: ' +
          userInfo.phone;
      } else {
        result = 'ID: \nTên: \nEmail: \nSố điện thoại: ';
      }
    } else {
      result = 'Ngân hàng: \nChi Nhánh: \nSố tài khoản: \nChủ tài khoản: ';
    }
    form.setFieldsValue({
      paymentInfo: result,
    });
  };

  const updateFieldChange = (nameField: any[]) => {
    const data = form.getFieldsValue(true);
    if (nameField?.includes('eticketNumber')) {
      const eticketData = data.eticketData[data.eticketData.length - 1];
      if (!isEmpty(eticketData.eticketNumber)) {
        form.setFieldsValue({
          eticketData: [
            ...data.eticketData,
            {
              eticketNumber: undefined,
              price: 0,
              fee: 0,
            },
          ],
        });
      }
    } else if (nameField?.includes('eticketData')) {
      let total = 0;
      let eticketDataTemp = [...data.eticketData];
      data.eticketData.forEach((el: some) => {
        total = total + (el.price || 0) - (el.fee || 0);
      });
      // if (nameField?.includes('fee')) {
      //   const item = eticketDataTemp[nameField[1]];
      //   eticketDataTemp[nameField[1]] = {
      //     ...item,
      //     price: flightOnlineDetail.totalNetPrice - item.fee,
      //   };
      // }
      form.setFieldsValue({
        price: Math.max(total, 0),
        eticketData: eticketDataTemp,
      });
    }
  };

  const handleCreatePreviewRefundRequest = async () => {
    try {
      const { data } = await createPreviewRefundRequest({ id: record.id });
      if (data.code === 200) {
        message.success('Gửi yêu cầu phê duyệt thành công!');
        dispatch(fetFlightBookingPostProcessing({ bookingId: id }));
      } else {
        message.error(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {}
  };

  const genEticket = () => {
    let result: some[] = [];
    flightOnlineDetail.guests.forEach((el: some) => {
      result.push({
        eticketNumber: el.outboundEticketNo || undefined,
        price: 0,
        fee: 0,
      });
    });
    return result;
  };

  const eticket = {
    eticketNumber: undefined,
    price: 0,
    fee: 0,
  };

  useEffect(() => {
    fetAllBank();
    getMethodBDT();
  }, []);
  return (
    <div>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        hideRequiredMark
        className='filter-form-flight void-post-processing'
        initialValues={{
          type: isAdd ? undefined : record.type,
          voidType: isAdd ? undefined : record.voidType,
          processingTime: isAdd ? moment() : moment(record.processingTime),
          saleId: isAdd ? userInfo.id : record.saleId,
          isOutbound: isAdd ? 1 : record.isOutbound,
          airlineId: isAdd ? flightOnlineDetail?.outbound?.airlineId : record.airlineId,
          signIn: isAdd ? flightOnlineDetail?.outboundAgentId : record.signIn,
          paymentMethodId: isAdd ? undefined : record.paymentMethodId,
          pnrCode: isAdd ? flightOnlineDetail.outboundPnrCode : record.pnrCode,
          eticketData: isAdd ? genEticket() : [...record.eticketData, eticket],
          listCodeTikets: getListCodeTikets('outboundEticketNo'),
          price: isAdd ? 0 : record.price,
          paymentInfo: isAdd ? 0 : record.paymentInfo,
          isRefundPoint: isAdd ? false : record.isRefundPoint,
          refundToTripi: isAdd ? false : record.refundToTripi,
          refundPoint: isAdd ? 0 : record.refundPoint,
          bankAccountInfo: {
            accountNumber: isAdd
              ? flightOnlineDetail?.userInfo?.bankAccounts
                ? flightOnlineDetail?.userInfo?.bankAccounts[0]?.accountNumber
                : null
              : record.bankAccount?.accountNumber,
            bankId: isAdd
              ? flightOnlineDetail?.userInfo?.bankAccounts
                ? flightOnlineDetail?.userInfo?.bankAccounts[0]?.bankId
                : null
              : record.bankAccount?.bankId,
            beneficiaryName: isAdd
              ? flightOnlineDetail?.userInfo?.bankAccounts
                ? flightOnlineDetail?.userInfo?.bankAccounts[0]?.beneficiaryName
                : null
              : record.bankAccount?.beneficiaryName,
          },
          isUpdateBankAccount: true,
          note: isAdd ? null : record.note,
        }}
        onFinish={onFinish}
        onValuesChange={(changedValues, allValues) => {
          if (changedValues.isOutbound !== undefined) {
            handleChangeIsOutbound(allValues);
          } else if (changedValues.paymentMethodId !== undefined) {
            handleChangePaymentMethodId(allValues);
          } else if (changedValues.type !== undefined) {
            if (allValues.type !== 'Hoàn vé') {
              form.setFieldsValue({
                voidType: undefined,
              });
            }
          }
        }}
        onFieldsChange={(filed) => {
          const nameField: any = filed[0].name || '';
          updateFieldChange(nameField);
        }}
        layout='vertical'
      >
        <Row gutter={12}>
          <Col span={5}>
            <Form.Item
              name='type'
              label='Loại phát sinh'
              rules={[{ required: true, message: 'Vui lòng chọn loại phát sinh!' }]}
            >
              <Select placeholder='Chọn loại phát sinh' suffixIcon={<IconChevronDown />}>
                {listVoidPostProcessingEdit?.map((val: some) => {
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
              style={{ marginBottom: 0 }}
              shouldUpdate={(prevValues, curValues) => prevValues.type !== curValues.type}
            >
              {() => (
                <>
                  <Form.Item
                    name='voidType'
                    label='Loại hoàn'
                    rules={[
                      {
                        required: form.getFieldValue('type') === 'Hoàn vé',
                        message: 'Vui lòng chọn loại hoàn!',
                      },
                    ]}
                  >
                    <Select
                      placeholder='Chọn loại hoàn'
                      suffixIcon={<IconChevronDown />}
                      disabled={form.getFieldValue('type') !== 'Hoàn vé'}
                    >
                      {listTypeVoidPostProcessingEdit?.map((val: some) => {
                        return (
                          <Select.Option key={val?.id} value={val?.id}>
                            {val?.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </>
              )}
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
          <Col span={4}>
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
        </Row>
        <Row gutter={12}>
          <Col span={5}>
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
              label='Mã vé'
              rules={[{ required: true, message: 'Vui lòng nhập mã vé!' }]}
            >
              <Input allowClear placeholder='Nhập mã vé' />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label='Hoàn điểm' name='refundPoint'>
              <InputNumber
                placeholder='Nhập số điểm hoàn '
                formatter={(value: string | undefined) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: string | undefined) => `${value}`.replace(/\$\s?|(,*)/g, '')}
              />
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
                onChange={() => {
                  getMethodBDT();
                }}
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
        </Row>
        <Row gutter={12}>
          {isBankMethod && (
            <>
              <Col span={5}>
                <Form.Item
                  name={['bankAccountInfo', 'accountNumber']}
                  label='Số tài khoản'
                  className='form-item-hozi'
                  rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
                >
                  <Input placeholder='Nhập số tài khoản' />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name={['bankAccountInfo', 'beneficiaryName']}
                  label='Người thụ hưởng'
                  className='form-item-hozi'
                  rules={[{ required: true, message: 'Vui lòng nhập tên người thụ hưởng' }]}
                >
                  <Input placeholder='Nhập tên người thụ hưởng' />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name={['bankAccountInfo', 'bankId']}
                  label='Ngân hàng'
                  className='form-item-hozi'
                  rules={[{ required: true, message: 'Vui lòng nhập ngân hàng' }]}
                >
                  <Select
                    placeholder='Chọn ngân hàng'
                    optionFilterProp='children'
                    suffixIcon={<IconChevronDown />}
                    showSearch
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
              </Col>
              <Col>
                <Form.Item label=' ' name='isUpdateBankAccount' valuePropName='checked'>
                  <Checkbox style={{ width: 'auto', alignItems: 'end' }}>Lưu thông tin TK</Checkbox>
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
        <Row gutter={12} align='middle' className='payment-box-bank'>
          <Col span={15}>
            <Row gutter={12} className='left-filter' style={{ marginBottom: 3 }}>
              <Col span={8}>Số vé</Col>
              <Col span={7}>Phí hoàn huỷ</Col>
              <Col span={7}>Tiền hãng trả</Col>
            </Row>
            <Form.Item
              style={{ marginBottom: 0 }}
              shouldUpdate={(prevValues, curValues) =>
                prevValues.eticketData !== curValues.eticketData ||
                prevValues.listCodeTikets !== curValues.listCodeTikets
              }
            >
              {() => (
                <>
                  <Form.List name='eticketData'>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, idx) => {
                          const listCodeTikets = form.getFieldValue('listCodeTikets');
                          return (
                            <Row
                              gutter={12}
                              className='left-filter'
                              key={idx}
                              style={{ position: 'relative' }}
                            >
                              <Col span={8}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'eticketNumber']}
                                  className='form-item-hozi'
                                  rules={[
                                    {
                                      required: idx !== fields.length - 1,
                                      message: 'Vui lòng nhập số vé!',
                                    },
                                  ]}
                                >
                                  <AutoComplete
                                    className='hotel-name-search'
                                    placeholder='Nhập mã hoặc chọn số vé'
                                  >
                                    {listCodeTikets.map((el: some) => (
                                      <Option key={el.eticketNumber} value={`${el.eticketNumber}`}>
                                        <div className='list-code-options'>
                                          <span>{el.eticketNumber}</span>
                                          <span>{`${el.fullName} - ${el.ageCategory}`}</span>
                                        </div>
                                      </Option>
                                    ))}
                                  </AutoComplete>
                                </Form.Item>
                              </Col>
                              <Col span={7}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'fee']}
                                  className='form-item-hozi'
                                  rules={[
                                    {
                                      required: idx !== fields.length - 1,
                                      message: 'Vui lòng nhập số tiền phí',
                                    },
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
                              <Col span={7}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'price']}
                                  className='form-item-hozi'
                                  rules={[
                                    {
                                      required: idx !== fields.length - 1,
                                      message: 'Vui lòng nhập số tiền phí',
                                    },
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
                              {idx !== fields.length - 1 && fields.length != 2 && (
                                <Col span={1}>
                                  <IconCloseNoneCycle
                                    className='text-blue'
                                    onClick={() => remove(field.name)}
                                    style={{ paddingLeft: 0, display: 'inline-block' }}
                                  />
                                </Col>
                              )}
                            </Row>
                          );
                        })}
                      </>
                    )}
                  </Form.List>
                </>
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name='price'
              label='Tiền trả khách'
              className='form-item-hozi'
              rules={[{ required: true, message: 'Vui lòng nhập số tiền trả khách' }]}
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
          <Col span={4}>
            <Form.Item label=' ' name='refundToTripi' valuePropName='checked'>
              <Checkbox style={{ width: 'auto', alignItems: 'end' }}>Hoàn về Tripi</Checkbox>
            </Form.Item>
          </Col>
        </Row>
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
              {record.previewStatus != 'approved' && (
                <>
                  <Button type='primary' htmlType='submit'>
                    Lưu
                  </Button>
                  <Button style={{ marginLeft: 12 }} onClick={() => showConfirm(true)}>
                    Xóa
                  </Button>
                  <Button
                    type='default'
                    className='btn-send-reuest'
                    onClick={handleCreatePreviewRefundRequest}
                  >
                    Gửi yêu cầu phê duyệt
                  </Button>
                </>
              )}
              <Button
                type='default'
                className='btn-send-reuest'
                onClick={() => setModal({ visible: true, item: record })}
              >
                Bổ sung thông tin hoàn tiền
              </Button>
            </div>
          </div>
        )}
      </Form>
      <AddCodeModal
        paymentMethodId={
          paymentMethodsList.find((el: some) => el.id === record.paymentMethodId)?.code
        }
        bankAccount={record.bankAccount}
        listBank={listBank}
        modal={modal}
        setModal={setModal}
      />
    </div>
  );
};

export default VoidPostProcessingsDetail;
