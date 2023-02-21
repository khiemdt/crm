import { FC, useEffect, useState } from 'react';
import './Reconciliation.scss';
import InfoError from './InfoError';
import { Breadcrumb, Button, Table, TableColumnType, Tabs } from 'antd';
import AddNote from './AddNote';
import { useNavigate, useParams } from 'react-router-dom';
import { some } from '~/utils/constants/constant';
import { getNotes, getReconlitionDetail } from '~/apis/flight';
import HistoryProcess from './HistoryUpdate';
import { IconBreadCrumb } from '~/assets';
type Props = {};
interface Params {
  id?: string;
}
const ErrorDetailPage: FC<Props> = (props) => {
  const [modal, setModal] = useState(false);
  const [reconcilation, setReconcilation] = useState<some>({});
  const [notes, setNotes] = useState<some>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetNotes();
    fetReconcilation();
  }, []);

  const fetReconcilation = async () => {
    try {
      const { data } = await getReconlitionDetail({
        id,
      });
      if (data.code === 200) {
        setReconcilation(data.data);
      }
    } catch (error) {}
  };

  const fetNotes = async () => {
    try {
      setLoading(true);
      const { data } = await getNotes({
        referenceId: id,
        noteType: 'reconcile_error_tags',
        module: 'flight',
      });
      setLoading(false);
      if (data.code === 200) {
        setNotes(data.data);
      }
    } catch (error) {}
  };

  if (!reconcilation) return null;

  const columns: TableColumnType<any>[] = [
    {
      title: 'STT',
      key: 'idx',
      align: 'center',
      width: 80,
      render: (value: any, record: any, idx: number) => <span>{idx + 1}</span>,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 220,
      align: 'center',
    },
    {
      title: 'Người tạo',
      dataIndex: 'userName',
      key: 'userName',
      width: 320,
    },
  ];

  return (
    <div className='rec-detail'>
      <div className='breadcrumb-error-detail'>
        <Breadcrumb>
          <Breadcrumb.Item className='no-pointer'>
            <IconBreadCrumb />
          </Breadcrumb.Item>
          <Breadcrumb.Item
            className='pointer'
            onClick={() => navigate('/sale/flight/reconciliation-error')}
          >
            Danh sách lỗi đối soát
          </Breadcrumb.Item>
          <Breadcrumb.Item className='breadcrumb-detail no-pointer'>
            Chi tiết lỗi đối soát
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <InfoError reconcilation={reconcilation} handleFetchPO={fetReconcilation} />
      <Tabs>
        <Tabs.TabPane tab='Ghi chú' key='note'>
          <>
            {' '}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '12px 0',
              }}
            >
              <Button type='primary' onClick={() => setModal(true)}>
                Thêm ghi chú
              </Button>
            </div>
            <Table
              bordered
              rowKey={(record) => record.id}
              columns={columns}
              dataSource={notes?.items || []}
              loading={loading}
              pagination={false}
            />
          </>
        </Tabs.TabPane>{' '}
        <Tabs.TabPane
          tab={
            <span>
              <span>Lịch sử cập nhật</span>
            </span>
          }
          key='history'
        >
          <HistoryProcess objectType='ERROR_TAGS' />
        </Tabs.TabPane>
      </Tabs>
      <AddNote modal={modal} setModal={setModal} getData={fetNotes} />
    </div>
  );
};

export default ErrorDetailPage;
