import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Reconciliation.scss';
import { Table, TableColumnType } from 'antd';
import moment from 'moment';
import { getHistoryLog } from '~/apis/flight';
type Props = {
  objectType: string;
};

const HistoryProcess: FC<Props> = (props: any) => {
  const { objectType } = props;
  const params = useParams<any>();

  const [notes, setNotes] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);

  const fetNotes = async () => {
    try {
      setLoading(false);
      const { data } = await getHistoryLog({
        objectId: params.id,
        objectType,
        page: 0,
        size: 50,
      });
      setLoading(false);
      if (data.code === 200) {
        setLoading(false);
        setNotes(data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetNotes();
  }, []);

  const columns: TableColumnType<any>[] = [
    {
      title: 'STT',
      key: 'idx',
      align: 'center',
      width: 40,
      render: (value, record, index) => (record.userName ? index + 1 : ''),
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 120,
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: 'created',
      key: 'created',
      width: 120,
      render: (value) => <>{moment(value).format('DD/MM/YYYY HH:mm')}</>,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 100,
    },
    {
      title: 'Chi tiết thay đổi',
      dataIndex: 'variableName',
      key: 'variableName',
      align: 'left',
      width: 150,
    },
    {
      title: 'Nội dung cũ',
      dataIndex: 'before',
      key: 'before',
      width: 120,
    },
    {
      title: 'Nội dung mới',
      dataIndex: 'after',
      key: 'after',
      width: 120,
    },
  ];

  return (
    <div>
      {' '}
      <Table
        bordered
        loading={loading}
        size='small'
        expandable={{
          expandIconColumnIndex: 5,
        }}
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={notes?.items?.map((item: any) => ({
          ...item,
          key: item.id,
          children: item.changes.map((change: any, index: number) => ({
            ...change,
            key: `${item.id}_${index}`,
          })),
        }))}
        scroll={{
          x: '100%',
        }}
        pagination={false}
      />
    </div>
  );
};

export default HistoryProcess;
