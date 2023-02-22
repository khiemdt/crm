import { Button, Form, Image, message, Modal, Space, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getAllBankCode } from '~/apis/flight';
import { getAirlines, getAllUserList } from '~/apis/system';
import { fetChangeEnableBankList } from '~/apis/tools';
import { AllowAgentType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';
const AccountListDA: React.FunctionComponent = () => {
  const [form] = Form.useForm();
  const allowAgents: AllowAgentType[] = useAppSelector((state) => state.systemReducer.allowAgents);
  const [listBank, setListBankPayment] = useState<some[]>([]);
  const [listBankRef, setListBankPaymentRef] = useState<some[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetAllBankCode = async () => {
    try {
      const { data } = await getAllBankCode();
      if (data.code === 200) {
        setListBankPayment(data.data);
      }
    } catch (error) {}
  };

  const changeEnableBankList = async (params: some) => {
    setLoading(true);
    try {
      const { data } = await fetChangeEnableBankList(params);
      if (data.code === 200) {
        message.success(data.message);
        getUserList();
      } else {
        message.error(data.message);
      }
      setLoading(false);
    } catch (error) {}
  };

  const getUserList = async () => {
    setLoading(true);
    try {
      const data = getAllUserList();
      console.log(data);

      if (data?.message === 200) {
        setListBankPaymentRef(data.data);
      } else {
        message.error(data.message);
      }
      setLoading(false);
    } catch (error) {}
  };

  const confirmModal = (record: some) => {
    Modal.confirm({
      title: `Bạn có muốn ${record.active ? 'tắt' : 'bật'} hãng ${record.name} `,
      content: 'Vui lòng xác nhận kỹ thông tin trước khi thao tác!',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        changeEnableBankList({ id: record.bankID });
      },
    });
  };

  const columns: ColumnsType<some> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text) => {
        return (
          <div>
            <Image style={{ borderRadius: '50%' }} width={50} src={text} />
          </div>
        );
      },
    },
    {
      title: 'Tên',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text, record) => {
        return <div>{`${text} ${record.fullName}`}</div>;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => {
        return <div>{text}</div>;
      },
    },
    {
      title: 'Số điện thoai',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => {
        return <div>{text}</div>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (text, record) => {
        return (
          <Space>
            <Switch
              onChange={(value, e) => {
                e.stopPropagation();
                confirmModal(record);
              }}
              checked={text}
            />
            <Button type='primary'>Sửa</Button>
            <Button type='ghost'>Xóa</Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h3 className='title'>Danh sách người dùng</h3>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={listBankRef}
        loading={loading}
        pagination={false}
      />
    </div>
  );
};
export default AccountListDA;
