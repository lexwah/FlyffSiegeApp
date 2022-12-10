import React from 'react';
import dayjs from 'dayjs';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import './style.css';
import logo from '../../assets/flyfflogo.png';
import SelectMenu, { DropdownOption } from '../../components/SelectMenu/SelectMenu';
import { FlyffServer, labelForServer, Siege } from '../../util/util';
import SiegeListItem from '../../components/SiegeListItem/SiegeListItem';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import DirectorySidebar from '../Sidebar/DirectorySidebar';
import { getSieges } from '../../api';
import Button from '../../components/Button/Button';
import { alert } from '../../components/ConfirmDialog/ConfirmDialog';

const options: DropdownOption[] = Object.values(FlyffServer).map((server) => ({ value: server, label: labelForServer(server) }));

const Directory = (): React.ReactElement => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [sieges, setSieges] = React.useState<Siege[]>([]);
  const [selectedServer, setSelectedServer] = React.useState<DropdownOption>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await getSieges({ server: selectedServer?.value, date: selectedDate });
      const { sieges: s } = response.data;
      setSieges(s);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      await alert({ confirmation: 'Something went wrong' });
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const onServerSelected = (selection: DropdownOption) => {
    setSelectedServer(selection);
  };

  const getItem = ({ index, style }: {index: number, style: React.CSSProperties}) => {
    const finalStyle: React.CSSProperties = { ...style };
    return (
      <div style={finalStyle}>
        <SiegeListItem siege={sieges[index]} />
      </div>
    );
  };

  const onFilterApplied = () => {
    load();
  };

  const onFilterCleared = () => {
    setSelectedServer(null);
    setSelectedDate(null);
  };

  return (
    <div className="directory">
      {
        isLoading && (
          <div className="directory-loading">
            <LoadingIndicator />
          </div>
        )
      }

      {
        !isLoading && (
          <DirectorySidebar>
            <div className="directory-top">
              <div className="directory-filter-block">
                <h3 className="directory-title">Browse Sieges</h3>
                <SelectMenu
                  aria-label="Select to search by"
                  className="directory-server-filter"
                  options={options}
                  isMulti={false}
                  placeholder="Filter by server"
                  onChange={onServerSelected}
                  value={selectedServer}
                />

                <DatePicker
                  placeholderText="Filter by date"
                  showPopperArrow={false}
                  selected={selectedDate}
                  onChange={(date: Date) => setSelectedDate(date)}
                  customInput={(
                    <input
                      className="directory-date"
                      type="text"
                      value={selectedDate?.toString()}
                    />
                  )}
                />

                <Button
                  className="directory-apply"
                  onClick={onFilterApplied}
                >
                  Apply filters
                </Button>

                <Button
                  className="directory-clear"
                  onClick={onFilterCleared}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          </DirectorySidebar>
        )
      }

      {
        !isLoading && (
          <div className="directory-list">
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  itemCount={sieges.length}
                  itemSize={90}
                  width={width}
                >
                  {getItem}
                </FixedSizeList>
              )}
            </AutoSizer>
          </div>
        )
      }
    </div>

  );
};

export default Directory;
