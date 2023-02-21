import { FC, useEffect, useState } from 'react';
import { Button, Row, Col, Select, message, Typography } from 'antd';
import { RetweetOutlined } from '@ant-design/icons';
import './Reconciliation.scss';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import ConfirmCancelErrorModal from './ConfirmCancelErrorModal';
import { getErrorTagsHandling } from '~/apis/flight';
import { useAppSelector } from '~/utils/hook/redux';
import { routes, some } from '~/utils/constants/constant';
import { UserInfo } from '~/components/Layout/LeftSideBar';

type Props = {
  reconcilation: some;
  handleFetchPO: any;
};
const modalTypes = {
  COMFIRM_ERROR: 'COMFIRM_ERROR',
  REJECT_ERROR: 'REJECT_ERROR',
  EDIT_ERROR: 'EDIT_ERROR',
};
let force = false;
const InfoError: FC<Props> = (props) => {
  const { reconcilation = {}, handleFetchPO } = props;
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const salesList: some[] = useAppSelector((state) => state.flightReducer.salesList);
  const [userIdSelect, setUserIdSelect] = useState(null);
  const [modal, setModal] = useState({
    type: '',
    item: {},
  });

  const handlingError = async (dataDto = {}) => {
    try {
      const { data } = await getErrorTagsHandling(dataDto);
      if (data.code === 200) {
        handleFetchPO();
        if (force) {
          message.success('Nhận xử lý thành công');
        } else {
          message.success('Bàn giao xử lý thành công');
        }
      } else {
        message.error(data.message);
      }
    } catch (error) {}
  };

  const handleReconcile = async (id: any, force: boolean) => {
    handlingError({
      force,
      reconcileErrorTagIds: [reconcilation.id],
      userId: id,
      userName: salesList.find((el: some) => el.id === id)?.name || '',
    });
  };

  const handleUpdateStatus = (type: any) => {
    setModal({
      type,
      item: reconcilation,
    });
  };

  useEffect(() => {
    setUserIdSelect(reconcilation.handlingUserId);
  }, [reconcilation]);

  const onChange = (value: any) => {
    setUserIdSelect(value);
  };
  return (
    <div className='rec-info'>
      <div className='head-status'>
        <div className='left-head'>
          <span className='name-rec'>{`Chi tiết đối soát ${reconcilation?.id}`}</span>
          <Button icon={<RetweetOutlined />} type='link' size='small' onClick={handleFetchPO}>
            Refresh
          </Button>
        </div>
        <div className='left-head'>
          {reconcilation.status === 'INIT' && (
            <>
              {/* <Button danger onClick={() => handleUpdateStatus(modalTypes.REJECT_ERROR)}>
                Từ chối lỗi
              </Button> */}
              <Button
                type='primary'
                style={{ marginLeft: 16 }}
                onClick={() => handleUpdateStatus(modalTypes.COMFIRM_ERROR)}
              >
                Xác nhận lỗi
              </Button>
            </>
          )}
        </div>
      </div>
      <Row gutter={24}>
        <Col span={8}>
          <Row>
            <Col span={8} className='label-rec-info'>
              Kỳ đối soát
            </Col>
            <Col span={16}>{reconcilation.reconcileDate}</Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Kênh bán
            </Col>
            <Col span={16}>{reconcilation.caName}</Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Mã đơn hàng
            </Col>
            <Col span={16} style={{ color: '#0044A5' }}>
              {/* {reconcilation.bookingIds?.join(", ")} */}
              {reconcilation?.bookingIds?.map((el: any, idx: number) => (
                // <div style={{ color: "#1DA57A" }}>{`F${el}`}</div>
                <>
                  <Typography.Link
                    href={`/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_ONLINE}/${el}`}
                    target='_blank'
                  >
                    {el}
                  </Typography.Link>
                  {idx !== reconcilation?.bookingIds?.length - 1 && (
                    <span style={{ paddingRight: 4 }}>,</span>
                  )}
                </>
              ))}
            </Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Trạng thái xử lý
            </Col>
            <Col span={16}>{reconcilation.statusText}</Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row>
            <Col span={8} className='label-rec-info'>
              Mã PNR
            </Col>
            <Col span={16}>{reconcilation.pnr}</Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Bộ phận xử lý
            </Col>
            <Col span={16}>{reconcilation.department}</Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Phân loại lỗi
            </Col>
            <Col span={16}>{reconcilation.errorTagsName}</Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Người xử lý
            </Col>
            <Col span={16}>
              <Select
                onChange={onChange}
                showSearch
                value={userIdSelect}
                placeholder='Chọn người xử lý'
                style={{ width: '100%' }}
                optionFilterProp='children'
                filterOption={(input: any, option: any) =>
                  (option?.children ?? '')?.toLowerCase()?.includes(input.toLowerCase())
                }
              >
                {salesList?.map((item: any) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
              <div className='left-head' style={{ marginTop: 8 }}>
                <Button
                  type='primary'
                  ghost
                  onClick={() => {
                    force = true;
                    handleReconcile(userInfo.id, true);
                  }}
                  disabled={userInfo.id === reconcilation.handlingUserId}
                >
                  Nhận xử lý
                </Button>
                <Button
                  type='primary'
                  ghost
                  style={{
                    marginLeft: 16,
                  }}
                  disabled={isEmpty(userIdSelect)}
                  onClick={() => {
                    force = false;
                    handleReconcile(userIdSelect, true);
                  }}
                >
                  Bàn giao lại
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row>
            <Col span={8} className='label-rec-info'>
              Giá Vntravel
            </Col>
            <Col span={16}>
              <div>{formatMoney(reconcilation.vntTotalAmount)}</div>
            </Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Giá hãng
            </Col>
            <Col span={16}>
              <div>{formatMoney(reconcilation.providerTotalAmount)}</div>
            </Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Chênh lệch
            </Col>
            <Col span={16}>
              <div>{formatMoney(reconcilation.differentAmount)}</div>
            </Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Ghi nhận chênh lệch
            </Col>
            <Col span={16}>
              <div>{formatMoney(reconcilation.confirmDifferentAmount)}</div>
            </Col>
          </Row>
          <Row>
            <Col span={8} className='label-rec-info'>
              Phân loại chênh lệch
            </Col>
            <Col span={16}>
              <div>{reconcilation.solutionName}</div>
            </Col>
          </Row>
        </Col>
      </Row>
      <ConfirmCancelErrorModal
        modal={modal}
        setModal={setModal}
        modalTypes={modalTypes}
        handleSuccessAction={handleFetchPO}
      />
    </div>
  );
};

export default InfoError;
