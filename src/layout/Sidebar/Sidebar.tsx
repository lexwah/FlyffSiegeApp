import React from 'react';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import Select from 'react-select';
import './style.css';
import { LoadingOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import GuildListItem from '../../components/GuildListItem/GuildListItem';
import Button from '../../components/Button/Button';
import logo from '../../assets/flyfflogo.png';
import { Guild, Kill } from '../../LogParser/models';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import { alert } from '../../components/ConfirmDialog/ConfirmDialog';
import TextEntryDialog from '../../components/TextEntryDialog/TextEntryDialog';
import { shareSiege, unshareSiege } from '../../api';
import ShareBox from '../../components/ShareField/ShareField';
import ModalDialog from '../../components/ModalDialog/ModalDialog';
import TextEntryDialogField from '../../components/TextEntryDialogField/TextEntryDialogField';
import DialogButtons from '../../components/DialogButtons/DialogButtons';
import { DropdownOption } from '../../components/SelectMenu/SelectMenu';
import { FlyffServer, labelForServer } from '../../util/util';

const DESC_ENABLE = 'Please set a password for this Siege log. This will allow you to disable sharing later if needed.';
const DESC_DISABLE = 'Please enter the password for this Siege log to continue.';

const CONFIRM_ALREADY_SHARED = 'This Siege has already been uploaded, below is the URL:';
const CONFIRM_SHARED = 'Sharing enabled, URL:';

const options: DropdownOption[] = Object.values(FlyffServer).map((server) => ({ value: server, label: labelForServer(server) }));

const Sidebar = ({
  server,
  date,
  guilds,
  killFeed,
  isLoading,
  isShared = false
}: {
  server?: string,
  date?: Date,
  guilds: Guild[],
  killFeed:Kill[],
  isLoading: boolean,
  isShared: boolean,
}): React.ReactElement => {
  const guildItems = guilds.sort((a, b) => {
    const aPoints = a.points + a.resPoints;
    const bPoints = b.points + b.resPoints;
    if (aPoints > bPoints) return -1;
    if (aPoints < bPoints) return 1;
    return 0;
  }).map((guild, index) => (
    <GuildListItem key={`guild-${index}`} guild={guild} ranking={index + 1} />
  ));

  const [isSharingBusy, setIsSharingBusy] = React.useState<boolean>(false);
  const [isSharingEnabled, setIsSharingEnabled] = React.useState<boolean>(isShared);
  const [isEnableConfirmationShown, setIsEnableConfirmationShown] = React.useState<boolean>(false);
  const [isDisableConfirmationShown, setIsDisableConfirmationShown] = React.useState<boolean>(false);
  const [sharedSiegeId, setSharedSiegeId] = React.useState<string>();
  const [sharingPassword, setSharingPassword] = React.useState<string>(null);

  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedServer, setSelectedServer] = React.useState<DropdownOption>(null);

  const onServerSelected = (selection:DropdownOption) => {
    if (selection.value === 'unspecified') {
      setSelectedServer(null);
      setSelectedDate(null);
    } else {
      setSelectedServer(selection);
    }
  };

  let dateFieldError = false;

  // Not allowed to specify a server without a date
  if (selectedServer && !selectedDate) {
    dateFieldError = true;
  }

  const { siegeId: siegeIdFromURL } = useParams<{ siegeId: string }>();
  const navigate = useNavigate();

  React.useEffect(() => {
    setSharedSiegeId(siegeIdFromURL);
  }, []);

  const onSharingChanged = async () => {
    if (isSharingEnabled) {
      setIsDisableConfirmationShown(true);
    } else {
      setIsEnableConfirmationShown(true);
    }
  };

  const onSharingPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target?.value;
    setSharingPassword(val);
  };

  const enableSharing = async (password: string): Promise<{siegeId: string | null, alreadyExists?: boolean}> => {
    try {
      const response = await shareSiege({
        killFeed,
        password,
        server: selectedServer?.value,
        date: selectedDate
      });
      const result = response.data;

      return result;
    } catch (e: any) {
      console.log(e.message);
      return { siegeId: null };
    }
  };

  const onEnablePasswordChange = async (pw: string) => {
    if (pw) {
      setIsSharingBusy(true);
      const { siegeId, alreadyExists } = await enableSharing(pw);
      setIsSharingBusy(false);
      if (siegeId) {
        setIsSharingEnabled(true);
      }

      const confirmation = (
        <div className="share-confirmed">
          <span>{alreadyExists ? CONFIRM_ALREADY_SHARED : CONFIRM_SHARED }</span>
          <ShareBox className="share-url" text={`${window.location.origin}/siege/${siegeId}`} />
        </div>
      );

      await alert({ confirmation, options: { title: 'Sharing Settings', confirmText: 'OK' } });

      // Hard refresh
      window.location.href = `/siege/${siegeId}/ranking`;
    }
  };

  const dismissSharingDialog = (proceed: boolean) => {
    const pw = sharingPassword;
    setSharedSiegeId(null);
    setIsEnableConfirmationShown(false);

    if (proceed && pw?.length > 1) {
      onEnablePasswordChange(pw);
    }
  };

  const disableSharing = async (password: string): Promise<boolean> => {
    try {
      await unshareSiege({ siegeId: sharedSiegeId, password });
      return true;
    } catch (e: any) {
      console.log(e.message);
      return false;
    }
  };

  const onDisablePasswordChange = async (pw: string | null) => {
    setIsDisableConfirmationShown(false);

    if (pw) {
      await disableSharing(pw);
      setIsSharingEnabled(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <Link to="/" className="sidebar-home">
          <img src={logo} className="logo-top" alt="Flyff logo" />
        </Link>

      </div>

      {
        isLoading && (
          <LoadingOutlined />
        )
      }

      {
        !isLoading && (
          <div className="guild-rank">
            <h3 className="guild-ranking-title">Guild Siege Ranking</h3>
            {
              (server || date) && (
                <div className="server-date">
                  {server ? labelForServer(server) : '(Unknown server)'}
                  { ' - '}
                  { date ? `${dayjs(date).format('D MMM, YYYY')}` : '(Unknown date)'}
                </div>
              )
            }
            <div className="guild-ranking-list">
              {guildItems}
            </div>
          </div>
        )
      }

      {
        !isLoading && (
          <span className="disclaimer">*Guild scores may be slightly inaccurate due to difficulty in calculating resurrection points.</span>
        )
      }

      {
        isEnableConfirmationShown && (
          <ModalDialog
            onClose={() => dismissSharingDialog(false)}
            title="Sharing"

          >
            <span className="share-desc-pw">{DESC_ENABLE}</span>
            <TextEntryDialogField
              style={{ maxWidth: '300px' }}
              onChange={onSharingPasswordChange}
              type="password"
            />

            <div className="share-optional-block">
              <div className="share-optional-title">
                <b>Optional</b>
                {' '}
                settings
              </div>

              <span className="share-optional-label">Server</span>

              <Select
                aria-label="Select a server for this log"
                id="server-select"
                components={{
                  IndicatorSeparator: () => null
                }}
                options={options}
                isMulti={false}
                placeholder="Select a server (optional)"
                onChange={onServerSelected}
                styles={{
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    boxShadow: 'rgb(145 158 171 / 70%) 0px 8px 24px -4px;'
                  }),
                  option: (baseStyles, state) => {
                    let modification;
                    if (state.isSelected) {
                      modification = {
                        color: '#fff',
                        background: 'var(--button-primary)'
                      };
                    }
                    return {
                      ...baseStyles,
                      color: 'var(--text-color)',
                      ...modification
                    };
                  }
                }}
              />

              <span className="share-optional-label date">Date of the Siege</span>

              <DatePicker
                placeholderText="Select a server first"
                disabled={!selectedServer}
                showPopperArrow={false}
                selected={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                customInput={(
                  <input
                    className={`share-optional-date-text${dateFieldError ? ' error' : ''}`}
                    type="text"
                  />
                )}
              />
            </div>
            <DialogButtons
              onCancel={() => dismissSharingDialog(false)}
              onConfirm={() => dismissSharingDialog(true)}
              confirmText="Share this Siege"
            />
          </ModalDialog>
        )
      }

      {
        isDisableConfirmationShown && (
          <TextEntryDialog
            isPassword
            title="Confirm changes"
            description={DESC_DISABLE}
            onClose={onDisablePasswordChange}
          />
        )
      }

      {
        !isLoading && (
          <div className="share-block">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="sharing-label" htmlFor="share-switch">
              Sharing enabled
            </label>
            <ToggleSwitch
              id="share-switch"
              isEnabled={isSharingEnabled}
              isDisabled={isSharingBusy}
              className="sharing-switch"
              onChange={onSharingChanged}
            />
            {
              isSharingBusy && (
                <LoadingOutlined className="share-loading" />
              )
            }
          </div>
        )
      }

      <div className="upload-block">
        <Button
          onClick={() => {
            navigate('/');
          }}
          className="upload-btn"
        >
          Upload new log
        </Button>
      </div>

      {/* <div className="credits">
        <span>
          Made by&nbsp;
          <b>Ruler</b>
          &nbsp;
          @
          &nbsp;
          <b>Mushpoie</b>
        </span>
      </div> */}
    </div>
  );
};

export default Sidebar;
