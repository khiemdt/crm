import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Input, message, Row, Tabs, Tooltip, Typography } from 'antd';
import moment from 'moment';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import {
  actionFlightBookingNoteImages,
  createFlightBookingNote,
  deleteFlightBookingNoteImages,
  getBookingWorkLogs,
  getFlightBookingNote,
} from '~/apis/flight';
import { uploadImagePublic } from '~/apis/system';
import { IconImageUpload, IconRefesh, IconSend } from '~/assets';
import DataEmpty from '~/components/dataEmpty/DataEmpty';
import { SUCCESS_CODE } from '~/features/flight/constant';
import '~/features/flight/online/detail/FlightDetail.scss';
import { some } from '~/utils/constants/constant';
import { DATE_TIME_FORMAT } from '~/utils/constants/moment';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
import ImagePreviewModal from '../ImagePreviewModal';
import WorkLogDetailModal from '../WorkLogDetailModal';

interface INoteFlightProps {}

const typeModal = { workLog: 'WORK_LOGS' };

const NoteFlight: React.FunctionComponent<INoteFlightProps> = (props) => {
  const intl = useIntl();
  const params = useParams();
  const bookingDetail = useAppSelector((state) => state.flightReducer.flightOnlineDetail);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [upFileLoading, setUpfileLoading] = React.useState<boolean>(false);
  const [loadingNoteList, setLoadingNoteList] = React.useState<boolean>(false);
  const [noteContent, setNoteContent] = React.useState<string | null>(null);
  const [noteList, setNoteList] = React.useState<some[]>([]);
  const [imageList, setImageList] = React.useState<some>({});
  const [modal, setModal] = React.useState<some>({});
  const [modalAction, setModalAction] = React.useState<some>({});
  const [noteRemarkList, setNoteRemarkList] = React.useState<some[]>([]);

  const fetNoteImages = async () => {
    try {
      const { data } = await actionFlightBookingNoteImages('get', {
        bookingId: params?.id || null,
        module: 'flight',
        function: 'remark',
      });
      if (data.code === SUCCESS_CODE) {
        setImageList({ items: data?.data?.reverse() });
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
    }
  };

  const handleSaveImage = async (url: string) => {
    try {
      const { data } = await actionFlightBookingNoteImages('post', {
        bookingId: params?.id || null,
        module: 'flight',
        function: 'remark',
        contentType: 'image/jpeg',
        link: url,
      });
      if (data.code === SUCCESS_CODE) {
        message.success(`${intl.formatMessage({ id: 'IDS_TEXT_SUCCESS' })}`);
        fetNoteImages();
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
    }
  };

  const handleRemoveImage = async (item: some) => {
    try {
      const { data } = await deleteFlightBookingNoteImages(item?.id);
      if (data.code === SUCCESS_CODE) {
        message.success(`${intl.formatMessage({ id: 'IDS_TEXT_SUCCESS' })}`);
        setModal({ startIndex: 0, open: false });
        fetNoteImages();
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
    }
  };

  const fetNoteList = async () => {
    try {
      setLoadingNoteList(true);
      const [note, workLogs]: some[] = await Promise.all([
        getFlightBookingNote({
          bookingId: params?.id || null,
          module: 'flight',
        }),
        getBookingWorkLogs({
          bookingId: params?.id || null,
          module: 'flight',
        }),
      ]);
      let dataSet: some[] = [];
      let dataRemarkList: some[] = [];
      if (note?.data?.code === SUCCESS_CODE) {
        dataRemarkList = note?.data?.data?.remarkList;
      }
      if (workLogs?.data?.code === SUCCESS_CODE) {
        dataSet = [...dataSet, ...workLogs?.data?.data];
      }
      if (bookingDetail?.saleNote) {
        dataSet = [{ content: bookingDetail?.saleNote }, ...dataSet];
      }

      setNoteList(
        dataSet
          .map((el) => ({
            ...el,
            time: !isEmpty(el.time)
              ? moment(el.time, DATE_TIME_FORMAT).unix()
              : moment(el.createdTime, DATE_TIME_FORMAT).unix(),
            timeString: el.time || el.createdTime,
          }))
          .sort((a, b) => b.time - a.time),
      );
      setNoteRemarkList(
        dataRemarkList
          .map((el) => ({
            ...el,
            time: !isEmpty(el.time)
              ? moment(el.time, DATE_TIME_FORMAT).unix()
              : moment(el.createdTime, DATE_TIME_FORMAT).unix(),
            timeString: el.time || el.createdTime,
          }))
          .sort((a, b) => b.time - a.time),
      );
    } catch (error) {
    } finally {
      setLoadingNoteList(false);
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
          module: 'flight',
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
          const dataUpload = await uploadImagePublic(formData);
          if (dataUpload.data.code === SUCCESS_CODE) {
            handleSaveImage(dataUpload.data.photo.link);
            // message.success(dataUpload?.data?.message);
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

  React.useEffect(() => {
    fetNoteList();
    fetNoteImages();
  }, []);

  return (
    <>
      <div className='fl-note-content'>
        <Tooltip title={intl.formatMessage({ id: 'IDS_TEXT_UPLOAD_IMAGE' })} placement='bottom'>
          <Button
            type='primary'
            className='fl-note-icon-button'
            onClick={() => document?.getElementById('upload_note_file')?.click()}
            loading={upFileLoading}
            icon={<IconImageUpload className='fl-note-icon' />}
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
          className='fl-note-input'
          bordered={false}
          suffix={
            <Button
              type='primary'
              className='fl-note-send-btn'
              icon={<IconSend className='fl-note-send-icon' />}
              onClick={() => handleCreateNote(noteContent)}
              loading={loading}
            />
          }
          onChange={(e) => setNoteContent(e.target.value)}
          onPressEnter={(e) => handleCreateNote(noteContent)}
          maxLength={1000}
        />
        <div className='fl-note-history'>
          {/* <div className='fl-note-title'>
            <Typography.Title level={4}>
              <FormattedMessage id='IDS_TEXT_NOTE_HISTORY' />
            </Typography.Title>
            <Button
              type='ghost'
              className='fl-note-update-btn-text'
              onClick={() => fetNoteList()}
              loading={loadingNoteList}
            >
              <FormattedMessage id='IDS_TEXT_UPDATE' />
            </Button>
          </div> */}
          <Tabs
            defaultActiveKey='1'
            onChange={() => {}}
            tabBarExtraContent={
              <IconRefesh
                style={{ cursor: 'pointer', marginBottom: '5px' }}
                onClick={() => fetNoteList()}
              />
            }
            type='line'
            className='tabs-notes-history'
          >
            <Tabs.TabPane tab={<p>Ghi chú</p>} key='1'>
              {!isEmpty(noteRemarkList) ? (
                <>
                  <div className='fl-note-history-content-empty'>
                    {noteRemarkList?.map((item: some, index: number) => {
                      return (
                        <div
                          key={index}
                          style={{ backgroundColor: index % 2 ? '#f7f9fa' : '#FFF' }}
                          className='fl-note-history-item'
                        >
                          {item.afterChange ? (
                            <Typography.Text>
                              <span
                                onClick={() =>
                                  setModalAction({
                                    type: typeModal.workLog,
                                    data: item,
                                  })
                                }
                                className='text-blue pointer'
                                style={{ cursor: 'pointer' }}
                              >
                                {item?.content || item?.action}
                              </span>
                            </Typography.Text>
                          ) : (
                            <Typography.Text>{item?.content || item?.action}</Typography.Text>
                          )}
                          <div className='fl-note-title'>
                            <Typography.Text style={{ fontSize: 12 }} type='secondary'>
                              {item?.saleInfo?.name || <FormattedMessage id='IDS_TEXT_SYSTEM' />}
                            </Typography.Text>
                            <Typography.Text style={{ fontSize: 12 }} type='secondary'>
                              {item?.timeString}
                            </Typography.Text>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div>
                  <DataEmpty />
                </div>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab={<p>Hệ thống</p>} key='2'>
              {!isEmpty(noteList) ? (
                <>
                  <div className='fl-note-history-content-empty'>
                    {noteList?.map((item: some, index: number) => {
                      return (
                        <div
                          key={index}
                          style={{ backgroundColor: index % 2 ? '#f7f9fa' : '#FFF' }}
                          className='fl-note-history-item'
                        >
                          {item.afterChange ? (
                            <Typography.Text>
                              <span
                                onClick={() =>
                                  setModalAction({
                                    type: typeModal.workLog,
                                    data: item,
                                  })
                                }
                                className='text-blue pointer'
                                style={{ cursor: 'pointer' }}
                              >
                                {item?.content || item?.action}
                              </span>
                            </Typography.Text>
                          ) : (
                            <Typography.Text>{item?.content || item?.action}</Typography.Text>
                          )}
                          <div className='fl-note-title'>
                            <Typography.Text style={{ fontSize: 12 }} type='secondary'>
                              {item?.saleInfo?.name || <FormattedMessage id='IDS_TEXT_SYSTEM' />}
                            </Typography.Text>
                            <Typography.Text style={{ fontSize: 12 }} type='secondary'>
                              {item?.timeString}
                            </Typography.Text>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div>
                  <DataEmpty />
                </div>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab={<p>Ảnh</p>} key='3'>
              {!isEmpty(imageList?.items) ? (
                <div className='fl-note-image-preview'>
                  {/* <div className='fl-note-title'>
                    <Typography.Title level={4}>
                      <FormattedMessage id='IDS_TEXT_IMAGE' />
                    </Typography.Title>

                    <Button
                      type='ghost'
                      className='fl-note-update-btn-text'
                      onClick={() => setModal({ open: true, startIndex: 0 })}
                    >
                      <FormattedMessage id='IDS_TEXT_VIEW_ALL' />
                      {<>&nbsp;({imageList?.items?.length})</>}
                    </Button>
                  </div> */}
                  <Row>
                    {!isEmpty(imageList?.items) && (
                      <>
                        {imageList?.items
                          ?.filter((_: some, index: number) => index <= 3)
                          ?.map((item: some, index: number) => {
                            return (
                              <Col span={12} key={index} style={{ paddingRight: 8 }}>
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
                                    src={item?.link}
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
                    )}
                  </Row>
                </div>
              ) : (
                <div>
                  <DataEmpty />
                </div>
              )}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
      <ImagePreviewModal
        imageList={imageList?.items}
        open={modal.open}
        onClose={() => setModal({ startIndex: 0, open: false })}
        startIndex={modal.startIndex}
      />
      <WorkLogDetailModal
        type={modalAction.type}
        onClose={() => setModalAction({ data: null, type: null })}
        data={modalAction.data}
      />
    </>
  );
};

export default NoteFlight;
