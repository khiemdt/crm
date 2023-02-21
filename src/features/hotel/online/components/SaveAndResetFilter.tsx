import { Button, Form, message } from 'antd';
import { useIntl } from 'react-intl';
import { IconReset } from '~/assets';
import { isEmpty, removeFieldEmptyFilterHotel } from '~/utils/helpers/helpers';
import { useAppDispatch } from '~/utils/hook/redux';
import { fetHotelBookings } from '~/features/hotel/hotelSlice';
import { LAST_FILTERS_HOTEL_ONLINE } from '~/utils/constants/constant';
import { createSearchParams, useNavigate } from 'react-router-dom';

const SaveAndResetFilter = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = Form.useFormInstance();
  const filedAdds: string[] = Form.useWatch('filedAdds', form);

  const handleResetFilter = () => {
    let listFiled = {};
    filedAdds.forEach((el) => {
      listFiled = {
        ...listFiled,
        [el]: undefined,
      };
    });
    form.setFieldsValue({
      filedAdds: [],
      ...listFiled,
      dealId: undefined,
      customerPhone: undefined,
      customerName: undefined,
      customerEmail: undefined,
      userId: undefined,
      caIds: [],
    });
    console.log('form.getFieldsValue(true)', form.getFieldsValue(true));
    const formData = {
      ...form.getFieldsValue(true),
      ...listFiled,
      dealId: undefined,
      customerPhone: undefined,
      customerName: undefined,
      customerEmail: undefined,
      userId: undefined,
      caIds: [],
    };
    console.log('formData', formData);
    handleChangeRoute(formData);
    dispatch(fetHotelBookings({ formData: formData, isFilter: true }));
  };

  const handleChangeRoute = (formData: object) => {
    const searchParams = removeFieldEmptyFilterHotel(formData);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...searchParams,
      }).toString(),
    });
  };

  const handleSaveFilter = () => {
    localStorage.setItem(LAST_FILTERS_HOTEL_ONLINE, JSON.stringify(filedAdds));
    message.success('Lưu bộ lọc thành công!');
  };

  return (
    <>
      <Button className='btn-download-report' onClick={handleSaveFilter}>
        {intl.formatMessage({ id: 'IDS_TEXT_SAVE_FILTER' })}
      </Button>
      {!isEmpty(filedAdds) && (
        <Button className='btn-download-clear' icon={<IconReset />} onClick={handleResetFilter} />
      )}
    </>
  );
};

export default SaveAndResetFilter;
