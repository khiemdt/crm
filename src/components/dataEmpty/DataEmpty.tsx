import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { IconDataEmpty } from '~/assets';

interface IDataEmptyProps {
  title?: string;
}

const DataEmpty: React.FunctionComponent<IDataEmptyProps> = ({ title }) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <IconDataEmpty />
      <FormattedMessage id={title || 'IDS_TEXT_EMPTY_DATA'} />
    </div>
  );
};

export default DataEmpty;
