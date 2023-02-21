import { Button, Checkbox, Col, Form, Input, InputNumber, message, Modal, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  getActiveBenefitPackages,
  getEnterpriseInfo,
  getVatInvoiceOrder,
  requestVatInvoices,
  updateBookingPriceDetails,
} from '~/apis/flight';
import { IconChevronDown, IconCloseNoneCycle, IconMinus, IconPlus, IconSearch } from '~/assets';
import '~/features/flight/online/detail/FlightDetail.scss';
import { formatMoney, getInvoiceStatusFlight, isEmpty } from '~/utils/helpers/helpers';
import { InvoiceFlightType } from '~/features/flight/online/Modal';
import { columnsOrderDetail } from '~/features/flight/online/detail/components/invoice/OrderInvoice';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';

const columns: ColumnsType<InvoiceFlightType> = [
  {
    title: 'Mã đơn',
    key: 'id',
    dataIndex: 'id',
  },
  {
    title: 'Thời gian đặt',
    key: 'completedDate',
    dataIndex: 'completedDate',
    render: (text) => {
      return `${moment(text).format('DD-MM-YYYY HH:mm')}`;
    },
  },
  {
    title: (
      <div>
        Trạng thái <br /> xuất hóa đơn
      </div>
    ),
    key: 'invoiceStatusText',
    dataIndex: 'invoiceStatusText',
    render: (text, record: any) => {
      const status = getInvoiceStatusFlight(record.invoiceStatus);
      return <span style={{ color: status.color }}>{`${status?.title}`}</span>;
    },
  },
  {
    title: 'Thông tin đơn hàng',
    key: 'typeDesc',
    dataIndex: 'typeDesc',
  },
  Table.EXPAND_COLUMN,
];

const getTextEnterPacket = (maxPrice: number, minPrice: number) => {
  return `Số tiền không vượt quá ${formatMoney(maxPrice)} và là bội số của ${formatMoney(
    minPrice || 1000,
  )}`;
};

