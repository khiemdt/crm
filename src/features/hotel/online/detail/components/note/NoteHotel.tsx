import { Button, Col, Divider, Input, message, Row, Tooltip, Typography } from 'antd';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import {
  createFlightBookingNote,
  deleteFlightBookingNoteImages,
  getBookingWorkLogs,
  getFlightBookingNote,
} from '~/apis/flight';
import { deleteHotelBookingNoteImages, uploadHotelNoteImage } from '~/apis/hotel';
import { IconImageUpload, IconSend } from '~/assets';
import DataEmpty from '~/components/dataEmpty/DataEmpty';
import { SUCCESS_CODE } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { CloseCircleOutlined } from '@ant-design/icons';
import ImagePreviewModal from '~/features/flight/online/detail/components/ImagePreviewModal';
import { fetHotelBookingsDetailInit } from '~/features/hotel/hotelSlice';

interface INoteHotelProps {}

const NoteHotel: React.FunctionComponent<INoteHotelProps> = (props) => {
  const intl = useIntl();
  const params = useParams();
  const dispatch = useAppDispatch();

  const hotelDetail: some = useAppSelector((state) => state.hotelReducer.hotelOnlineDetail);

  const [upFileLoading, setUpfileLoading] = React.useState<boolean>(false);
  const [loadingNoteList, setLoadingNoteList] = React.useState<boolean>(false);
  const [noteList, setNoteList] = React.useState<some[]>([]);
  const [modal, setModal] = React.useState<some>({});
  const [noteContent, setNoteContent] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetNoteList = async () => {
    try {
      setLoadingNoteList(true);
      const [note, workLogs]: some[] = await Promise.all([
        getFlightBookingNote({
          bookingId: params?.id || null,
          module: 'hotel',
        }),
        getBookingWorkLogs({
          bookingId: params?.id || null,
          module: 'hotel',
        }),
      ]);

      let dataSet: some[] = [];
      if (note?.data?.code === SUCCESS_CODE) {
        dataSet = note?.data?.data?.remarkList;
      }
      if (workLogs?.data?.code === SUCCESS_CODE) {
        dataSet = [...dataSet, ...workLogs?.data?.data];
      }
      if (hotelDetail?.saleNote) {
        dataSet.push({ content: hotelDetail?.saleNote });
      }
      setNoteList(dataSet);
    } catch (error) {
    } finally {
      setLoadingNoteList(false);
    }
  };

  const handleUploadFile = async (e: any) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const maxUpload = files[0].size / 1024 / 1024 <= 5;
      if (!files[0].name.match(/\.(jpg|jpeg|png)$/)) {
        message.error(intl.formatMessage({ id: 'IDS_TEXT_FILE_FORMAT_NOT_CORRECT' }));
        return null;
      }
      if (maxUpload) {
        const formData = new FormData();
        formData.append('file', files[0]);
        try {
          setUpfileLoading(true);
          const dataUpload = await uploadHotelNoteImage(
            { bookingId: params?.id || null, module: 'hotel' },
            formData,
          );
          if (dataUpload.data.code === SUCCESS_CODE) {
            dispatch(fetHotelBookingsDetailInit({ id: params?.id }));
            message.success(dataUpload?.data?.message);
          } else {
            message.error(dataUpload?.data?.message);
          }
        } catch (error) {
        } finally {
          setUpfileLoading(false);
        }
      } else {
        message.error(intl.formatMessage({ id: 'IDS_TEXT_MAX_SIZE_IMG_5M' }));
      }
    }
  };

  const handleRemoveImage = async (item: some) => {
    try {
      const { data } = await deleteHotelBookingNoteImages(item?.id, {
        bookingId: params?.id || null,
        module: 'hotel',
      });
      if (data.code === SUCCESS_CODE) {
        message.success(`${intl.formatMessage({ id: 'IDS_TEXT_SUCCESS' })}`);
        setModal({ startIndex: 0, open: false });
        dispatch(fetHotelBookingsDetailInit({ id: params?.id }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
    }
  };

  const handleCreateNote = async (content: string | null) => {
    if (isEmpty(content?.trim())) {
      message.error(intl.formatMessage({ id: 'IDS_TEXT_EMPTY_NOTE_ERROR' }));
    } else {
      try {
        setLoading(true);
        const { data } = await createFlightBookingNote({
          bookingId: params?.id || null,
          content: content?.trim() || null,
          module: 'hotel',
          type: 'note',
        });
        if (data.code === SUCCESS_CODE) {
          setNoteContent('');
          fetNoteList();
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

  React.useEffect(() => {
    fetNoteList();
  }, []);

  return (
    <>
      <div className='hotel-note-content'>
        <Tooltip title={intl.formatMessage({ id: 'IDS_TEXT_UPLOAD_IMAGE' })} placement='bottom'>
          <Button
            type='primary'
            className='hotel-note-icon-button'
            onClick={() => document?.getElementById('upload_note_file')?.click()}
            loading={upFileLoading}
            icon={<IconImageUpload className='hotel-note-icon' />}
          />
        </Tooltip>
        <input
          type='file'
          style={{ display: 'none' }}
          id='upload_note_file'
          onChange={handleUploadFile}
        />
        <Input
          value={noteContent || ''}
          placeholder={intl.formatMessage({ id: 'IDS_TEXT_NOTE_ENTER' })}
          className='hotel-note-input'
          bordered={false}
          suffix={
            <Button
              type='primary'
              className='hotel-note-send-btn'
              icon={<IconSend className='hotel-note-send-icon' />}
              onClick={() => handleCreateNote(noteContent)}
              loading={loading}
            />
          }
          onChange={(e) => setNoteContent(e.target.value)}
          onPressEnter={(e) => handleCreateNote(noteContent)}
          maxLength={1000}
        />
        <div className='hotel-note-history'>
          <div className='hotel-note-title'>
            <Typography.Title level={4}>
              <FormattedMessage id='IDS_TEXT_NOTE_HISTORY' />
            </Typography.Title>
            <Button
              type='ghost'
              className='hotel-note-update-btn-text'
              onClick={() => fetNoteList()}
              loading={loadingNoteList}
            >
              <FormattedMessage id='IDS_TEXT_UPDATE' />
            </Button>
          </div>
          {!isEmpty(noteList) ? (
            <>
              <Divider style={{ margin: '12px 0px' }} />
              <div className='hotel-note-history-content'>
                {noteList?.map((item: some, index: number) => {
                  return (
                    <div key={index} className='hotel-note-history-item'>
                      <Typography.Text>{item?.content || item?.action}</Typography.Text>
                      <div className='hotel-note-title'>
                        <Typography.Text style={{ fontSize: 12 }} type='secondary'>
                          {item?.saleInfo?.name || <FormattedMessage id='IDS_TEXT_SYSTEM' />}
                        </Typography.Text>
                        <Typography.Text style={{ fontSize: 12 }} type='secondary'>
                          {item?.createdTime || item?.time}
                        </Typography.Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ height: 400 }}>
              <DataEmpty />
            </div>
          )}
        </div>
      </div>
      <div className='hotel-note-image-preview'>
        <div className='hotel-note-title'>
          <Typography.Title level={4}>
            <FormattedMessage id='IDS_TEXT_IMAGE' />
          </Typography.Title>
          {!isEmpty(hotelDetail?.photos) && (
            <Button
              type='ghost'
              className='hotel-note-update-btn-text'
              onClick={() => setModal({ open: true, startIndex: 0 })}
            >
              <FormattedMessage id='IDS_TEXT_VIEW_ALL' />
              {<>&nbsp;({hotelDetail?.photos?.length})</>}
            </Button>
          )}
        </div>
        <Row>
          {!isEmpty(hotelDetail?.photos) ? (
            <>
              {hotelDetail?.photos
                ?.filter((_: some, index: number) => index <= 3)
                ?.map((item: some, index: number) => {
                  return (
                    <Col span={6} key={index} style={{ paddingRight: 8 }}>
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          padding: 0,
                          position: 'relative',
                          cursor: 'pointer',
                        }}
                      >
                        <img
                          width='100%'
                          height='100%'
                          style={{ maxHeight: 85, objectFit: 'cover' }}
                          src={item?.url}
                          alt=''
                          onClick={() => setModal({ startIndex: index, open: true })}
                        />
                        <span style={{ position: 'absolute', top: 0, right: 2 }}>
                          <CloseCircleOutlined
                            style={{ color: 'white' }}
                            onClick={() => handleRemoveImage(item)}
                          />
                        </span>
                      </div>
                    </Col>
                  );
                })}
            </>
          ) : (
            <div style={{ marginTop: -20, width: '100%' }}>
              <DataEmpty />
            </div>
          )}
        </Row>
      </div>
      <ImagePreviewModal
        imageList={hotelDetail?.photos}
        open={modal.open}
        onClose={() => setModal({ startIndex: 0, open: false })}
        startIndex={modal.startIndex}
      />
    </>
  );
};

export default NoteHotel;
