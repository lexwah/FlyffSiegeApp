import React from 'react';
import './style.css';
import {
  Route, Routes, useNavigate
} from 'react-router-dom';

import DarkModeToggle from 'react-dark-mode-toggle';
import ModalDialog from '../../components/ModalDialog/ModalDialog';
import Button from '../../components/Button/Button';
import Landing from '../Landing/Landing';
import SiegeView from '../SiegePage/SiegePage';
import Directory from '../Directory/Directory';

const App = (): React.ReactElement => {
  const [isModalShown, setIsModalShown] = React.useState<boolean>(false);
  const [textFieldContent, setTextFieldContent] = React.useState<string | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference !== undefined) {
      setIsDarkMode(darkModePreference === 'true');
    }
  }, []);

  const onLogParsed = () => {
    setTextFieldContent(undefined);
    setIsModalShown(false);
  };

  const onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target?.value;
    if (!content) {
      setTextFieldContent('');
    } else {
      setTextFieldContent(content);
    }
  };

  const showModal = () => {
    setIsModalShown(true);
  };

  const onLogSubmitted = () => {
    setIsModalShown(false);
    navigate('/siege/new');
  };

  const onDarkModeToggled = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);

    localStorage.setItem('darkMode', `${newVal}`);
  };

  return (
    <div className={`app${isDarkMode ? ' dark' : ''}`}>
      <div className="dark-mode-toggle-container">
        <DarkModeToggle
          onChange={onDarkModeToggled}
          checked={isDarkMode}
          size={50}
        />
      </div>
      <Routes>
        <Route
          path="/siege/:siegeId/*"
          element={(
            <SiegeView
              onLogParsed={onLogParsed}
              pastedLog={textFieldContent}
              isDarkMode={isDarkMode}
            />
          )}
        />

        <Route
          path="/new"
          element={<Landing onButtonClicked={showModal} />}
        />

        <Route
          path="/browse"
          element={<Directory />}
        />

        <Route path="*" element={<Landing onButtonClicked={showModal} />} />
      </Routes>

      {
        isModalShown && (
          <ModalDialog title="Paste Siege Log" onClose={() => { setIsModalShown(false); }}>
            <textarea onChange={onTextAreaChange} placeholder="Paste log here" className="paste-content" />

            <div className="paste-content-buttons">
              <Button
                onClick={onLogSubmitted}
                className="paste-content-submit"
                disabled={!(textFieldContent?.length > 1)}
              >
                Load
              </Button>
            </div>
          </ModalDialog>
        )
      }
    </div>
  );
};

export default App;
