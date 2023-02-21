import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { IconChevronDown } from '~/assets';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import { some } from '~/utils/constants/constant';
import { formatMoney } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
import '../AriseMoreFlight.scss';
import DamageIncurredDetail from './DamageIncurredDetail';

interface Props {
  keyTab?: any;
  setKeyTab?: any;
}
const DamageIncurred: React.FC<Props> = (prods) => {
  const { salesList, flightBookingPostProcessing } = useAppSelector(
    (state: some) => state?.flightReducer,
  );
  const { keyTab, setKeyTab } = prods;
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const getCreatorName = salesList?.find((val: some) => val?.id === userInfo?.id);

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);

  const columns: ColumnsType<some> = [
    {
      title: '#',
      key: 'index',
      render: (text, record, index) => {
        return index === 0 ? '' : `${index}`;
      },
    },
    {
      title: 'Loại phát sinh',
      dataIndex: 'type',
      key: 'type',
      render: (text, record, index) => {
        return index === 0 ? (
          <span className='init-type'>
            Loại phát sinh
            <IconChevronDown style={{ marginLeft: 4 }} />
          </span>
        ) : (
          `${text}`
        );
      },
    },
    {
      title: 'Ngày phát sinh',
      dataIndex: 'processingTime',
      key: 'processingTime',
      render: (text, record, index) => {
        return index === 0
          ? `${moment().format('DD-MM-YYYY')}`
          : `${moment(text).format('DD-MM-YYYY')}`;
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'saleId',
      key: 'saleId',
      render: (text, record, index) => {
        return index === 0 ? (
          <span className='init-type'>
            {getCreatorName?.name ?? 'Người tạo'}
            <IconChevronDown style={{ marginLeft: 4 }} />
          </span>
        ) : text === 0 ? (
          'Tất cả'
        ) : (
          `${salesList.find((el: some) => el.id === text)?.name}`
        );
      },
    },
    {
      title: 'Tiền thiệt hại',
      dataIndex: 'lossAmount',
      key: 'lossAmount',
      render: (text, record, index) => {
        return text === 0 ? '0đ' : text && formatMoney(text);
      },
    },
    Table.EXPAND_COLUMN,
  ];

  const { lossPostProcessings } = flightBookingPostProcessing;

  useEffect(() => {
    if (keyTab.key === '3') {
      setExpandedRowKeys(keyTab?.type === 'add' ? ['yuhcouqnart'] : []);
    }
  }, [keyTab]);

  return (
    <div className='arise-more-flight'>
      <Table
        className='table-customer-expand-row'
        rowKey={(record) => record.id.toString()}
        pagination={false}
        dataSource={[{ id: 'yuhcouqnart' }, ...(lossPostProcessings || [])]}
        columns={columns}
        loading={lossPostProcessings === undefined}
        expandable={{
          expandedRowRender: (record) => (
            <DamageIncurredDetail
              addItemDone={() => {
                const temp = expandedRowKeys.filter((el) => el !== 'yuhcouqnart');
                setExpandedRowKeys(temp);
              }}
              record={record}
              setKeyTab={setKeyTab}
              keyTab={keyTab}
            />
          ),
          expandIcon: ({ expanded, onExpand, record }) => {
            return record.id === 'yuhcouqnart' ? (
              ''
            ) : expanded ? (
              <span onClick={(e) => onExpand(record, e)}>
                <IconChevronDown style={{ transform: 'rotate(180deg)' }} />
              </span>
            ) : (
              <span onClick={(e) => onExpand(record, e)}>
                <IconChevronDown />
              </span>
            );
          },
          onExpandedRowsChange: (expandedRows: readonly React.Key[]) => {
            setExpandedRowKeys(expandedRows);
          },
          expandedRowKeys: expandedRowKeys,
          expandRowByClick: true,
        }}
      />
    </div>
  );
};

export default DamageIncurred;
