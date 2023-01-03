import React from 'react';
import Button from '../../components/Button/Button';
import TextEntryDialog from '../../components/TextEntryDialog/TextEntryDialog';
import VodTile from '../../components/VodTile/VodTile';
import { Vod } from '../../LogParser/models';
import './style.css';
import { deleteSiegeVod, submitSiegeVod } from '../../api';
import { alert } from '../../components/ConfirmDialog/ConfirmDialog';
import { useNavigate, useParams } from 'react-router-dom';

const EXAMPLE_URL = 'https://www.youtube.com/watch?v=Aj7HsdcrEfA';

const VodsPage = ({ initialVods }: {initialVods: Vod[]}): React.ReactElement => {
  const navigate = useNavigate();
  const { siegeId } = useParams<{ siegeId: string }>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // For when a user clicks the delete button on a vod
  const [isDeleteDialogShown, setIsDeleteDialogShown] = React.useState<boolean>(false);

  // For a user to enter a youtube link
  const [isSubmitDialogShown, setIsSubmitDialogShown] = React.useState<boolean>(false);

  // For the password confirmation dialog after a user submits a youtube link
  const [isSubmitPasswordShown, setIsSubmitPasswordShown] = React.useState<boolean>(false);

  const [vodToDelete, setVodToDelete] = React.useState<Vod>(null);
  const [youtubeLinkToSubmit, setYoutubeLinkToSubmit] = React.useState<string>(null);

  const [vods, setVods] = React.useState<Vod[]>([]);

  React.useEffect(() => {
    if (siegeId === 'new') {
      navigate('/siege/new');
    } else {
      setVods(initialVods);
    }
  }, []);

  const onDeleteClicked = async (vod: Vod) => {
    if (isLoading) {
      await alert({ confirmation: 'Please wait', options: { title: 'Busy' } });
    } else {
      setIsDeleteDialogShown(true);
      setVodToDelete(vod);
    }
  };

  const onDeleteConfirmed = async (password: string) => {
    setIsDeleteDialogShown(false);
    if (password?.length > 0) {
      try {
        await deleteSiegeVod({ siegeId, youtubeId: vodToDelete.youtubeId, password });
        await alert({ confirmation: 'Video removed successfully!', options: { title: 'Success' } });
      } catch (e) {
        console.log(e);
        await alert({ confirmation: 'An unexpected error occurred, video not removed', options: { title: 'Error' } });
      } finally {
        setVodToDelete(null);
        setIsLoading(false);
      }
    }

    setVodToDelete(null);
  };

  const onURLEntered = (url: string) => {
    setIsSubmitDialogShown(false);
    if (url?.length > 0) {
      setIsSubmitPasswordShown(true);
      setYoutubeLinkToSubmit(url);
    }
  };

  const onURLPasswordConfirmed = async (password: string) => {
    setIsSubmitPasswordShown(false);
    try {
      setIsLoading(true);
      await submitSiegeVod({ siegeId, url: youtubeLinkToSubmit, password });
      await alert({ confirmation: 'Video link submitted successfully!' });
      window.location.reload();
    } catch (e) {
      await alert({ confirmation: 'An unexpected error occurred' });
      setYoutubeLinkToSubmit(null);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitBtnClicked = async () => {
    if (isLoading) {
      await alert({ confirmation: 'Please wait', options: { title: 'Busy' } });
    } else {
      setIsSubmitDialogShown(true);
    }
  };

  const tiles = vods.map((vod, index) => <VodTile key={`vod-${index}`} onVodDeleteClicked={onDeleteClicked} vod={vod} />);

  return (
    <div className="vp-container">
      {
        isDeleteDialogShown && (
          <TextEntryDialog
            isPassword
            title="Confirm changes"
            description="To remove this video, enter the siege log's password:"
            onClose={onDeleteConfirmed}
          />
        )
      }

      {
        isSubmitPasswordShown && (
          <TextEntryDialog
            isPassword
            title="Confirm changes"
            description="Please enter the siege log's password to continue"
            onClose={onURLPasswordConfirmed}
          />
        )
      }

      {
        isSubmitDialogShown && (
          <TextEntryDialog
            title="Confirm changes"
            description="Please enter the YouTube URL of the video:"
            placeholder={`Example: ${EXAMPLE_URL}`}
            onClose={onURLEntered}
          />
        )
      }

      <div className="vp-top">
        <h3 className="vp-title">Videos from this siege</h3>
        <Button
          onClick={onSubmitBtnClicked}
          className="vp-submit"
        >
          Submit Video
        </Button>
      </div>
      {
        vods?.length > 0 ? (
          <div className="vod-tile-container">
            {tiles}
          </div>
        ) : (
          <div className="vp-empty">No videos shared yet. </div>
        )
      }

    </div>
  );
};

export default VodsPage;
