import React, { useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, message, Table, Checkbox, Button } from 'antd';
import { IconCloseOutline, IconCompletedImage, IconWarningImage } from '~/assets';
import { ColumnsType } from 'antd/es/table';
import { checkDividable, divideBooking } from '~/apis/flight';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { isEmpty } from '~/utils/helpers/helpers';
import { some } from '~/utils/constants/constant';
import { listAgeCategory, listGender } from '~/utils/constants/dataOptions';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const { confirm } = Modal;
const SplitCode: React.FC<Props> = ({ open, handleClose }) => {
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const [dataCode, setDataCode] = useState<some[]>([]);
  const [checkedSplitCode, setCheckedSplitCode] = useState<some>({
    bookingId: null,
    isOffline: false,
    passengerIds: [],
  });

  const isInboundBaggage = dataCode?.filter((val: some) => val?.inboundBaggage)?.length;

  const columns: ColumnsType<any> = [
    {
      title: 'Pax ID',
      dataIndex: 'id',
      render: (text) => {
        return <div className='name-table'>{text}</div>;
      },
    },
    {
      title: 'Tên',
      dataIndex: 'fullName',
      render: (text) => {
        return <div className='name-table'>{text}</div>;
      },
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      render: (text) => {
        const gender = listGender?.filter((val: some) => val?.code === text)[0].name;
        return <div className='name-table'>{gender}</div>;
      },
    },
    {
      title: 'Loại',
      dataIndex: 'ageCategory',
      render: (text) => {
        const ageCategory = listAgeCategory?.filter((val: some) => val?.code === text)[0].name;
        return <div className='name-table'>{ageCategory}</div>;
      },
    },
    {
      title: isInboundBaggage ? 'Hành lý chiều đi' : 'Hành lý',
      dataIndex: 'outboundBaggage',
      render: (text, record) => {
        const weightOutboundBaggage = record?.outboundBaggage?.weight
          ? `${record?.outboundBaggage?.weight}kg`
          : '0kg';
        return <div className='name-table'>{weightOutboundBaggage}</div>;
      },
    },
    {
      title: isInboundBaggage ? 'Hành lý chiều về' : null,
      dataIndex: 'inboundBaggage',
      key: 'inboundBaggage',
      render: (text, record) => {
        const weightInboundBaggage = record?.inboundBaggage?.weight
          ? `${record?.inboundBaggage?.weight} kg`
          : '0 kg';
        return (
          record?.inboundBaggage?.weight && <div className='name-table'>{weightInboundBaggage}</div>
        );
      },
    },
    {
      title: 'Em bé đi kèm',
      dataIndex: 'infants',
      render: (text, record) => {
        return (
          <div className='name-table'>
            {record?.infants?.map((val: some) => {
              return (
                <p className='name-baby' key={val?.id}>
                  {val?.fullName}
                </p>
              );
            })}
          </div>
        );
      },
    },
  ];

  const fetCheckDividable = async (queryParams = {}) => {
    try {
      const { data } = await checkDividable(queryParams);
      if (data.code === 200) {
        if (!isEmpty(data?.data?.passengers)) {
          setDataCode(data?.data?.passengers);
        } else {
          message.error(data?.data?.message);
        }
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showConfirm = () => {
    confirm({
      title: 'Xác nhận tách code',
      icon: <ExclamationCircleOutlined />,
      content: 'Cần kiểm tra kỹ thông tin hành khách trước khi thực hiện tách code',
      onOk() {
        fetDivideBooking(checkedSplitCode);
        console.log('OK');
      },
      onCancel() {
        console.log('Bỏ qua');
      },
      okText: 'Có',
      cancelText: 'Bỏ qua',
      wrapClassName: 'wrap-show-confirm',
    });
  };

  const showConfirmSuccess = (newBooking: some) => {
    Modal.success({
      wrapClassName: 'wrap-show-confirm-info',
      content: (
        <div className='wrap-show-confirm-content'>
          <IconCompletedImage />
          <h3>Tách code thành công</h3>
          <p>
            Đơn hàng mới{' '}
            <a
              onClick={() => {
                window.open(`/sale/flight/online/${newBooking?.id}`, '_blank');
              }}
            >
              {newBooking?.orderCode}
            </a>{' '}
            <br /> hãy kiểm tra lại đơn hàng mới để xem chi tiết kết quả
          </p>
        </div>
      ),
      onOk() {},
      okText: 'Ok',
    });
  };

  const showConfirmError = (message: string) => {
    Modal.error({
      wrapClassName: 'wrap-show-confirm-info',
      content: (
        <div className='wrap-show-confirm-content'>
          <IconWarningImage />
          <h3>Tách code thất bại</h3>
          <p>{message}</p>
        </div>
      ),
      onOk() {},
      okText: 'Ok',
    });
  };

  const fetDivideBooking = async (query = {}) => {
    try {
      const { data } = await divideBooking(query);
      if (data.code === 200) {
        showConfirmSuccess(data?.data?.booking);
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking?.id } }));
        handleClose();
      } else {
        showConfirmError(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSplitCode = () => {
    showConfirm();
  };

  useEffect(() => {
    if (open) {
      fetCheckDividable({ id: booking?.id });
    } else {
      setCheckedSplitCode({
        bookingId: null,
        isOffline: false,
        passengerIds: [],
      });
      setDataCode([]);
    }
  }, [open]);

  return (
    <Modal
      className='wrapper-modal-split-code'
      title={<div className='title-modal'>Tách code đơn hàng {booking?.orderCode}</div>}
      visible={open && !isEmpty(dataCode)}
      footer={false}
      closeIcon={<IconCloseOutline />}
      onCancel={handleClose}
      width={950}
    >
      <Table
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys: checkedSplitCode?.passengerIds,
          onChange: (selectedRowKeys: React.Key[], selectedRows: some[]) => {
            const arraySelectedRows = selectedRows?.map((val) => val?.id);
            setCheckedSplitCode({
              ...checkedSplitCode,
              bookingId: booking?.id,
              passengerIds: arraySelectedRows,
            });
          },
        }}
        className='table-split-code'
        pagination={false}
        columns={columns}
        dataSource={dataCode}
      />
      <div className='footer-table-split-code'>
        <div className='field-checkbox-split-code'>
          <Checkbox
            checked={checkedSplitCode?.isOffline}
            onChange={(e) => {
              setCheckedSplitCode({ ...checkedSplitCode, isOffline: e.target.checked });
            }}
          >
            Tách offline
          </Checkbox>
        </div>
        <div className='button-split-code'>
          <Button onClick={handleClose}>Bỏ qua</Button>
          <Button
            disabled={!checkedSplitCode?.passengerIds?.length}
            type='primary'
            onClick={handleSplitCode}
          >
            Tách ({checkedSplitCode?.passengerIds?.length})
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SplitCode;
