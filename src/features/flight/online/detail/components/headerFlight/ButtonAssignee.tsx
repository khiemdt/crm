import { Button, Input, message, Popover } from 'antd';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { assignBooking } from '~/apis/flight';
import { IconChecked, IconUserLarge } from '~/assets';
import { SIZE_SECTION_ASSIGNEE } from '~/features/flight/constant';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

interface Props {
  icon?: any;
  typeBooking: string;
  idBooking: number;
}

interface SalesData {
  sale: any;
  items?: some[];
  itemsShow: some[];
  itemsSearch: any;
}

const ButtonAssignee: React.FC<Props> = ({ icon, idBooking, typeBooking }) => {
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const salesListDf: some[] = useAppSelector((state) => state.flightReducer.salesList);
  const showSalesList = salesListDf.filter(
    (val: some, index: number) => index <= SIZE_SECTION_ASSIGNEE,
  );
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [visible, setVisible] = useState(false);
  const [salesList, setSalesList] = useState<SalesData>({
    sale: null,
    items: salesListDf,
    itemsShow: showSalesList,
    itemsSearch: null,
  });

  const salesItems = salesList?.itemsSearch ?? salesList?.itemsShow;

  const fetAssignBooking = async (queryParams = {}) => {
    try {
      const { data } = await assignBooking(queryParams);
      if (data.code === 200) {
        message.success(
          `${intl.formatMessage(
            { id: 'IDS_TEXT_HANDED_OVER_TO' },
            { value: salesList?.sale?.name },
          )}`,
        );
        setVisible(false);
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking?.id } }));
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  const searchNameEmailField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueSearch = event.target.value?.toUpperCase();
    if (valueSearch) {
      const dataSearchField = salesList?.items?.filter(
        (val: some, index: number) => val?.name?.toUpperCase().search(valueSearch) !== -1,
      );
      setSalesList({ ...salesList, itemsSearch: dataSearchField });
    } else {
      setSalesList({ ...salesList, itemsSearch: null });
    }
  };

  const handleSelectSales = (salesItem: some) => {
    setSalesList({ ...salesList, sale: salesItem });
  };

  const handleSave = () => {
    if (salesList?.sale) {
      fetAssignBooking({
        bookingId: idBooking,
        bookingType: typeBooking,
        saleId: salesList?.sale?.id,
      });
    }
  };

  const handleCancel = () => {
    setSalesList({ ...salesList, sale: null, itemsSearch: null });
    setVisible(false);
  };

  return (
    <Popover
      content={
        <div className='form-assignee'>
          <div className='warper-form-assignee'>
            <Input
              placeholder={intl.formatMessage({ id: 'IDS_TEXT_SEARCH_NAME_EMAIL' })}
              onChange={searchNameEmailField}
            />
            <div className='warper-assignee-button'>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button
                type={salesList?.sale ? 'primary' : 'default'}
                disabled={!salesList?.sale}
                onClick={handleSave}
              >
                Lưu
              </Button>
            </div>
          </div>
          <div className='assignee-list-items'>
            {salesItems?.map((val: some, index: number) => {
              return (
                <div
                  key={`${val?.id}_${index}`}
                  className={`assignee-item ${val?.id === salesList?.sale?.id && 'active'}`}
                  onClick={() => handleSelectSales(val)}
                >
                  <span>{val?.name}</span>
                  <IconChecked />
                </div>
              );
            })}
          </div>
        </div>
      }
      trigger='click'
      visible={visible}
      placement='bottomLeft'
      onVisibleChange={handleVisibleChange}
    >
      <Button>
        {icon ?? <IconUserLarge />}
        <FormattedMessage id='IDS_TEXT_SEND_ASSIGNEE' />
      </Button>
    </Popover>
  );
};

export default ButtonAssignee;
