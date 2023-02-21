import { Checkbox, Col, Divider, message, Popconfirm, Row, Upload } from 'antd';
import * as React from 'react';
import { useIntl } from 'react-intl';
import * as XLSX from 'xlsx';
import { changeBookingVoidability } from '~/apis/flight';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { getModalActionMenu, itemsMenu } from '../headerFlight/BusinessOperations';

interface INoteManipulationProps {}

const NoteManipulation: React.FunctionComponent<INoteManipulationProps> = (props) => {
  const intl = useIntl();
  const [modal, setModal] = React.useState<some>({ type: null, open: null });
  const dispatch = useAppDispatch();
  const { flightOnlineDetail } = useAppSelector((state: some) => state?.flightReducer);

  const handleCloseModal = () => {
    setModal({ ...modal, open: false });
  };
  interface President {
    Name: string;
    Index: number;
  }

  const beforeUpload = (file: any) => {
    const name = file.name;
    if (name.match(/\.(jpg|jpeg|png)$/)) {
      message.error(intl.formatMessage({ id: 'IDS_TEXT_FILE_FORMAT_NOT_CORRECT' }));
      return null;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt?.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      console.log(ws);

      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 2, raw: false, dateNF: 'yyyy-mm-dd' });
      /* Update state */
      console.log(data);
    };
    reader.readAsBinaryString(file);
    return name;
  };

  const toggleAllowVoidTicket = async (params: some) => {
    try {
      const { data } = await changeBookingVoidability(params);
      if (data.code === 200) {
        message.success('Đổi trạng thái hỗ trợ void vé thành công!');
        dispatch(fetFlightBookingsDetail({ filters: { dealId: flightOnlineDetail.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  return (
    <div className='fl-note-manipulation'>
      {!isEmpty(flightOnlineDetail?.lastSaleId) && (
        <>
          {(flightOnlineDetail.outboundPnrStatus == 'confirmed' ||
            flightOnlineDetail.inboundPnrStatus == 'confirmed') && (
            <div>
              <Popconfirm
                placement='top'
                title='Bạn có chắc chắn muốn đổi trạng thái hỗ trợ void vé?'
                onConfirm={() =>
                  toggleAllowVoidTicket({
                    bookingId: flightOnlineDetail?.id,
                    voidable: !flightOnlineDetail.allowVoid,
                  })
                }
                okText='Ok'
                cancelText='Hủy'
              >
                <Row className='fl-note-menu-item'>
                  <Col span={3}>
                    <Checkbox checked={!flightOnlineDetail.allowVoid} className='check-box' />
                  </Col>
                  <Col span={21} style={{ paddingTop: 2 }}>
                    <span>Không hỗ trợ hủy vé tự động</span>
                  </Col>
                </Row>
              </Popconfirm>
              <Divider style={{ margin: '10px 0px' }} />
            </div>
          )}
          {itemsMenu({
            flightOnlineDetail,
            setModal,
          })?.map((item: some, index: number) => {
            if (item?.hide) return;
            return item.isUpload ? (
              <Row key={index} className='fl-note-menu-item' onClick={item?.handelAction}>
                <Col span={3}>
                  <Upload beforeUpload={beforeUpload}> {item?.icon} </Upload>
                </Col>
                <Col span={21} style={{ paddingTop: 2 }}>
                  <Upload beforeUpload={beforeUpload}>{item?.name}</Upload>
                </Col>
              </Row>
            ) : (
              <Row key={index} className='fl-note-menu-item' onClick={item?.handelAction}>
                <Col span={3}>{item?.icon}</Col>
                <Col span={21} style={{ paddingTop: 2 }}>
                  {item?.name}
                </Col>
              </Row>
            );
          })}
        </>
      )}
      {getModalActionMenu({
        modal,
        handleCloseModal,
        setModal,
      })}
    </div>
  );
};

export default NoteManipulation;
