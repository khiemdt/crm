import { DatePicker, Form, Input, message, Modal, Popconfirm, Select, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { updateFlightGuestInfo } from '~/apis/flight';
import { IconCalendar, IconCloseNoneCycle, IconEditBlue } from '~/assets';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import '~/features/flight/online/detail/FlightDetail.scss';
import { some } from '~/utils/constants/constant';
import { listGender } from '~/utils/constants/dataOptions';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

const getEatGuest = (
  guestId: number,
  ancillaries: some[],
  isDeparture: boolean,
  ancillaryType: string,
) => {
  let result: some[] = [];
  ancillaries.forEach((el: some) => {
    if (el.departure === isDeparture) {
      el.items.forEach((item: some) => {
        if (item.guestId === guestId && item.ancillaryType === ancillaryType) {
          result.push({
            quantity: item.quantity,
            title: item.title,
            price: item.price,
            ancillaryBookingId: item.ancillaryBookingId,
          });
        }
      });
    }
  });
  return result;
};

const getInputType = (dataIndex: string) => {
  switch (dataIndex) {
    case 'fullName':
    case 'outboundEticketNo':
    case 'inboundEticketNo':
    case 'passport':
      return 'text';
    case 'dob':
    case 'passportExpiry':
      return 'date';
    case 'gender':
    case 'passportCountry':
    case 'nationality':
      return 'select';
    default:
      return '';
  }
};

const getRulesType = (dataIndex: string) => {
  switch (dataIndex) {
    case 'fullName':
      return [
        {
          required: true,
          message: `Vui lòng nhập họ và tên`,
        },
      ];
    default:
      return [];
  }
};

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'date' | 'select';
  record: some;
  index: number;
  children: React.ReactNode;
  rules: some[];
  optionsSelect: some[];
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  rules,
  optionsSelect,
  ...restProps
}) => {
  const inputNode =
    inputType === 'text' ? (
      <Input />
    ) : inputType === 'select' ? (
      dataIndex === 'gender' ? (
        <Select>
          {optionsSelect.map((el: some) => (
            <Select.Option value={el.code}>{el.name}</Select.Option>
          ))}
        </Select>
      ) : (
        <Select
          showSearch
          filterOption={(input, option) =>
            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
        >
          {optionsSelect.map((el: some) => (
            <Select.Option value={el.name}>{el.name}</Select.Option>
          ))}
        </Select>
      )
    ) : inputType === 'date' ? (
      <DatePicker
        format='DD/MM/YYYY'
        placeholder='DD/MM/YYYY'
        allowClear={false}
        suffixIcon={<IconCalendar />}
      />
    ) : null;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }} rules={rules}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

