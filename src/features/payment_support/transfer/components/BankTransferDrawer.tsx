import { Button, Col, Divider, Drawer, Input, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { fetAddHelpDeskNote, fetGetBankTransferNote } from '~/apis/paymentSupport';
import { IconCloseNoneCycle } from '~/assets';
import { some } from '~/utils/constants/constant';
import { TYPE_MODAL_BANK_TRANSFER } from '../../constant';

interface Props {
  modal: some;
  setModal: any;
}

const BankTransferDrawer: FC<Props> = (props) => {
  const { modal, setModal } = props;
  const { item } = modal;
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState(null);
  const [loading, setLoading] = useState(false);

  const title = (
    <div className='header-detail'>
      <span>{modal.title} </span>
      <IconCloseNoneCycle
        style={{ cursor: 'pointer' }}
        onClick={() =>
          setModal({
            type: undefined,
            item: undefined,
            title: undefined,
          })
        }
      />
    </div>
  );

  const getBankTransferNote = async () => {
    setLoading(true);
    try {
      const { data } = await fetGetBankTransferNote({
        bankTransferTransactionId: item.id,
      });
      if (data.code === 200) {
        setNotes(data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const addHelpDeskNote = async () => {
    try {
      const { data } = await fetAddHelpDeskNote({
        transactionId: item.id,
        content: newNote,
      });
      if (data.code === 200) {
        getBankTransferNote();
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (modal.type == TYPE_MODAL_BANK_TRANSFER.NOTE) {
      getBankTransferNote();
    }
  }, [modal]);
  return (
    <Drawer
      title={title}
      placement='right'
      closable={false}
      onClose={() =>
        setModal({
          type: undefined,
          item: undefined,
          title: undefined,
        })
      }
      visible={modal.type === TYPE_MODAL_BANK_TRANSFER.NOTE}
      width={340}
      className='drawer-arise-detail'
    >
      {modal.type == TYPE_MODAL_BANK_TRANSFER.NOTE && (
        <>
          <Input.TextArea
            onChange={(e: any) => {
              setNewNote(e.target.value);
            }}
            rows={3}
            placeholder='Nội dung ghi chú'
          />
          <Button
            onClick={() => {
              addHelpDeskNote();
            }}
            type='primary'
            className='send-note'
            loading={loading}
          >
            <FormattedMessage id='IDS_TEXT_SEND' />
          </Button>
          <Divider />
        </>
      )}
      {notes?.map((el: some, idx: number) => (
        <div key={idx} style={{ borderBottom: '1px solid #D9DBDC', padding: '5px 0px' }}>
          <Row>
            <Col span={24}>{el.content} </Col>
            <Col span={12} className='text-grey'>
              {el.createdTime}
            </Col>
            <Col span={12} className='text-grey' style={{ textAlign: 'right' }}>
              {el.user?.name}
            </Col>
          </Row>
        </div>
      ))}
      {item?.handledByUser && (
        <Row className='text-success' style={{ padding: '5px 0px' }}>
          <Col span={8}>Người xử lý: </Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            {item.handledByUser?.name}{' '}
          </Col>
        </Row>
      )}
    </Drawer>
  );
};

export default BankTransferDrawer;
