import { FC, useState, useEffect } from 'react';
import { TableColumnType, Table, Dropdown, Button, Menu, Typography } from 'antd';
import { IconChevronDown } from '~/assets/index';

import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import PaginationTable from '~/components/pagination/PaginationTable';
import {
  adapterQueryReconlition,
  formatMoney,
  isEmpty,
  removeFieldEmptyFilter,
} from '~/utils/helpers/helpers';

import ErrorFilter from './ErrorFilter';
import UpdateErrorModal from './UpdateErrorModal';
import ConfirmCancelErrorModal from './ConfirmCancelErrorModal';
import { routes, some } from '~/utils/constants/constant';
import { getErrorTagsReconcile } from '~/apis/flight';

import './Reconciliation.scss';
type Props = {};

const modalTypes = {
  COMFIRM_ERROR: 'COMFIRM_ERROR',
  REJECT_ERROR: 'REJECT_ERROR',
  EDIT_ERROR: 'EDIT_ERROR',
};
const Reconciliation: FC<Props> = (props) => {
  const navigate = useNavigate();
  const [reconcileData, setReconcileData] = useState<some>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReconcile = async (params = {}) => {
    try {
      setLoading(true);
      const { data } = await getErrorTagsReconcile(params);
      setLoading(false);
      if (data.code === 200) {
        setReconcileData(data.data);
      }
    } catch (error) {}
  };

  const [pagingOnline, setPagingOnline] = useState({
    page: 1,
    size: 0,
  });
  const [modal, setModal] = useState({
    type: '',
    item: {},
  });
  const [filterOnline, setFilterOnline] = useState({});
  const [rowKeys, setRowKeys] = useState<any>([]);

  const menu = (record: any) => {
    return (
      <Menu className='menu-customer'>
        <Menu.Item
          key='0'
          onClick={() =>
            setModal({
              type: modalTypes.COMFIRM_ERROR,
              item: record,
            })
          }
          disabled={record.status === 'CONFIRM' || record.status === 'REJECT'}
        >
          Xác nhận lỗi
        </Menu.Item>
        <Menu.Item
          key='1'
          onClick={() =>
            setModal({
              type: modalTypes.REJECT_ERROR,
              item: record,
            })
          }
          disabled={record.status === 'CONFIRM' || record.status === 'REJECT'}
        >
          Từ chối lỗi
        </Menu.Item>
        <Menu.Item
          key='3'
          onClick={() =>
            setModal({
              type: modalTypes.EDIT_ERROR,
              item: record,
            })
          }
        >
          Cập nhật
        </Menu.Item>
      </Menu>
    );
  };
  const columns: TableColumnType<any>[] = [
    Table.SELECTION_COLUMN,
    {
      title: 'Mã lỗi',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 75,
      render: (value: any) => <Link to={`${location.pathname}/${value}`}>{value}</Link>,
    },
    {
      title: 'Kỳ đối soát',
      dataIndex: 'reconcileDate',
      key: 'reconcileDate',
      width: 125,
      align: 'center',
      render: (value: any) => <span>{value}</span>,
    },
    {
      title: 'Bộ phận xử lý',
      dataIndex: 'department',
      key: 'department',
      align: 'center',
      width: 120,
      render: (value: any) => <span>{value}</span>,
    },
    {
      title: 'Phân loại lỗi',
      dataIndex: 'errorTagsName',
      key: 'errorTagsName',
      render: (value: any) => <span>{value}</span>,
    },
    {
      title: 'Mã PNR',
      dataIndex: 'pnr',
      key: 'pnr',
      width: 90,
      render: (value: any) => <span>{value}</span>,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'bookingIds',
      key: 'bookingIds',
      width: 120,
      align: 'center',
      render: (value: any) => (
        <div>
          {value.map((el: any, idx: number) => (
            <>
              <Typography.Link href={`${routes.FLIGHT_ONLINE}/${el}`} target='_blank'>
                {el}
              </Typography.Link>
              {idx !== value.length - 1 && <span style={{ paddingRight: 4 }}>,</span>}
            </>
          ))}
        </div>
      ),
    },
    {
      title: 'Kênh bán',
      dataIndex: 'caName',
      width: 100,
      align: 'center',
      key: 'caName',
      render: (value: any) => <div>{!isEmpty(value) ? value : ''}</div>,
    },
    // {
    //   title: 'Chênh lệch',
    //   dataIndex: 'differentAmount',
    //   key: 'differentAmount',
    //   width: 120,
    //   align: 'center',
    //   render: (value: any) => <div>{formatMoney(value)}</div>,
    // },
    {
      title: 'Ghi nhận chênh lệch',
      dataIndex: 'confirmDifferentAmount',
      key: 'confirmDifferentAmount',
      width: 120,
      align: 'center',
      render: (value: any) => <div>{formatMoney(value)}</div>,
    },
    {
      title: 'Xử lý chênh lệch',
      dataIndex: 'solutionName',
      width: 150,
      key: 'solutionName',
      render: (value: any) => <div>{value ? value : ''}</div>,
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'statusText',
      key: 'statusText',
      width: 130,
      align: 'center',
      render: (value: any, record: any) => (
        <div
          style={{
            color:
              record.status === 'CONFIRM'
                ? '#1DA57A'
                : record.status === 'REJECT'
                ? '#ED2700'
                : '#0044A5',
          }}
        >
          {value ? value : ''}
        </div>
      ),
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'handlingUserName',
      key: 'handlingUserName',
      width: 150,
      render: (value: any, record: any) => <div>{value ? value : ''}</div>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (value: any, record: any) => (
        <Dropdown overlay={menu(record)} trigger={['click']}>
          <Button type='primary' className='customer-btn'>
            Xử lý
            <IconChevronDown style={{ marginLeft: 4 }} />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const onChangePagination = (page: number, size: number) => {
    handleChangeRoute(filterOnline, { page, size });
    setPagingOnline({
      page,
      size,
    });
    const dataQuery = adapterQueryReconlition(filterOnline, { page, size });
    fetchReconcile(dataQuery);
    // dispatch(
    //   fetFlightBookings({
    //     formData: filterOnline,
    //     isFilter: false,
    //     paging: { page, pageSize: size },
    //   }),
    // );
  };

  const handleChangeRoute = (formData: object, paging: some = {}) => {
    const searchParams = {
      ...removeFieldEmptyFilter(formData),
      ...paging,
    };
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...searchParams,
      }).toString(),
    });
  };

  const rowSelection = {
    selectedRowKeys: rowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setRowKeys(selectedRowKeys);
    },
    // getCheckboxProps: (record: any) => ({
    //   disabled: !(record.invoiceStatus === 'cancel' || !record.invoiceStatus),
    // }),
  };

  const fetFlightBookings = (formData: any, isFilter: boolean) => {
    if (isFilter) {
      const paging = {
        page: 1,
        size: 20,
      };
      setPagingOnline(paging);
      const dataQuery = adapterQueryReconlition(formData, paging);
      fetchReconcile(dataQuery);
      setFilterOnline(formData);
    }
  };

  return (
    <div className='main-page-error container-flight-online'>
      <div className='title-error'>Xử lý lỗi sau đối soát</div>
      <ErrorFilter
        rowKeys={rowKeys}
        setRowKeys={setRowKeys}
        handleSuccessAction={() => fetFlightBookings(filterOnline, true)}
        reconcileData={reconcileData}
        fetFlightBookings={fetFlightBookings}
        setPagingOnline={setPagingOnline}
      />
      <Table
        bordered
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={reconcileData?.items || []}
        loading={loading}
        pagination={false}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        scroll={{ x: 1600 }}
      />
      {reconcileData?.total > 0 && (
        <PaginationTable
          page={pagingOnline.page - 1}
          size={pagingOnline.size}
          onChange={onChangePagination}
          totalElements={reconcileData?.total}
        />
      )}
      <ConfirmCancelErrorModal
        modal={modal}
        setModal={setModal}
        modalTypes={modalTypes}
        handleSuccessAction={() => fetFlightBookings(filterOnline, true)}
      />
      <UpdateErrorModal
        modal={modal}
        setModal={setModal}
        modalTypes={modalTypes}
        handleSuccessAction={() => fetFlightBookings(filterOnline, true)}
      />
    </div>
  );
};

export default Reconciliation;
