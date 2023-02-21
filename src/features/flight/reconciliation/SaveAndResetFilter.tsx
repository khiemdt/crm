import { Button, Form, message } from 'antd';
import { IconReset } from '~/assets/index';
import { isEmpty, removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { LAST_FILTERS_FLIGHT_ONLINE } from '~/utils/constants/constant';
import { createSearchParams, useNavigate } from 'react-router-dom';

const SaveAndResetFilter = (props: any) => {
  const { fetFlightBookings } = props;
  const form = Form.useFormInstance();
  const filedAdds: string[] = Form.useWatch('filedAdds', form);
  const navigate = useNavigate();

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
    });
    const formData = {
      ...form.getFieldsValue(true),
      ...listFiled,
    };
    handleChangeRoute(formData);
    fetFlightBookings(formData, true);
  };

  const handleChangeRoute = (formData: object) => {
    const searchParams = removeFieldEmptyFilter(formData);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...searchParams,
      }).toString(),
    });
  };

  const handleSaveFilter = () => {
    localStorage.setItem(LAST_FILTERS_FLIGHT_ONLINE, JSON.stringify(filedAdds));
    message.success('Lưu bộ lọc thành công!');
  };

  return (
    <>
      <Button className='btn-download-report' onClick={handleSaveFilter}>
        Lưu bộ lọc
      </Button>
      {!isEmpty(filedAdds) && (
        <Button className='btn-download-clear' icon={<IconReset />} onClick={handleResetFilter} />
      )}
    </>
  );
};

export default SaveAndResetFilter;