let timeoutInput: any = null;
let isRetryApi: boolean = true;
const AddInvoiceFlight = (props: any) => {
  const { open, modal, setModal, handleOk, id, module } = props;
  const [form] = Form.useForm();
  const [packages, setPackages] = useState<some[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<InvoiceFlightType[]>([]);
  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);
  const { hotelOnlineDetail } = useAppSelector((state: some) => state?.hotelReducer);

  const handleCancel = () => {
    setModal({
      type: '',
      item: {},
    });
  };
  const validateOrderIds = () => {
    let result = false;
    const orderIds = form.getFieldValue('orderIds') || [];
    orderIds.forEach((el: string) => {
      orders.forEach((element: some) => {
        if (element.id == el && element.type == 'flight') {
          result = true;
        }
      });
    });
    return result;
  };

  const fetActiveBenefitPackages = async () => {
    try {
      const { data } = await getActiveBenefitPackages({
        bookingId: modal.item.id,
        module: module,
        page: 1,
        size: 10,
      });
      if (data.code === 200) {
        setPackages(data.data || []);
      }
    } catch (error) {}
  };

  const fetVatInvoiceOrder = async () => {
    try {
      const { data } = await getVatInvoiceOrder({
        bookingId: modal.item.id,
        module: module,
      });
      if (data.code === 200) {
        if (isRetryApi) {
          if (isEmpty(data?.data)) {
            isRetryApi = false;
            updatePriceDetail(modal.item.id);
          }
        }
        setOrders(data.data || []);
      }
    } catch (error) {}
  };

  const updatePriceDetail = async (id: number) => {
    try {
      const { data } = await updateBookingPriceDetails({
        bookingId: id,
      });
      if (data.code === 200) {
        fetVatInvoiceOrder();
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (open) {
      if (isEmpty(packages)) {
        fetActiveBenefitPackages();
      }
      fetVatInvoiceOrder();
    } else {
      form.resetFields();
    }
  }, [open]);

  const rowSelection = {
    selectedRowKeys: form.getFieldValue('orderIds'),
    onChange: (selectedRowKeys: React.Key[]) => {
      form.setFieldsValue({
        orderIds: selectedRowKeys,
      });
    },
    getCheckboxProps: (record: some) => ({
      disabled: !(record.invoiceStatus === 'cancel' || !record.invoiceStatus),
    }),
  };

  const handleChangePackage = (type: string, item: some) => {
    const benefitPackagesTemp = form.getFieldValue('benefitPackages');
    const index = benefitPackagesTemp.findIndex((el: some) => el.id === item.id);
    if (index !== -1) {
      const quantityTemp = benefitPackagesTemp[index].quantity;
      if (quantityTemp === 1 && type === 'minus') {
        benefitPackagesTemp.splice(index, 1);
      } else {
        benefitPackagesTemp[index] = {
          id: item.id,
          quantity: type === 'minus' ? quantityTemp - 1 : quantityTemp + 1,
          price: item.price,
        };
      }
    } else {
      benefitPackagesTemp.push({
        id: item.id,
        quantity: 1,
        price: item.price,
      });
    }
    let totalMoney = 0;
    benefitPackagesTemp.forEach((el: some) => {
      totalMoney += el.price * el.quantity;
    });
    console.log('benefitPackagesTemp', benefitPackagesTemp);
    form.setFieldsValue({
      benefitPackages: benefitPackagesTemp,
      moneyEnter: totalMoney,
    });
  };

  const getTotalPackages = () => {
    const benefitPackagesTemp = form.getFieldValue('benefitPackages');
    return benefitPackagesTemp
      .map((el: some) => el.price * el.quantity)
      .reduce((a: number, b: number) => a + b, 0);
  };

  const checkDisable = (type: string, item: some) => {
    if (type === 'minus') {
      const benefitPackagesTemp = form.getFieldValue('benefitPackages');
      const index = benefitPackagesTemp.findIndex((el: some) => el.id === item.id);
      return index === -1 ? true : false;
    } else {
      const max = packages[0].maxPrice;
      const total = getTotalPackages();
      return total + item.price > max;
    }
  };

  const valuePackes = (item: some) => {
    const benefitPackagesTemp = form.getFieldValue('benefitPackages');
    const pakages = benefitPackagesTemp.find((el: some) => el.id === item.id);
    return pakages?.quantity || 0;
  };

  const checkPriceEnter = (_: any, value: number) => {
    const max = packages[0].maxPrice;
    if (value <= max || value === undefined) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(`Số tiền không vượt quá ${formatMoney(max)}`));
  };

  const handleUpdatePackage = (moneyEnter: number) => {
    clearTimeout(timeoutInput);
    timeoutInput = setTimeout(() => {
      if (moneyEnter === null) {
        form.setFieldsValue({
          moneyEnter: null,
          benefitPackages: [],
        });
      } else {
        let value = 0;
        if (moneyEnter < 1000) {
          value = 1000;
        } else {
          value = Math.round(moneyEnter / 1000) * 1000;
        }
        let benefitPackagesTemp = [];
        let countValue = value;
        const length = packages.length;
        if (length === 1) {
          const item = packages[0];
          benefitPackagesTemp.push({
            id: item.id,
            quantity: 1,
            price: value,
            amount: value,
          });
        } else {
          for (let i = length - 1; i >= 0; i--) {
            const item = packages[i];
            const quantity = Math.floor(countValue / item.price);
            if (quantity > 0) {
              countValue = countValue - quantity * item.price;
              benefitPackagesTemp.push({
                id: item.id,
                quantity: quantity,
                price: item.price,
              });
            }
          }
        }

        form.setFieldsValue({
          moneyEnter: value,
          benefitPackages: benefitPackagesTemp,
        });
      }
    }, 1000);
  };

  const onSearch = async () => {
    try {
      const { data } = await getEnterpriseInfo({
        taxCode: form.getFieldValue('taxCode'),
      });
      if (data.code === 200) {
        form.setFieldsValue({
          companyName: data.data.companyName,
          companyAddress: data.data.companyAddress,
          recipientAddress: data.data.recipientAddress,
          recipientEmail: data.data.recipientEmail,
          recipientName: data.data.recipientName,
          recipientPhone: data.data.recipientPhone,
        });
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra');
        form.setFieldsValue({
          companyName: '',
          companyAddress: '',
          recipientAddress: '',
          recipientEmail: '',
          recipientName: '',
          recipientPhone: '',
        });
      }
    } catch (error) {}
  };

  const onFinish = async (values: any) => {
    try {
      delete values.isAddPackets;
      delete values.moneyEnter;
      setLoading(true);
      const { data } = await requestVatInvoices({
        ...values,
        bookingId: id,
        module: module,
      });
      setLoading(false);
      if (data.code === 200) {
        message.success('Thêm mới yêu cầu xuất hóa đơn thành công!');
        handleCancel();
        handleOk();
        form.resetFields();
      } else {
        message.error(data.message || 'Đã có lỗi xảy ra');
      }
    } catch (error) {}
  };

  useEffect(() => {
    // forceUpdate({});
    return () => {
      clearTimeout(timeoutInput);
    };
  }, []);

  const checkListOrder = () => {
    let result = true;
    orders.forEach((el: any) => {
      if (el.invoiceStatus !== 'completed') {
        result = false;
      }
    });
    return result;
  };

  const caId = module === 'flight' ? flightOnlineDetail?.caInfo?.id : hotelOnlineDetail?.caInfo?.id;
  return (
    <Modal
      className='modal-delete-invoice modal-add-invoice'
      visible={open}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={680}
    >
      <div className='title'>Thêm mới yêu cầu</div>
      <Form
        layout='vertical'
        form={form}
        scrollToFirstError
        colon={false}
        className='form-add-invoice'
        initialValues={{
          ...flightOnlineDetail.vatInvoiceInfo,
          taxCode: flightOnlineDetail.vatInvoiceInfo?.taxIdNumber,
          benefitPackages: [],
        }}
        onFinish={onFinish}
        onValuesChange={(changedValues) => {
          if (changedValues.moneyEnter !== undefined) {
            const max = packages[0].maxPrice;
            if (changedValues.moneyEnter <= max) {
              handleUpdatePackage(changedValues.moneyEnter);
            }
          }
        }}
      >
        <div className='title-group'>Thông tin hóa đơn</div>
        <Row gutter={12} className='left-filter'>
          <Col span={12}>
            <Form.Item name='taxCode' label='Mã số thuế'>
              <Input
                allowClear
                placeholder='Nhập mã số thuế'
                suffix={<IconSearch style={{ cursor: 'pointer' }} onClick={onSearch} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='customerName' label='Tên khách hàng'>
              <Input allowClear placeholder='Nhập tên khách hàng' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12} className='left-filter'>
          <Col span={12}>
            <Form.Item
              name='companyName'
              rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
              label='Tên công ty'
            >
              <Input allowClear placeholder='Nhập tên công ty' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='companyAddress'
              label='Địa chỉ'
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input allowClear placeholder='Nhập địa chỉ' />
            </Form.Item>
          </Col>
        </Row>
        <div className='title-group'>Thông tin người nhận</div>
        <Row gutter={12} className='left-filter'>
          <Col span={12}>
            <Form.Item name='recipientName' label='Họ và tên'>
              <Input allowClear placeholder='Nhập họ và tên' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='recipientAddress' label='Địa chỉ'>
              <Input allowClear placeholder='Nhập địa chỉ' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12} className='left-filter'>
          <Col span={12}>
            <Form.Item
              name='recipientEmail'
              label='Email'
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input allowClear placeholder='Nhập email' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='recipientPhone' label='Số điện thoại'>
              <Input allowClear placeholder='Nhập số điện thoại' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8} className='left-filter'>
          <Col span={24}>
            <Form.Item name='note' label='Ghi chú'>
              <Input.TextArea
                allowClear
                className='text-area'
                rows={5}
                placeholder='Nhập ghi chú'
              />
            </Form.Item>
          </Col>
        </Row>
        {module === 'flight' &&
          (!isEmpty(orders) ? (
            <>
              <div className='title-group info-order'>Thông tin đơn hàng</div>
              <Form.Item name='orderIds'>
                <Table
                  rowKey={(record) => record.id}
                  columns={columns}
                  dataSource={orders || []}
                  pagination={false}
                  rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                  }}
                  expandable={{
                    expandedRowRender: (record) => (
                      <div className='table-order-detail'>
                        <Table
                          rowKey={(record) => record.id}
                          columns={columnsOrderDetail}
                          dataSource={record?.items || []}
                          pagination={false}
                        />
                      </div>
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? (
                        <span onClick={(e) => onExpand(record, e)}>
                          <IconChevronDown style={{ transform: 'rotate(180deg)' }} />
                        </span>
                      ) : (
                        <span onClick={(e) => onExpand(record, e)}>
                          <IconChevronDown />
                        </span>
                      ),
                    expandRowByClick: true,
                  }}
                />
              </Form.Item>
            </>
          ) : (
            <div className='no-orders'>KHông có thông tin đơn hàng!</div>
          ))}
        <Form.Item
          shouldUpdate={(prevValues, curValues) => prevValues.orderIds !== curValues.orderIds}
        >
          {() => (
            <>
              {validateOrderIds() && (
                <>
                  {' '}
                  {caId !== 17 && (
                    <Row gutter={12} className='left-filter'>
                      <Form.Item name='isAddPackets' valuePropName='checked'>
                        <Checkbox className='check-box-item'>Mua thêm gói dịch vụ</Checkbox>
                      </Form.Item>
                    </Row>
                  )}
                  <Row gutter={12} className='left-filter'>
                    <Col span={24}>
                      <Form.Item
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.isAddPackets !== curValues.isAddPackets ||
                          prevValues.orderIds !== curValues.orderIds ||
                          prevValues.benefitPackages !== curValues.benefitPackages
                        }
                        style={{ marginBottom: 0 }}
                      >
                        {() => (
                          <>
                            {form.getFieldValue('isAddPackets') &&
                              (!isEmpty(form.getFieldValue('orderIds')) || module === 'hotel') &&
                              !isEmpty(packages) && (
                                <div className='packets-content'>
                                  <Form.Item
                                    name='moneyEnter'
                                    style={{ marginBottom: 2 }}
                                    rules={[
                                      {
                                        validator: checkPriceEnter,
                                      },
                                      {
                                        required: packages.length === 1,
                                        message: 'Vui lòng nhập số tiền!',
                                      },
                                    ]}
                                    label='Nhập số tiền để tìm kiếm gói dịch vụ tương ứng'
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
                                  <span
                                    className='info-enter-money'
                                    style={{
                                      borderBottom:
                                        packages.length === 1 ? 'none' : '1px solid #b2b8b9',
                                    }}
                                  >
                                    {getTextEnterPacket(packages[0].maxPrice, packages[0].price)}
                                  </span>
                                  <Form.Item
                                    name='benefitPackages'
                                    className='display-none-form-item-validate'
                                  >
                                    <Input placeholder='' disabled />
                                  </Form.Item>
                                  {packages.length === 1 ? (
                                    <div className='des-vip'>
                                      <span style={{ fontWeight: 500 }}>{packages[0].title}</span>
                                      <span>{packages[0].noteMessage}</span>
                                    </div>
                                  ) : (
                                    packages.map((el) => (
                                      <div key={el.id} className='item-packet'>
                                        <span>{el.title}</span>
                                        <div className='action-right'>
                                          <Button
                                            className='icon-btn'
                                            type='primary'
                                            shape='circle'
                                            icon={<IconMinus />}
                                            onClick={() => handleChangePackage('minus', el)}
                                            disabled={checkDisable('minus', el)}
                                          />
                                          <div className='value-item'>{valuePackes(el)}</div>
                                          <Button
                                            className='icon-btn'
                                            type='primary'
                                            shape='circle'
                                            icon={<IconPlus />}
                                            onClick={() => handleChangePackage('plus', el)}
                                            disabled={checkDisable('plus', el)}
                                          />
                                        </div>
                                      </div>
                                    ))
                                  )}
                                  <div className='note-content'>
                                    <span className='note-text'>Lưu ý:</span>
                                    <span className='des-note'>
                                      Không hủy yêu cầu, bạn phải liên hệ với Tripi để được hoàn lại
                                      tiền.
                                    </span>
                                  </div>
                                  <div className='total-price-packet'>
                                    <span className='title-total'>Tổng tiền gói dịch vụ</span>
                                    <span className='value-total'>
                                      {formatMoney(getTotalPackages())}
                                    </span>
                                  </div>
                                </div>
                              )}
                          </>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
        </Form.Item>

        <div className='bottom-action'>
          <Button type='text' onClick={handleCancel}>
            Bỏ qua
          </Button>
          <Form.Item className='bottom-form' shouldUpdate>
            {() => (
              <Button
                type='primary'
                htmlType='submit'
                disabled={
                  !!form.getFieldsError().filter(({ errors }) => errors.length).length ||
                  checkListOrder()
                }
                loading={loading}
              >
                Thêm mới
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
export default AddInvoiceFlight;
