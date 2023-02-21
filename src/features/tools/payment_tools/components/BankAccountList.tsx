import { Form, Image, message, Modal, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getAllBankCode } from '~/apis/flight';
import { getAirlines } from '~/apis/system';
import { fetChangeEnableBankList } from '~/apis/tools';
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
        getAirlineList();
      } else {
        message.error(data.message);
      }
      setLoading(false);
    } catch (error) {}
  };

  const getAirlineList = async () => {
    setLoading(true);
    try {
      const { data } = await getAirlines();
      if (data.code === 200) {
        setListBankPaymentRef(
          data.data?.items?.map((el: some) => ({
            ...el,
            active: true,
          })),
        );
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
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (text) => {
        return (
          <div>
            <Image width={50} src={text} />
          </div>
        );
      },
    },
    {
      title: 'Tên hãng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
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
    getAirlineList();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h3 className='title'>
        <FormattedMessage id='IDS_TEXT_LIST_AIRLINE' />
      </h3>
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
