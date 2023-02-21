import { Pagination } from 'antd';
import '~/components/pagination/Pagination.scss';
import { some } from '~/utils/constants/constant';

const PaginationTable = (props: some) => {
  const { totalElements, onChange, page, size, isDisabled } = props;
  return (
    <div className='pagination-table'>
      <Pagination
        current={page + 1}
        pageSize={size}
        total={totalElements || 0}
        showSizeChanger
        onShowSizeChange={onChange}
        onChange={onChange}
        disabled={isDisabled}
        pageSizeOptions={['10', '20', '50']}
      />
    </div>
  );
};

export default PaginationTable;
