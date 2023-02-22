import {
  Button,
  Drawer,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { getAllUserList } from '~/apis/system';
import { fetChangeEnableBankList } from '~/apis/tools';
import { IconChevronDown } from '~/assets';
import { some } from '~/utils/constants/constant';
import { listGender } from '~/utils/constants/dataOptions';
const AccountListDA: React.FunctionComponent = () => {
  const [listBankRef, setListBankPaymentRef] = useState<some[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modal, setModal] = useState<some>({
    open: false,
    item: null,
  });

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
      title: `Bạn có muốn xóa user ${record.firstName}`,
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
            <Image style={{ borderRadius: '50%' }} width={30} src={text} />
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
          <span>
            {<Tag color={text ? 'success' : 'error'}>{text ? 'Hoạt động' : 'Không hoạt động'}</Tag>}
          </span>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (text, record) => {
        return (
          <Space>
            <Button
              type='primary'
              onClick={() => {
                setModal({
                  open: true,
                  item: record,
                });
              }}
            >
              Sửa
            </Button>
            <Button
              onClick={() => {
                confirmModal(record);
              }}
              type='ghost'
            >
              Xóa
            </Button>
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
      <Row justify='space-between' style={{ marginBottom: 15 }}>
        <h3 className='title'>Danh sách người dùng</h3>
        <Button
          type='primary'
          onClick={() => {
            setModal({
              item: {},
              open: true,
            });
          }}
        >
          Thêm user
        </Button>
      </Row>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={listBankRef}
        loading={loading}
        pagination={false}
      />
      <BookingNotesDrawer modal={modal} setModal={setModal} />
    </div>
  );
};
export default AccountListDA;

const BookingNotesDrawer = (props: any) => {
  const { modal, setModal } = props;
  const { item } = modal;
  const [form] = Form.useForm();

  const onFinish = async (value: some) => {
    console.log(value);
    try {
      const data = getAllUserList();
      if (data?.message === 200) {
        handleClose();
      } else {
        message.error(data.message);
      }
    } catch (error) {}
  };

  const handleClose = () => {
    setModal({
      item: null,
      open: false,
    });
  };
  useEffect(() => {
    form.resetFields();
  }, [modal]);

  return (
    <Drawer
      title='Sửa người dùng'
      placement='right'
      onClose={() => {
        handleClose();
      }}
      visible={modal.open}
      width={400}
      className='drawer-arise-detail'
    >
      <>
        <Form form={form} initialValues={item} onFinish={onFinish} layout='vertical'>
          <Form.Item name='id' hidden>
            <Input />
          </Form.Item>
          <Form.Item name='firstName' label='Họ'>
            <Input />
          </Form.Item>
          <Form.Item name='fullName' label='Tên'>
            <Input />
          </Form.Item>
          <Form.Item name='gender' label='Giới tính'>
            <Select placeholder='Chọn' suffixIcon={<IconChevronDown />} optionFilterProp='children'>
              {listGender.map((el: some, indx: number) => (
                <Select.Option key={el.code} value={el.code}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='email' label='Email'>
            <Input />
          </Form.Item>
          <Form.Item name='phone' label='Số điện thoại'>
            <Input />
          </Form.Item>
          <Form.Item name='active' label='Trạng thái' valuePropName='checked'>
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type='primary' className='send-note'>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </>
    </Drawer>
  );
};
