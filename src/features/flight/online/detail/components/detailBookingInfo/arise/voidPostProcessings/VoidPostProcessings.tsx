import { Button, Col, message, Row, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createPreviewRefundRequest } from '~/apis/flight';
import { IconChevronDown } from '~/assets';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import { some } from '~/utils/constants/constant';
import {
  formatMoney,
  getPaymentStatusVoidProcessing,
  getStatusVoidProcessing,
} from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import '../AriseMoreFlight.scss';
import VoidPostProcessingsDetail from './VoidPostProcessingsDetail';

const VoidPostProcessings = (prods: any) => {
  const { keyTab, setKeyTab } = prods;
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { salesList, flightBookingPostProcessing } = useAppSelector(
    (state: some) => state?.flightReducer,
  );
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);
  const columns: ColumnsType<some> = [
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
      title: 'Loại hoàn',
      dataIndex: 'voidType',
      key: 'voidType',
      render: (text, record, index) => {
        return index === 0 ? (
          <span className='init-type'>
            Loại hoàn
            <IconChevronDown style={{ marginLeft: 4 }} />
          </span>
        ) : (
          `${text ? text : ''}`
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
      title: 'Người xử lý',
      dataIndex: 'saleId',
      key: 'saleId',
      render: (text, record, index) => {
        return index === 0 ? (
          <span className='init-type'>
            {salesList.find((el: some) => el.id === userInfo.id)?.name}
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
      title: 'Tiền trả khách',
      dataIndex: 'price',
      key: 'price',
      render: (text, record, index) => {
        return index === 0 ? '' : `${formatMoney(text)}`;
      },
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'previewStatus',
      key: 'previewStatus',
      render: (text, record, index) => {
        const status = getStatusVoidProcessing(text);
        const paymentStatus = getPaymentStatusVoidProcessing(record.paymentStatus);
        return index === 0 ? (
          ''
        ) : (
          <>
            <div className='lase-sale'>
              {text != 'approved' && (
                <div className='group-button-action group-button-action-flight-online'>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreatePreviewRefundRequest(record);
                    }}
                  >
                    Gửi yêu cầu phê duyệt
                  </Button>
                </div>
              )}
              <Row wrap={true} className={text != 'approved' ? 'name-sale' : ''}>
                <Col>
                  <Tag style={{ margin: '2px' }} color={status.class}>{`${status.title}`}</Tag>
                </Col>
                <Col>
                  <Tag
                    style={{ margin: '2px' }}
                    color={paymentStatus.class}
                  >{`${paymentStatus.title}`}</Tag>
                </Col>
              </Row>
            </div>
          </>
        );
      },
    },
    Table.EXPAND_COLUMN,
  ];

  const handleCreatePreviewRefundRequest = async (record: some) => {
    try {
      const { data } = await createPreviewRefundRequest({ id: record.id });
      if (data.code === 200) {
        message.success('Gửi yêu cầu phê duyệt thành công!');
      } else {
        message.error(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {}
  };

  const { voidPostProcessings } = flightBookingPostProcessing;

  useEffect(() => {
    if (keyTab.key === '2') {
      setExpandedRowKeys(keyTab?.type === 'add' ? ['yuhcouqnart'] : []);
    }
  }, [keyTab]);
  return (
    <div className='arise-more-flight'>
      <Table
        className='table-customer-expand-row'
        rowKey={(record) => record.id.toString()}
        pagination={false}
        dataSource={[{ id: 'yuhcouqnart' }, ...(voidPostProcessings || [])]}
        columns={columns}
        loading={voidPostProcessings === undefined}
        expandable={{
          expandedRowRender: (record) => (
            <VoidPostProcessingsDetail
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

export default VoidPostProcessings;
