import { Button, Col, message, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { actionFlightRefundBookings, createFlightRefundBookings } from '~/apis/approval';
import { SUCCESS_CODE } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import { FlightRefundStatus } from '../constant';

interface IFlightRefundDashboardExpandRowProps {
  record: some;
  handelRefresh: () => void;
}

const FlightRefundDashboardExpandRow: React.FunctionComponent<
  IFlightRefundDashboardExpandRowProps
> = ({ record, handelRefresh }) => {
  const intl = useIntl();

  const [note, setNote] = React.useState<string>(record?.voidPostProcessing?.note);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleCreateNote = async (content: string | null) => {
    if (isEmpty(content?.trim())) {
      message.error(intl.formatMessage({ id: 'IDS_TEXT_EMPTY_NOTE_ERROR' }));
    } else {
      try {
        setLoading(true);

        const { data } = await createFlightRefundBookings({
          ...record?.voidPostProcessing,
          group: 'void',
          note: content?.trim(),
        });
        if (data.code === SUCCESS_CODE) {
          message.success(`${intl.formatMessage({ id: 'IDS_TEXT_SUCCESS' })}`);
        } else {
          message.error(data?.message);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  const actionApproveBooking = async (value: some) => {
    try {
      setLoading(true);
      const { data } = await actionFlightRefundBookings(value);
      if (data.code === SUCCESS_CODE) {
        handelRefresh();
        message.success(`${intl.formatMessage({ id: 'IDS_TEXT_SUCCESS' })}`);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify='start' wrap={false} gutter={10}>
      <Col span={2}></Col>
      <Col span={6}>
        <span>
          Số khách: {record?.voidPostProcessing?.guestNum}&nbsp;
          {record?.voidPostProcessing?.segmentNum
            ? `| Số chặng: ${record?.voidPostProcessing?.segmentNum}`
            : ''}
          &nbsp;|&nbsp;Sign-in:&nbsp;
          {record?.voidPostProcessing?.signIn}
        </span>
        <div className='fl-approval-ticket-info-container'>
          {record?.voidPostProcessing?.eticketData?.map((elm: some, index: number) => {
            return (
              <div key={index} className='fl-approval-ticket-info'>
                <div className='fl-approval-ticket-info-ticket'>{elm?.eticketNumber}</div>
                <div className='fl-approval-ticket-info-ticket-price'>
                  {formatMoney(elm?.price)}
                </div>
              </div>
            );
          })}
        </div>
      </Col>
      <Col span={6}>
        <div>Phương thức thanh toán: {record?.voidPostProcessing?.paymentMethodName}</div>
        <div style={{ whiteSpace: 'pre-line' }}>{record?.voidPostProcessing?.paymentInfo}</div>
      </Col>
      <Col span={5}>
        <TextArea
          rows={4}
          placeholder='Nội dung ghi chú'
          maxLength={2000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Button
          onClick={() => {
            handleCreateNote(note);
          }}
          disabled={isEmpty(note)}
          type='primary'
          style={{ marginTop: 10 }}
          loading={loading}
        >
          Lưu ghi chú
        </Button>
      </Col>
      {record?.status === FlightRefundStatus.pending && (
        <Col span={5}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type='primary'
              onClick={() =>
                actionApproveBooking({
                  action: 'approve',
                  id: record?.id,
                })
              }
              loading={loading}
            >
              Phê duyệt
            </Button>
            <Button
              onClick={() => actionApproveBooking({ action: 'reject', id: record?.id })}
              style={{ marginLeft: 8 }}
            >
              Từ chối
            </Button>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default FlightRefundDashboardExpandRow;
