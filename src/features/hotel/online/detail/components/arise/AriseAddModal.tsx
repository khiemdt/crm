import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Radio,
  Row,
  Select,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  additionHotel,
  getAllAgencies,
  getAllBookingAdditionType,
  getHotelBookingRoomNightDetail,
  getSurchargePaymentMethods,
  providerInfo,
} from '~/apis/hotel';
import {
  IconCalendar,
  IconChevronDown,
  IconCloseNoneCycle,
  IconAddCricle,
  IconDelete,
} from '~/assets';
import TextArea from 'antd/lib/input/TextArea';
import { some } from '~/utils/constants/constant';
import { formatMoney, isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
import { useIntl } from 'react-intl';
import { DATE_FORMAT_FRONT_END } from '~/utils/constants/moment';
import ReservationCode from './ReservationCode';
import moment from 'moment';

let availableRooms: some[] = [];
const AriseAddModal = (props: some) => {
  const { modal, setModal, handleOk } = props;
  const [form] = Form.useForm();
  const intl = useIntl();
  const [agencies, setAgencies] = useState<some[]>([]);
  const [provider, setProvider] = useState<some[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<some[]>([]);
  const [additionType, setAdditionType] = useState<some[]>([]);
  const hotelOnlineDetail = useAppSelector((state) => state.hotelReducer?.hotelOnlineDetail);

  const onFinish = async (values: any) => {
    if (getPriceForm().totalAmount === 0 && values.paymentMethodId !== 184) {
      notification['error']({
        message: 'Phương thức thanh toán không phù hợp',
        description:
          'Do tổng số tiền khách phải thanh toán bằng không, nên vui lòng chọn phương thức thanh toán miễn phí',
      });
    } else {
      try {
        let itemsTemp: some[] = [];
        values.items.forEach((item: some) => {
          let roomsNew: some[] = [];
          item.rooms.forEach((room: some) => {
            let nightlyNew: some[] = [];
            room.nightly.forEach((night: some) => {
              if (night.isCheck) {
                nightlyNew.push({
                  netPrice: night.netPrice,
                  night: night.night,
                  processingFee: night.processingFee,
                });
              }
            });
            roomsNew.push({
              roomBookingIndex: room.roomBookingIndex,
              roomName: room.roomName,
              nightly: nightlyNew,
            });
          });
          itemsTemp.push({
            ...item,
            rooms: roomsNew,
            checkIn: !isEmpty(item.checkIn) ? item.checkIn.format('DD-MM-YYYY') : null,
            checkOut: !isEmpty(item.checkOut) ? item.checkOut.format('DD-MM-YYYY') : null,
          });
        });

        const priceCodes = !isEmpty(values.codes)
          ? values.codes
              .map((item: some) => item.amount)
              .reduce((prev: number, next: number) => prev + next)
          : 0;
        const priceItems = values.items
          .map((item: some) => item.totalAmount)
          .reduce((prev: number, next: number) => prev + next);

        let codesTemp: some[] = [];
        let totalCodesCurrent = 0;
        values.codes?.forEach((code: some, idx: number) => {
          if (idx !== values.codes.length - 1) {
            codesTemp.push(code);
            totalCodesCurrent += code.amount;
          } else {
            if (totalCodesCurrent + code.amount > priceItems) {
              codesTemp.push({
                ...code,
                amount: priceItems - totalCodesCurrent,
              });
            } else {
              codesTemp.push(code);
            }
          }
        });
        const dataDTO = {
          ...values,
          bookingId: hotelOnlineDetail.id,
          totalAmount: Math.max(priceItems - priceCodes, 0),
          version: 2,
          items: itemsTemp,
          codes: codesTemp,
        };
        const { data } = await additionHotel(dataDTO);
        if (data.code === 200) {
          message.success('Tạo phát sinh thêm cho khách hàng thành công');
          setModal({
            type: '',
            item: {},
          });
          handleOk();
        } else {
          message.error(data.message);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    fetAllAgencies();
    fetProviderInfo({
      agencyIds: [hotelOnlineDetail.agencyId],
      rootHotelIds: [hotelOnlineDetail.hotelId],
    });
    fetSurchargePaymentMethods();
    fetHotelBookingRoomNightDetail();
    fetAllBookingAdditionType();
  }, []);

  const fetAllAgencies = async () => {
    try {
      const { data } = await getAllAgencies();
      if (data.code === 200) {
        setAgencies(data.data);
      }
    } catch (error) {}
  };

  const fetProviderInfo = async (dataDto: some) => {
    try {
      const { data } = await providerInfo(dataDto);
      if (data.code === 200) {
        setProvider(data.data?.items);
        if (!isEmpty(data.data?.items)) {
          const item = data.data?.items[0];
          form.setFieldsValue({
            providerId: item.id,
            taxCode: item.taxCode,
          });
        } else {
          form.setFieldsValue({
            providerId: undefined,
            taxCode: undefined,
          });
        }
      }
    } catch (error) {}
  };

  const fetSurchargePaymentMethods = async () => {
    try {
      const { data } = await getSurchargePaymentMethods({ caId: hotelOnlineDetail.caId });
      if (data.code === 200) {
        setPaymentMethods(data.data);
      }
    } catch (error) {}
  };

  const fetAllBookingAdditionType = async () => {
    try {
      const { data } = await getAllBookingAdditionType({ product: 'hotel' });
      if (data.code === 200) {
        setAdditionType(data.data);
      }
    } catch (error) {}
  };

  const fetHotelBookingRoomNightDetail = async () => {
    try {
      const { data } = await getHotelBookingRoomNightDetail({ bookingId: hotelOnlineDetail.id });
      if (data.code === 200) {
        availableRooms = data.data?.availableRooms || [];
        form.setFieldsValue({
          items: [genItem(data.data?.availableRooms)],
        });
      }
    } catch (error) {}
  };

  const genItem = (availableRooms: some[]) => {
    const rooms: any = [];
    availableRooms.forEach((el: some) => {
      rooms.push({
        ...el,
        nightly: el.nightly.map((it: string) => ({
          netPrice: 0,
          processingFee: 0,
          night: it,
          isCheck: true,
        })),
        isCheckAll: true,
      });
    });
    const item = {
      rooms,
      checkIn: null,
      checkOut: null,
      additionTypeId: null,
      netPrice: 0,
      processingFee: 0,
      totalAmount: 0,
      isApply: false,
    };
    return item;
  };

  const getMainAndSubPrice = (price: number, day: number) => {
    const mainPrice = Math.round(price / day);
    const subPrice = price - mainPrice * (day - 1);
    return {
      mainPrice,
      subPrice,
    };
  };

  const updateFieldChange = (nameField: any[]) => {
    const data = form.getFieldsValue(true);
    // console.log('nameField', nameField);
    // console.log('data', data);
    if (
      (nameField?.includes('items') && nameField.length === 1) ||
      nameField?.includes('note') ||
      nameField?.includes('paymentMethodId') ||
      nameField?.includes('provider')
    ) {
      return null;
    }
    /////////////
    let numberNightActive = 0;
    const idxItem = nameField[1];
    let itemsNew = [...data.items];
    let itemNew = itemsNew[idxItem];
    itemNew.rooms.forEach((room: some) => {
      room.nightly.forEach((night: some) => {
        if (night.isCheck) {
          numberNightActive += 1;
        }
      });
    });
    if (nameField?.includes('isCheckAll')) {
      const idxRoom = nameField[3];
      // count div same
      let numberNightActiveSame = 0;
      itemNew.rooms.forEach((room: some, idx: number) => {
        if (idx !== idxRoom) {
          room.nightly.forEach((night: some) => {
            if (night.isCheck) {
              numberNightActiveSame += 1;
            }
          });
        } else {
          if (room.isCheckAll) {
            numberNightActiveSame += room.nightly.length;
          }
        }
      });
      const netPrice = getMainAndSubPrice(itemNew.netPrice, numberNightActiveSame);
      const processingFee = getMainAndSubPrice(itemNew.processingFee, numberNightActiveSame);
      //// new code
      let roomsNew: any[] = [];
      let currentSetPrice = 0;
      itemNew.rooms.forEach((room: some, idx: number) => {
        let nightlyTemp: any[] = [];
        if (idx !== idxRoom) {
          room.nightly.forEach((night: some) => {
            if (night.isCheck) {
              currentSetPrice += 1;
              nightlyTemp.push({
                ...night,
                netPrice:
                  currentSetPrice !== numberNightActive ? netPrice.mainPrice : netPrice.subPrice,
                processingFee:
                  currentSetPrice !== numberNightActive
                    ? processingFee.mainPrice
                    : processingFee.subPrice,
              });
            } else {
              nightlyTemp.push({
                ...night,
                netPrice: null,
                processingFee: null,
              });
            }
          });
        } else if (room.isCheckAll) {
          room.nightly.forEach((night: some) => {
            currentSetPrice += 1;
            nightlyTemp.push({
              ...night,
              netPrice:
                currentSetPrice !== numberNightActive ? netPrice.mainPrice : netPrice.subPrice,
              processingFee:
                currentSetPrice !== numberNightActive
                  ? processingFee.mainPrice
                  : processingFee.subPrice,
              isCheck: true,
            });
          });
        } else {
          room.nightly.forEach((night: some) => {
            nightlyTemp.push({
              ...night,
              netPrice: null,
              processingFee: null,
              isCheck: false,
            });
          });
        }
        roomsNew.push({
          ...room,
          nightly: nightlyTemp,
        });
      });
      itemNew = {
        ...itemNew,
        rooms: roomsNew,
        totalAmount: itemNew.netPrice + itemNew.processingFee,
      };
      itemsNew[idxItem] = itemNew;
      form.setFieldsValue({
        items: itemsNew,
        codes: [],
      });
    } else if (nameField?.includes('isCheck')) {
      //// new code
      const netPrice = getMainAndSubPrice(itemNew.netPrice, numberNightActive);
      const processingFee = getMainAndSubPrice(itemNew.processingFee, numberNightActive);
      let roomsNew: any[] = [];
      let currentSetPrice = 0;
      itemNew.rooms.forEach((room: some) => {
        let nightlyTemp: any[] = [];
        let numCheckNightly = 0;
        room.nightly.forEach((night: some) => {
          if (night.isCheck) {
            currentSetPrice += 1;
            numCheckNightly += 1;
            nightlyTemp.push({
              ...night,
              netPrice:
                currentSetPrice !== numberNightActive ? netPrice.mainPrice : netPrice.subPrice,
              processingFee:
                currentSetPrice !== numberNightActive
                  ? processingFee.mainPrice
                  : processingFee.subPrice,
            });
          } else {
            nightlyTemp.push({
              ...night,
              netPrice: null,
              processingFee: null,
            });
          }
        });
        roomsNew.push({
          ...room,
          nightly: nightlyTemp,
          isCheckAll: numCheckNightly === room.nightly.length,
        });
      });
      itemNew = {
        ...itemNew,
        rooms: roomsNew,
        totalAmount: itemNew.netPrice + itemNew.processingFee,
      };
      itemsNew[idxItem] = itemNew;
      form.setFieldsValue({
        items: itemsNew,
        codes: [],
      });
    } else if (
      nameField?.includes('nightly') &&
      (nameField?.includes('netPrice') || nameField?.includes('processingFee'))
    ) {
      const filedName = nameField[6];
      const idxItem = nameField[1];
      let itemsNew = [...data.items];
      let itemNew = itemsNew[idxItem];
      let totalTemp = 0;
      itemNew.rooms.forEach((room: some) => {
        room.nightly.forEach((night: some) => {
          totalTemp += night[filedName];
        });
      });
      itemNew = {
        ...itemNew,
        [filedName]: totalTemp,
        totalAmount:
          totalTemp + (filedName === 'netPrice' ? itemNew.processingFee : itemNew.netPrice),
      };
      itemsNew[idxItem] = itemNew;
      form.setFieldsValue({
        items: itemsNew,
        codes: [],
      });
    } else if (nameField?.includes('netPrice') || nameField?.includes('processingFee')) {
      const filedName = nameField[2];
      const idxItem = nameField[1];
      let itemsNew = [...data.items];
      let itemNew = itemsNew[idxItem];
      let roomsNew: any[] = [];
      const sharePrice = Math.round(itemNew[filedName] / numberNightActive);
      const sharePriceAbs = itemNew[filedName] - sharePrice * (numberNightActive - 1);
      let currentSetPrice = 0;
      itemNew.rooms.forEach((room: some) => {
        let nightlyTemp: any[] = [];
        room.nightly.forEach((night: some) => {
          if (night.isCheck) {
            currentSetPrice += 1;
            nightlyTemp.push({
              ...night,
              [filedName]: currentSetPrice !== numberNightActive ? sharePrice : sharePriceAbs,
            });
          } else {
            nightlyTemp.push({
              ...night,
              [filedName]: null,
            });
          }
        });
        roomsNew.push({
          ...room,
          nightly: nightlyTemp,
        });
      });
      itemNew = {
        ...itemNew,
        rooms: roomsNew,
        totalAmount: itemNew.netPrice + itemNew.processingFee,
      };
      itemsNew[idxItem] = itemNew;
      form.setFieldsValue({
        items: itemsNew,
        codes: [],
      });
    } else if (nameField?.includes('checkIn') || nameField?.includes('checkOut')) {
      if (!isEmpty(itemNew.checkIn) && !isEmpty(itemNew.checkOut)) {
        const countNight = Math.abs(
          itemNew.checkIn.startOf('day').diff(itemNew.checkOut.startOf('day'), 'days'),
        );
        let numberNightActive = countNight * itemNew.rooms.length;
        const netPrice = getMainAndSubPrice(itemNew.netPrice, numberNightActive);
        const processingFee = getMainAndSubPrice(itemNew.processingFee, numberNightActive);

        let roomsNew: any[] = [];
        let currentSetPrice = 0;
        itemNew.rooms.forEach((room: some) => {
          let nightlyTemp: any[] = [];

          [...Array(countNight)].forEach((el: any, idx: number) => {
            const temp = itemNew.checkIn.clone();
            const night = temp.add(idx, 'days');
            nightlyTemp.push({
              netPrice:
                currentSetPrice !== numberNightActive ? netPrice.mainPrice : netPrice.subPrice,
              processingFee:
                currentSetPrice !== numberNightActive
                  ? processingFee.mainPrice
                  : processingFee.subPrice,
              night: night.format('DD-MM-YYYY'),
              isCheck: true,
            });
          });
          roomsNew.push({
            ...room,
            nightly: nightlyTemp,
            isCheckAll: true,
          });
        });
        itemNew = {
          ...itemNew,
          rooms: roomsNew,
          totalAmount: itemNew.netPrice + itemNew.processingFee,
        };
        itemsNew[idxItem] = itemNew;
        form.setFieldsValue({
          items: itemsNew,
          codes: [],
        });
      }
    } else if (nameField?.includes('isApply') && !itemNew.isApply) {
      let numberNightActive = 0;
      itemNew.rooms.forEach((room: some) => {
        numberNightActive += room.nightly.length;
      });
      const netPrice = getMainAndSubPrice(itemNew.netPrice, numberNightActive);
      const processingFee = getMainAndSubPrice(itemNew.processingFee, numberNightActive);
      let roomsNew: any[] = [];
      let currentSetPrice = 0;
      itemNew.rooms.forEach((room: some) => {
        let nightlyTemp: any[] = [];
        room.nightly.forEach((night: some) => {
          currentSetPrice += 1;
          nightlyTemp.push({
            ...night,
            isCheck: true,
            netPrice:
              currentSetPrice !== numberNightActive ? netPrice.mainPrice : netPrice.subPrice,
            processingFee:
              currentSetPrice !== numberNightActive
                ? processingFee.mainPrice
                : processingFee.subPrice,
          });
        });
        roomsNew.push({
          ...room,
          nightly: nightlyTemp,
          isCheckAll: true,
        });
      });
      itemNew = {
        ...itemNew,
        rooms: roomsNew,
      };
      itemsNew[idxItem] = itemNew;
      form.setFieldsValue({
        items: itemsNew,
        codes: [],
      });
    }
  };

  const getPriceForm = () => {
    const data = form.getFieldsValue(true);
    let netPrice = 0;
    let processingFee = 0;
    let totalPriceCodes: number = 0;
    data?.items?.forEach((item: some) => {
      netPrice += item.netPrice;
      processingFee += item.processingFee;
    });
    data?.codes?.forEach((el: some) => {
      totalPriceCodes += el.amount;
    });
    return {
      netPrice,
      processingFee,
      totalAmount: Math.max(netPrice + processingFee - totalPriceCodes, 0),
    };
  };

  const disabledDateFrom = (current: any, checkOut: any) => {
    if (isEmpty(checkOut)) {
      return false;
    }
    const countNight = Math.abs(
      moment(current).startOf('day').diff(checkOut.startOf('day'), 'days'),
    );
    // Can not select days before today and today
    return countNight > hotelOnlineDetail.numNights || current.isSameOrAfter(checkOut, 'day');
  };

  const disabledDateTo = (current: any, checkIn: any) => {
    if (isEmpty(checkIn)) {
      return false;
    }
    const countNight = Math.abs(
      moment(current).startOf('day').diff(checkIn.startOf('day'), 'days'),
    );
    // Can not select days before today and today
    return countNight > hotelOnlineDetail.numNights || current.isSameOrBefore(checkIn, 'day');
  };

  return (
    <Modal
      className='modal-delete-invoice modal-add-additions'
      visible={modal.type === 'MODAL_ADD'}
      onCancel={() =>
        setModal({
          type: '',
          item: {},
        })
      }
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={850}
    >
      <div className='title'>Tạo phát sinh thêm cho khách hàng</div>
      <Form
        layout='vertical'
        form={form}
        scrollToFirstError
        colon={false}
        className='form-add-arise-hotel'
        initialValues={{
          provider: 'current',
          agencyId: hotelOnlineDetail.agencyId,
          paymentMethodId: hotelOnlineDetail.paymentMethodId,
          items: [],
          codes: [],
          note: undefined,
        }}
        onFinish={onFinish}
        onValuesChange={(changedValues, allValues) => {
          if (changedValues.provider !== undefined && allValues.provider === 'current') {
            form.setFieldsValue({
              agencyId: hotelOnlineDetail.agencyId,
            });
            fetProviderInfo({
              agencyIds: [hotelOnlineDetail.agencyId],
              rootHotelIds: [hotelOnlineDetail.hotelId],
            });
          } else if (changedValues.agencyId !== undefined) {
            fetProviderInfo({
              agencyIds: [allValues.agencyId],
              rootHotelIds: [hotelOnlineDetail.hotelId],
            });
          }
        }}
        onFieldsChange={(filed) => {
          const nameField: any = filed[0].name || '';
          updateFieldChange(nameField);
        }}
      >
        <Form.Item name='codes' hidden>
          <Input />
        </Form.Item>
        <Form.Item label='' name='provider'>
          <Radio.Group>
            <Radio value='current'> Nhà cung cấp hiện tại </Radio>
            <Radio value='orther'> Nhà cung cấp khác </Radio>
          </Radio.Group>
        </Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: 0 }}
              shouldUpdate={(prevValues, curValues) => prevValues.provider !== curValues.provider}
            >
              {() => (
                <Form.Item name='agencyId' label='Agency'>
                  <Select
                    showSearch
                    placeholder='Chọn'
                    suffixIcon={<IconChevronDown />}
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                        removeAccent(input.toLowerCase()),
                      ) >= 0
                    }
                    disabled={form.getFieldValue('provider') === 'current'}
                  >
                    {agencies.map((el: some, indx: number) => (
                      <Select.Option key={indx} value={el.id}>
                        {el.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: 0 }}
              shouldUpdate={(prevValues, curValues) => prevValues.provider !== curValues.provider}
            >
              {() => (
                <Form.Item name='providerId' label='Tên nhà cung cấp'>
                  <Select
                    showSearch
                    placeholder='Chọn'
                    suffixIcon={<IconChevronDown />}
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                        removeAccent(input.toLowerCase()),
                      ) >= 0
                    }
                    disabled={form.getFieldValue('provider') === 'current'}
                  >
                    {provider.map((el: some, indx: number) => (
                      <Select.Option key={indx} value={el.id}>
                        {el.delegate}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: 0 }}
              shouldUpdate={(prevValues, curValues) => prevValues.provider !== curValues.provider}
            >
              {() => (
                <Form.Item name='taxCode' label='Mã số thuế'>
                  <Input
                    placeholder='Nhập'
                    disabled={form.getFieldValue('provider') === 'current'}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='paymentMethodId'
              label='Phương thức thanh toán'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <Select
                showSearch
                placeholder='Chọn'
                suffixIcon={<IconChevronDown />}
                optionFilterProp='children'
                filterOption={(input, option) =>
                  removeAccent((option!.children as unknown as string).toLowerCase()).indexOf(
                    removeAccent(input.toLowerCase()),
                  ) >= 0
                }
              >
                {paymentMethods.map((el: some, indx: number) => (
                  <Select.Option key={indx} value={el.id}>
                    {el.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.List name='items'>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, idx) => {
                return (
                  <div
                    key={idx}
                    style={{
                      borderTop: '1px solid #D9DBDC',
                      padding: '12px 0',
                      position: 'relative',
                    }}
                  >
                    {idx !== 0 && (
                      <div className='delete-item' onClick={() => remove(field.name)}>
                        <IconDelete />
                      </div>
                    )}
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          name={[field.name, 'additionTypeId']}
                          label='Loại phụ thu'
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                            },
                          ]}
                        >
                          <Select
                            placeholder='Chọn'
                            suffixIcon={<IconChevronDown />}
                            optionFilterProp='children'
                          >
                            {additionType.map((el: some) => (
                              <Select.Option key={el.id} value={el.id}>
                                {el.shortName}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[field.name, 'totalAmount']}
                          label='Tiền khách thanh toán'
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
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
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          name={[field.name, 'netPrice']}
                          label='Giá NET trả NCC'
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
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
                      <Col span={12}>
                        <Form.Item
                          name={[field.name, 'processingFee']}
                          label='Phí dịch vụ'
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
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
                    </Row>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.items[idx].additionTypeId !==
                          curValues.items[idx].additionTypeId ||
                        prevValues.items[idx].checkIn !== curValues.items[idx].checkIn ||
                        prevValues.items[idx].checkOut !== curValues.items[idx].checkOut
                      }
                      className='item-form-min-height-auto'
                    >
                      {() => {
                        const item = form.getFieldValue('items')[idx];
                        return (
                          <>
                            {(item.additionTypeId === 36 || item.additionTypeId === 37) && (
                              <Row gutter={24}>
                                <Col span={12}>
                                  <Form.Item
                                    name={[field.name, 'checkIn']}
                                    label='Thời gian lưu trú mới'
                                    rules={[
                                      {
                                        required: true,
                                        message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                      },
                                    ]}
                                  >
                                    <DatePicker
                                      format={DATE_FORMAT_FRONT_END}
                                      placeholder='Ngày check-in'
                                      allowClear
                                      suffixIcon={<IconCalendar />}
                                      style={{ width: '100%' }}
                                      disabledDate={(current) =>
                                        disabledDateFrom(current, item.checkOut)
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    name={[field.name, 'checkOut']}
                                    label='Thời gian lưu trú mới'
                                    rules={[
                                      {
                                        required: true,
                                        message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                                      },
                                    ]}
                                  >
                                    <DatePicker
                                      format={DATE_FORMAT_FRONT_END}
                                      placeholder='Ngày check-out'
                                      allowClear
                                      suffixIcon={<IconCalendar />}
                                      style={{ width: '100%' }}
                                      disabledDate={(current) =>
                                        disabledDateTo(current, item.checkIn)
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                            )}
                          </>
                        );
                      }}
                    </Form.Item>
                    <Row>
                      <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ paddingRight: 24 }}>Áp dụng cho:</div>
                        <Form.Item name={[field.name, 'isApply']} style={{ marginBottom: 0 }}>
                          <Radio.Group>
                            <Radio value={false}> Tách biệt với đơn phòng </Radio>
                            <Radio value={true}> Từng đêm trong mỗi phòng</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.items[idx].isApply !== curValues.items[idx].isApply ||
                        prevValues.items[idx].rooms !== curValues.items[idx].rooms
                      }
                      className='item-form-min-height-auto'
                    >
                      {() => {
                        const item = form.getFieldValue('items')[idx];
                        return (
                          <>
                            {item.isApply && (
                              <div>
                                <Row gutter={0}>
                                  <Col span={3} className='cell header-check'></Col>
                                  <Col span={7} className='cell header-item'>
                                    Ngày
                                  </Col>
                                  <Col span={7} className='cell header-item center'>
                                    Giá net từng phòng
                                  </Col>
                                  <Col span={7} className='cell header-item center'>
                                    Phí dịch vụ từng phòng
                                  </Col>
                                </Row>
                                <Form.List name={[field.name, 'rooms']}>
                                  {(fields, { add, remove }) => (
                                    <>
                                      {fields.map((field, idx) => {
                                        const room = item.rooms[idx];
                                        return (
                                          <div key={idx}>
                                            <Row className='header-room'>
                                              <Col
                                                span={3}
                                                className='cell center header-rom-check'
                                              >
                                                <Form.Item
                                                  name={[field.name, 'isCheckAll']}
                                                  valuePropName='checked'
                                                  style={{ marginBottom: 0 }}
                                                >
                                                  <Checkbox />
                                                </Form.Item>
                                              </Col>
                                              <Col
                                                span={21}
                                                className='cell header-rom-name'
                                                style={{ fontWeight: 500 }}
                                              >
                                                {room.roomName}
                                              </Col>
                                            </Row>
                                            <Form.List name={[field.name, 'nightly']}>
                                              {(fields, { add, remove }) => (
                                                <>
                                                  {fields.map((field, idx) => {
                                                    const night = room.nightly[idx];
                                                    return (
                                                      <div key={idx}>
                                                        <Row>
                                                          <Col
                                                            span={3}
                                                            className='cell  center content-rom-check'
                                                          >
                                                            <Form.Item
                                                              name={[field.name, 'isCheck']}
                                                              valuePropName='checked'
                                                              style={{ marginBottom: 0 }}
                                                            >
                                                              <Checkbox />
                                                            </Form.Item>
                                                          </Col>
                                                          <Col
                                                            span={7}
                                                            className='cell content-rom-item'
                                                          >
                                                            {night.night}
                                                          </Col>
                                                          <Col
                                                            span={7}
                                                            className='cell content-rom-item'
                                                          >
                                                            <Form.Item
                                                              name={[field.name, 'netPrice']}
                                                              style={{ marginBottom: 0 }}
                                                              rules={[
                                                                {
                                                                  required: night.isCheck,
                                                                  message: intl.formatMessage({
                                                                    id: 'IDS_TEXT_REQUIRED',
                                                                  }),
                                                                },
                                                              ]}
                                                            >
                                                              <InputNumber
                                                                addonAfter='₫'
                                                                placeholder='Nhập'
                                                                formatter={(
                                                                  value: string | undefined,
                                                                ) =>
                                                                  `${value}`.replace(
                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                    ',',
                                                                  )
                                                                }
                                                                parser={(
                                                                  value: string | undefined,
                                                                ) =>
                                                                  `${value}`.replace(
                                                                    /\$\s?|(,*)/g,
                                                                    '',
                                                                  )
                                                                }
                                                                className='cus-input-num'
                                                                disabled={!night.isCheck}
                                                              />
                                                            </Form.Item>
                                                          </Col>
                                                          <Col
                                                            span={7}
                                                            className='cell content-rom-item'
                                                          >
                                                            <Form.Item
                                                              shouldUpdate
                                                              style={{ marginBottom: 0 }}
                                                            >
                                                              {() => (
                                                                <>
                                                                  <Form.Item
                                                                    name={[
                                                                      field.name,
                                                                      'processingFee',
                                                                    ]}
                                                                    style={{ marginBottom: 0 }}
                                                                    rules={[
                                                                      {
                                                                        required: night.isCheck,
                                                                        message: intl.formatMessage(
                                                                          {
                                                                            id: 'IDS_TEXT_REQUIRED',
                                                                          },
                                                                        ),
                                                                      },
                                                                    ]}
                                                                    shouldUpdate
                                                                  >
                                                                    <InputNumber
                                                                      addonAfter='₫'
                                                                      placeholder='Nhập'
                                                                      formatter={(
                                                                        value: string | undefined,
                                                                      ) =>
                                                                        `${value}`.replace(
                                                                          /\B(?=(\d{3})+(?!\d))/g,
                                                                          ',',
                                                                        )
                                                                      }
                                                                      parser={(
                                                                        value: string | undefined,
                                                                      ) =>
                                                                        `${value}`.replace(
                                                                          /\$\s?|(,*)/g,
                                                                          '',
                                                                        )
                                                                      }
                                                                      className='cus-input-num'
                                                                      disabled={!night.isCheck}
                                                                    />
                                                                  </Form.Item>
                                                                </>
                                                              )}
                                                            </Form.Item>
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    );
                                                  })}
                                                </>
                                              )}
                                            </Form.List>
                                          </div>
                                        );
                                      })}
                                    </>
                                  )}
                                </Form.List>
                              </div>
                            )}
                          </>
                        );
                      }}
                    </Form.Item>
                  </div>
                );
              })}
              <Button
                className='btn-add-item'
                onClick={() => {
                  add(genItem(availableRooms));
                }}
              >
                <IconAddCricle style={{ marginRight: 8 }} />
                Thêm loại phụ thu
              </Button>
            </>
          )}
        </Form.List>
        <Form.Item
          style={{ marginBottom: 0 }}
          shouldUpdate={(prevValues, curValues) =>
            prevValues.items !== curValues.items || prevValues.codes !== curValues.codes
          }
        >
          {() => (
            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col span={12}>
                <div className='total-price'>
                  <div className='item-total-price'>
                    <span>Tổng tiền trả cho NCC</span>
                    <span>{formatMoney(getPriceForm().netPrice)}</span>
                  </div>
                  <div className='item-total-price'>
                    <span>Tổng phí dịch vụ</span>
                    <span>{formatMoney(getPriceForm().processingFee)}</span>
                  </div>
                  <div className='item-total-price'>
                    <span>Tổng tiền khách thanh toán</span>
                    <span>{formatMoney(getPriceForm().totalAmount)}</span>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <ReservationCode
                  hotelOnlineDetail={hotelOnlineDetail}
                  netPrice={getPriceForm().netPrice}
                  processingFee={getPriceForm().processingFee}
                />
              </Col>
            </Row>
          )}
        </Form.Item>
        <Row>
          <Col span={24}>
            <Form.Item
              label='Ghi chú'
              name='note'
              rules={[{ required: true, message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }) }]}
            >
              <TextArea placeholder='Nội dung' rows={3} allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Button type='primary' htmlType='submit'>
              Tạo phát sinh thêm
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AriseAddModal;