let countApiUpdate = 0;
const InfoGuestsModal = (props: any) => {
  const { visibleModal, setVisibleModal } = props;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const countries = useAppSelector((state) => state.systemReducer.countries);
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState(booking?.guests || []);

  const columns = [
    {
      title: '#',
      key: 'index',
      render: (text: any, record: some, index: any) => {
        return `${index + 1}`;
      },
      width: 40,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Họ và tên',
      key: 'fullName',
      dataIndex: 'fullName',
      fixed: 'left',
      editable: true,
    },
    {
      title: 'Giới tính',
      key: 'gender',
      dataIndex: 'gender',
      width: 85,
      render: (text: any) => {
        return `${text === 'F' ? 'Nữ' : 'Nam'}`;
      },
      editable: true,
    },
    {
      title: 'Ngày sinh',
      key: 'dob',
      dataIndex: 'dob',
      width: 140,
      editable: true,
      render: (text: any) => {
        return (
          <>
            {!isEmpty(text) ? <span>{moment(text, 'DD-MM-YYYY').format('DD/MM/YYYY')}</span> : ''}
          </>
        );
      },
    },
    {
      title: 'Độ tuổi',
      key: 'ageCategory',
      dataIndex: 'ageCategory',
      render: (text: any) => {
        return `${text == 'adult' ? 'Người lớn' : text == 'children' ? 'Trẻ em' : 'Em bé'}`;
      },
      width: 85,
    },
    {
      title: 'Hành lý chiều đi',
      key: 'outboundBaggage',
      dataIndex: 'outboundBaggage',
      render: (text: any) => {
        return (
          <>
            {!isEmpty(text) ? (
              <span>
                <span className='value-col-inbound-baggage'>{`${text.weight}kg`}</span>
                {/* <span>{`(${formatMoney(text.price)})`}</span> */}
              </span>
            ) : (
              ''
            )}
          </>
        );
      },
      width: 75,
    },
    {
      title: 'Hành lý chiều về',
      key: 'inboundBaggage',
      dataIndex: 'inboundBaggage',
      width: 75,
      render: (text: any) => {
        return (
          <>
            {!isEmpty(text) ? (
              <span>
                <span className='value-col-inbound-baggage'>{`${text.weight}kg`}</span>
                {/* <span>{`(${formatMoney(text.price)})`}</span> */}
              </span>
            ) : (
              ''
            )}
          </>
        );
      },
    },
    {
      title: 'Suất ăn chiều đi',
      key: 'id',
      dataIndex: 'id',
      width: 105,
      render: (text: any) => {
        const listEat: some[] = getEatGuest(text, booking.ancillaries || [], true, 'meal');
        return (
          <>
            {!isEmpty(listEat) ? (
              <div className='value-col-list-eat'>
                {listEat.map((el) => (
                  <Tooltip title={el.title} key={el.ancillaryBookingId}>
                    <span className='item-eat'>{`${el.quantity} suất - ${Math.floor(
                      (el?.price || 0) / 1000,
                    ).toLocaleString('de-DE')}k`}</span>
                  </Tooltip>
                ))}
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    },
    {
      title: 'Suất ăn chiều về',
      key: 'id',
      dataIndex: 'id',
      width: 105,
      render: (text: any) => {
        const listEat: some[] = getEatGuest(text, booking.ancillaries || [], false, 'meal');
        return (
          <>
            {!isEmpty(listEat) ? (
              <div className='value-col-list-eat'>
                {listEat.map((el) => (
                  <Tooltip title={el.title} key={el.ancillaryBookingId}>
                    <span className='item-eat'>{`${el.quantity} suất - ${Math.floor(
                      (el?.price || 0) / 1000,
                    ).toLocaleString('de-DE')}k`}</span>
                  </Tooltip>
                ))}
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    },
    {
      title: 'Chỗ ngồi chiều đi',
      key: 'id',
      width: 105,
      dataIndex: 'id',
      render: (text: any) => {
        const listEat: some[] = getEatGuest(text, booking.ancillaries || [], true, 'seat');
        return (
          <>
            {!isEmpty(listEat) ? (
              <div className='value-col-list-eat'>
                {listEat.map((el, idx) => (
                  <span className='item-eat' key={idx.toString()}>{`${el.title} - ${Math.floor(
                    (el?.price || 0) / 1000,
                  ).toLocaleString('de-DE')}k`}</span>
                ))}
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    },
    {
      title: 'Chỗ ngồi chiều về',
      key: 'id',
      width: 105,
      dataIndex: 'id',
      render: (text: any) => {
        const listEat: some[] = getEatGuest(text, booking.ancillaries || [], false, 'seat');
        return (
          <>
            {!isEmpty(listEat) ? (
              <div className='value-col-list-eat'>
                {listEat.map((el, idx) => (
                  <span className='item-eat' key={idx.toString()}>{`${el.title} - ${Math.floor(
                    (el?.price || 0) / 1000,
                  ).toLocaleString('de-DE')}k`}</span>
                ))}
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    },
    {
      title: 'Số vé chiều đi',
      key: 'outboundEticketNo',
      dataIndex: 'outboundEticketNo',
      width: 125,
      editable: true,
    },
    {
      title: 'Số vé chiều về',
      key: 'inboundEticketNo',
      dataIndex: 'inboundEticketNo',
      width: 125,
      editable: true,
    },
    {
      title: 'Số hộ chiếu',
      key: 'passport',
      width: 125,
      dataIndex: 'passport',
      editable: true,
    },
    {
      title: 'Thời hạn hộ chiếu',
      key: 'passportExpiry',
      dataIndex: 'passportExpiry',
      width: 140,
      editable: true,
      render: (text: any) => {
        return (
          <>
            {!isEmpty(text) ? <span>{moment(text, 'DD-MM-YYYY').format('DD/MM/YYYY')}</span> : ''}
          </>
        );
      },
    },
    {
      title: 'Quốc tịch',
      key: 'passportCountry',
      dataIndex: 'passportCountry',
      width: 115,
      editable: true,
    },
    {
      title: 'Nước cấp hộ chiếu',
      key: 'nationality',
      dataIndex: 'nationality',
      width: 115,
      editable: true,
    },
    {
      title: '',
      align: 'center',
      width: 45,
      render: (text: any, record: any, index: any) => {
        const editable = isEditing(record);
        return (
          <>
            {editable ? (
              <Popconfirm
                placement='topRight'
                title='Bạn có chắc muốn lưu lại chỉnh sửa này?'
                okText='Đồng ý'
                cancelText='Hủy'
                onConfirm={() => save(record.id)}
              >
                <span style={{ color: '#004EBC' }}>Lưu</span>
              </Popconfirm>
            ) : (
              <IconEditBlue onClick={() => edit(record)} />
            )}
          </>
        );
      },
      key: 'action',
      fixed: 'right',
    },
  ];

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as some;
      const newData = [...booking.guests];
      const index = newData.findIndex((item) => key === item.id);
      const item = newData[index];
      const itemUpdate: some = {
        guestId: key,
        ...row,
        dob: !isEmpty(row.dob) ? row.dob.format('DD-MM-YYYY') : null,
        passportExpiry: !isEmpty(row.passportExpiry)
          ? row.passportExpiry.format('DD-MM-YYYY')
          : null,
        inboundEticketNumber: row.inboundEticketNo,
        outboundEticketNumber: row.outboundEticketNo,
        nationalityCode: !isEmpty(row.nationality)
          ? countries?.find((el: some) => el.name === row.nationality)?.code
          : null,
        passportCountryCode: !isEmpty(row.passportCountry)
          ? countries?.find((el: some) => el.name === row.passportCountry)?.code
          : null,
        firstName: item.firstName,
        lastName: item.lastName,
      };
      delete itemUpdate.inboundEticketNo;
      delete itemUpdate.outboundEticketNo;
      delete itemUpdate.nationality;
      delete itemUpdate.passportCountry;
      const dataDto = {
        bookingId: booking.id,
        updates: [itemUpdate],
      };
      const { data } = await updateFlightGuestInfo(dataDto);
      if (data.code === 200) {
        message.success('Cập nhật thông tin thành công!');
        countApiUpdate += 1;
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
      } else {
        message.error(data.message);
      }
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleCloseModal = () => {
    if (countApiUpdate > 0) {
      dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
    }
    setVisibleModal(false);
  };

  useEffect(() => {
    if (visibleModal) {
      countApiUpdate = 0;
      setData(booking?.guests);
    }
  }, [visibleModal]);

  const isEditing = (record: some) => record.id === editingKey;

  const edit = (record: some) => {
    form.setFieldsValue({
      ...record,
      passportExpiry: !isEmpty(record.passportExpiry)
        ? moment(record.passportExpiry, 'DD-MM-YYYY')
        : null,
      dob: !isEmpty(record.dob) ? moment(record.dob, 'DD-MM-YYYY') : null,
    });
    setEditingKey(record.id);
  };

  const mergedColumns = columns.map((col: some) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: some) => ({
        record,
        inputType: getInputType(col.dataIndex),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        rules: getRulesType(col.dataIndex),
        optionsSelect: getOptionSelect(col.dataIndex),
      }),
    };
  });

  const getOptionSelect = (dataIndex: string) => {
    switch (dataIndex) {
      case 'gender':
        return listGender;
      case 'passportCountry':
      case 'nationality':
        return countries;
      default:
        return [];
    }
  };

  return (
    <Modal
      className='modal-delete-invoice modal-info-guests'
      visible={visibleModal}
      onCancel={handleCloseModal}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={1400}
    >
      <div className='title'>Thông tin hành khách</div>
      <Form form={form} component={false}>
        <Table
          rowKey={(record) => record.id}
          columns={mergedColumns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 1900 }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
        />
      </Form>
    </Modal>
  );
};
export default InfoGuestsModal;
