import { Col, Form, Image, message, Modal, Row, Select, Switch, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { getAllBankCode } from '~/apis/flight';
import { fetChangeEnableBankList, fetGetBankList } from '~/apis/tools';
import { AllowAgentType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';
const BankAccountList: React.FunctionComponent = () => {
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
        getBankList();
      } else {
        message.error(data.message);
      }
      setLoading(false);
    } catch (error) {}
  };

  const getBankList = async () => {
    const params = form.getFieldsValue(true);
    setLoading(true);
    try {
      const { data } = await fetGetBankList(params);
      if (data.code === 200) {
        setListBankPaymentRef(data.data?.bankList);
      } else {
        message.error(data.message);
      }
      setLoading(false);
    } catch (error) {}
  };

  const confirmModal = (record: some) => {
    Modal.confirm({
      title: `Bạn có muốn ${record.status ? 'tắt' : 'bật'} ngân hàng ${record.code} `,
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
      title: 'CA',
      dataIndex: 'caInfo',
      key: 'caInfo',
      render: (text) => {
        return <div>{text.name}</div>;
      },
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (text) => {
        return (
          <div>
            <Image width={150} src={text} />
          </div>
        );
      },
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      key: 'bankName',
      render: (text) => {
        return <div style={{ maxWidth: '350px' }}>{text}</div>;
      },
    },
    {
      title: 'Mã ngân hàng',
      dataIndex: 'code',
      key: 'code',
      render: (text) => {
        return <div>{text}</div>;
      },
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'bankNumber',
      key: 'bankNumber',
      render: (text) => {
        return (
          <div>
            <Tag color='processing'>{text}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return (
          <Switch
            onChange={(value, e) => {
              e.stopPropagation();
              confirmModal(record);
            }}
            checked={text}
          />
        );
      },
    },
  ];

  useEffect(() => {
    fetAllBankCode();
    getBankList();
  }, []);

  return (
    <div>
      <div>
        <Form
          form={form}
          scrollToFirstError
          colon={false}
          initialValues={{
            bankCode: null,
            caId: null,
          }}
          onValuesChange={(changedValues, allValues) => {
            getBankList();
          }}
        >
          <Row justify='start' wrap={false} gutter={10}>
            <Col span={6}>
              <Form.Item name='caId'>
                <Select
                  dropdownStyle={{ width: 220, minWidth: 220 }}
                  placeholder='CA'
                  allowClear
                  className='fl-approval-select'
                  showSearch
                  optionFilterProp='children'
                >
                  {allowAgents.map((elm: some, index: number) => {
                    return (
                      <Select.Option key={index} value={elm.id}>
                        {elm.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='bankCode'>
                <Select
                  dropdownStyle={{ width: 220, minWidth: 220 }}
                  placeholder='Ngân hàng'
                  allowClear
                  className='fl-approval-select'
                  showSearch
                  optionFilterProp='children'
                >
                  {listBank?.map((val: any, index: number) => {
                    return (
                      <Select.Option key={index} value={val}>
                        {val}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
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
export default BankAccountList;
