import { Col, Row, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IconChevronDown } from '~/assets';
import { some } from '~/utils/constants/constant';
import { DATE_TIME_FORMAT } from '~/utils/constants/moment';
import { formatMoney, getPaymentStatusPSTFlight, getStatusPS } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import AriseMoreDetail from './AriseMoreDetail';
import './AriseMoreFlight.scss';

const AriseMoreFlight = (prod: any) => {
  const { keyTab, setKeyTab } = prod;
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { salesList, flightBookingPostProcessing } = useAppSelector(
    (state: some) => state?.flightReducer,
  );
  const { additionalPostProcessings } = flightBookingPostProcessing;
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);
  const columns: ColumnsType<some> = [
    {
      title: 'ID',
      key: 'index',
      render: (text, record, index) => {
        return <div style={{ minWidth: '50px' }}>{text?.id} </div>;
      },
    },
    {
      title: 'Loại phát sinh',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Ngày phát sinh',
      dataIndex: 'processingTime',
      key: 'processingTime',
      render: (text, record, index) => {
        return `${moment(text).format('DD-MM-YYYY')}`;
      },
    },
    {
      title: 'Người xử lý',
      dataIndex: 'saleId',
      key: 'saleId',
      render: (text, record, index) => {
        return text === 0 ? 'Tất cả' : `${salesList.find((el: some) => el.id === text)?.name}`;
      },
    },
    {
      title: 'Tiền khách trả',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      render: (text, record, index) => {
        return `${formatMoney(text)}`;
      },
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (text, record, index) => {
        const paymentStatus = getPaymentStatusPSTFlight(text);
        const status = getStatusPS(record.status);
        return (
          <Row wrap={false} style={{ maxWidth: '280px' }}>
            <Col>
              <Tag color={paymentStatus.class}>{`${paymentStatus.title}`}</Tag>
              {record.paymentTime && (
                <div>{moment(record.paymentTime).format(DATE_TIME_FORMAT)} </div>
              )}
            </Col>
            <Col>
              <Tag color={status.class}>{`${status.title}`}</Tag>
            </Col>
          </Row>
        );
      },
    },
    Table.EXPAND_COLUMN,
  ];

  useEffect(() => {
    if (keyTab.key === '1') {
      setExpandedRowKeys(keyTab?.type === 'add' ? ['yuhcouqnart'] : []);
    }
  }, [keyTab]);
  return (
    <div className='arise-more-flight'>
      <Table
        className='table-customer-expand-row'
        rowKey={(record) => record.id.toString()}
        pagination={false}
        dataSource={[{ id: 'yuhcouqnart' }, ...(additionalPostProcessings || [])]}
        columns={columns}
        loading={additionalPostProcessings === undefined}
        expandable={{
          expandedRowRender: (record) => (
            <AriseMoreDetail
              record={record}
              id={id}
              addItemDone={() => {
                const temp = expandedRowKeys.filter((el) => el !== 'yuhcouqnart');
                setExpandedRowKeys(temp);
              }}
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

export default AriseMoreFlight;
