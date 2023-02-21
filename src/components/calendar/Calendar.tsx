import { isEmpty, getMonthDifference } from '~/utils/helpers/helpers';
import moment, { Moment } from 'moment';
import { useState } from 'react';
import '~/components/calendar/Calendar.scss';
import { IconArrow } from '~/assets';

const GREY_400 = '#BDBDBD';
const WHITE = '#ffffff';
const DATE_FORMAT_BACK_END = 'DD-MM-YYYY';

const CalendarHome = (props: any) => {
  const { startDate, endDate, setStartDate, setEndDate } = props;
  const monthDifference = getMonthDifference(moment(), startDate);

  const [monthStart, setMonthStart] = useState(monthDifference);
  const [hoverDate, setHoverDate] = useState<Moment | null>(null);

  const isOutsideRange = (date: any) => {
    // return date.isBefore(moment(), 'days') || date.isSameOrAfter(moment().add(1, 'year'), 'days');
    return false;
  };

  const handleSelectDate = (day: any) => {
    if (startDate && endDate && !startDate.isSame(endDate, 'days')) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate) {
      if (day.isBefore(startDate, 'days')) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    } else if (endDate) {
      if (day.isBefore(endDate, 'days')) {
        setStartDate(day);
      } else {
        setStartDate(startDate);
        setEndDate(day);
      }
    } else {
      setStartDate(day);
      // setEndDate(day);
    }
  };
  const getColorDay = (day: any, isEdge: boolean) => {
    if (isOutsideRange(day)) return GREY_400;
    if (day.isSame(moment(), 'days')) return isEdge ? 'white' : '#007864';
    return undefined;
  };
  const clearHoverDate = (e: any) => {
    if (hoverDate) setHoverDate(null);
    e.preventDefault();
    e.stopPropagation();
  };

  const getBlank = (key: number) => {
    return (
      <td
        className='td-customer'
        // isFocus={false}
        // hover={false}
        key={`blank${key}`}
        onMouseOver={clearHoverDate}
      />
    );
  };

  const renderCalendar = (m: any, iMonth: any) => {
    const totalCells = [];
    let week: any[] = [];
    const allWeeks: any[] = [];
    const firstDayOfMonth = m.startOf('month');
    for (let d: number = firstDayOfMonth.day() === 0 ? -6 : 1; d < firstDayOfMonth.day(); d += 1) {
      totalCells.push(getBlank(d));
    }
    for (let d = 0; d < m.daysInMonth(); d += 1) {
      const day = m.clone().add(d, 'days');

      const isDaySameStartDate = startDate && day.isSame(startDate, 'days');
      const isDaySameEndDate = endDate && day.isSame(endDate, 'days');
      const isDaySameHoverDate = hoverDate && day.isSame(hoverDate, 'days');
      const isSelected =
        startDate &&
        day.isSameOrAfter(startDate, 'days') &&
        ((endDate && day.isSameOrBefore(endDate, 'days')) ||
          (hoverDate && day.isSameOrBefore(hoverDate, 'days')));
      const isEdge = isDaySameStartDate || isDaySameEndDate || isDaySameHoverDate;

      let cellBG = WHITE;
      let cellClass = '';
      if (isSelected) cellBG = '#ebf8f5';
      if (isEdge) cellBG = '#007864';
      if (startDate && !isOutsideRange(day)) {
        if (day.isBefore(startDate, 'days')) cellClass = 'normal-date-home';
      }
      if (endDate && day.isAfter(endDate, 'days') && !isOutsideRange(day)) {
        cellClass = 'normal-date-home';
      }
      totalCells.push(
        <td
          className='td-customer'
          draggable={false}
          key={`day_${day.format(DATE_FORMAT_BACK_END)}`}
          style={{
            backgroundColor: cellBG,
            color: isEdge ? 'white' : '#0B0C0D',
            borderTopLeftRadius: isDaySameStartDate ? 8 : 0,
            borderBottomLeftRadius: isDaySameStartDate ? 8 : 0,
            borderTopRightRadius: isDaySameEndDate || isDaySameHoverDate ? 8 : 0,
            borderBottomRightRadius: isDaySameEndDate || isDaySameHoverDate ? 8 : 0,
            cursor: isOutsideRange(day) ? 'not-allowed' : 'pointer',
          }}
          onClick={() => {
            if (isOutsideRange(day)) return;
            handleSelectDate(day);
          }}
          onMouseOver={(e) => {
            if (
              startDate &&
              isEmpty(endDate) &&
              day.isAfter(startDate, 'days') &&
              !isOutsideRange(day) &&
              (isEmpty(hoverDate) || (hoverDate && !hoverDate.isSame(day, 'days')))
            ) {
              setHoverDate(day);
            }
            if (hoverDate && !hoverDate.isSame(day, 'days') && day.isBefore(startDate, 'days')) {
              setHoverDate(null);
            }
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            className={cellClass}
            style={{
              height: '100%',
              padding: '4px 0',
              justifyContent: 'center',
              flexDirection: 'column',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <p
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: 14,
                lineHeight: '17px',
                fontWeight: 400,
                marginBottom: 0,
                color: day.isBefore(moment(), 'month') ? '#D9DBDC' : getColorDay(day, isEdge),
              }}
            >
              {d + 1}
            </p>
          </div>
        </td>,
      );
    }
    for (let d = 1; d <= (7 - ((m.daysInMonth() + firstDayOfMonth.day()) % 7)) % 7; d += 1) {
      totalCells.push(getBlank(d + firstDayOfMonth.day()));
    }

    totalCells.forEach((day, index) => {
      if (index % 7 !== 0) {
        week.push(day);
      } else {
        allWeeks.push(week);
        week = [];
        week.push(day);
      }
      if (index === totalCells.length - 1) {
        allWeeks.push(week);
      }
    });
    return (
      <table
        style={{ borderSpacing: '0 4px', width: '100%', borderCollapse: 'separate' }}
        draggable={false}
      >
        <thead>
          <tr>
            <td colSpan={7}>
              <div
                style={{
                  display: 'flex',
                  padding: '0 0 10px 0',
                  alignItems: 'center',
                }}
              >
                {iMonth === 0 && (
                  <IconArrow
                    style={{
                      marginLeft: 12,
                      transform: 'rotate(180deg)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setMonthStart(monthStart - 1)}
                  />
                )}
                <h6
                  style={{
                    userSelect: 'none',
                    fontSize: 16,
                    lineHeight: '19px',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {`Tháng ${m.format('MM/YYYY')}`}
                </h6>
                {iMonth === 1 && (
                  <IconArrow
                    style={{
                      marginRight: 12,
                      cursor: 'pointer',
                    }}
                    onClick={() => setMonthStart(monthStart + 1)}
                  />
                )}
              </div>
            </td>
          </tr>
        </thead>
        <thead>
          <tr onMouseOver={clearHoverDate} onFocus={clearHoverDate}>
            <td className='header-style header-style-first'>Th2</td>
            <td className='header-style'>Th3</td>
            <td className='header-style'>Th4</td>
            <td className='header-style'>Th5</td>
            <td className='header-style'>Th6</td>
            <td className='header-style'>Th7</td>
            <td className='header-style header-style-last'>CN</td>
          </tr>
        </thead>
        <tbody style={{}}>
          {allWeeks.map((w, i) => {
            return <tr key={`week${i} `}>{w}</tr>;
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        width: 'calc(100% + 24px)',
        justifyContent: 'space-between',
        margin: '0 -12px',
      }}
      onMouseOver={clearHoverDate}
      onFocus={clearHoverDate}
    >
      {[monthStart, monthStart + 1].map((v, index) => {
        return (
          <div key={index} style={{ width: '100%', margin: '0 12px' }}>
            {renderCalendar(moment().add(v, 'months').startOf('month'), index)}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarHome;
