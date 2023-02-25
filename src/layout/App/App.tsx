import React from 'react';
import './style.css';
import {
  Route, Routes, useNavigate
} from 'react-router-dom';

import ModalDialog from '../../components/ModalDialog/ModalDialog';
import Button from '../../components/Button/Button';
import Landing from '../Landing/Landing';
import SiegeView from '../SiegePage/SiegePage';
import Directory from '../Directory/Directory';
import { useDarkMode } from '../../ui-preferences/DarkMode';

const App = (): React.ReactElement => {
  const [isModalShown, setIsModalShown] = React.useState<boolean>(false);
  const [textFieldContent, setTextFieldContent] = React.useState<string | undefined>(undefined);
  const isDarkMode = useDarkMode();
  const navigate = useNavigate();

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

  return (
    <div className={`app${isDarkMode ? ' dark' : ''}`}>
      <Routes>
        <Route
          path="/siege/:siegeId/*"
          element={(
            <SiegeView
              onLogParsed={onLogParsed}
              pastedLog={textFieldContent}
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
