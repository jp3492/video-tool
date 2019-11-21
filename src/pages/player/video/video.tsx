import React, {
  useState,
  useCallback,
  memo,
  useEffect,
  useRef,
  useMemo
} from 'react';
import './video.scss';

import { Link } from '../types';
import { quantumState } from '@piloteers/react-state';
import { PLAYER_STATES, KEY_ACTIONS } from '../states';
import { TAB_LOADING_STATUS } from '../types';
import ReactPlayer from 'react-player';
import { useTime, setActiveTab } from '../useTime';

const playerVars = {
  youtube: {
    playerVars: {
      modestbranding: 1,
      iv_load_policy: 3,
      fs: 0,
      disablekb: 1,
      controls: 1,
      rel: 0,
      preload: true,

      events: {
        onStateChange: state => console.log(state)
      }
    }
  }
};

export const Video = memo(({ links }: { links: Link[] }) => {
  const [linksLoadingStatus, setLinksLoadingStatus] = quantumState({
    id: PLAYER_STATES.TABS_LOADING_STATUS,
    initialValue: links.reduce(
      (res, l) => ({ ...res, [l.url]: TAB_LOADING_STATUS.LOADING }),
      {}
    )
  });
  const [selectedTab] = quantumState({
    id: PLAYER_STATES.TAB_SELECTED,
    initialValue: links[0].url || ''
  });
  const [playing, setPlaying] = quantumState({
    id: PLAYER_STATES.PLAYING,
    initialValue: false
  });
  const [players, setPlayers] = quantumState({
    id: PLAYER_STATES.VIDEO_PLAYERS,
    initialValue: {}
  });
  const [keyAction, setKeyAction] = quantumState({
    id: PLAYER_STATES.KEY_ACTION
  });

  const playerRef = useRef({});

  useMemo(() => {
    setActiveTab(links[0].url);
  }, [links]);

  useEffect(() => {
    setPlayers(playerRef.current);
  }, [setPlayers]);

  const updateLinkStatus = (url, status) =>
    setLinksLoadingStatus({ ...linksLoadingStatus, [url]: status });

  useEffect(() => {
    if (keyAction.action === KEY_ACTIONS.PLAY) {
      setPlaying(!playing);
    } else if (keyAction.action === KEY_ACTIONS.FAST_FORWARD) {
      playerRef.current[selectedTab].seekTo(
        playerRef.current[selectedTab].getCurrentTime() + 1,
        'seconds'
      );
    } else if (keyAction.action === KEY_ACTIONS.REWIND) {
      playerRef.current[selectedTab].seekTo(
        playerRef.current[selectedTab].getCurrentTime() - 1,
        'seconds'
      );
    }
  }, [keyAction, playing, selectedTab, setPlaying]);

  const handleAddPlayer = useCallback((url, player) => {
    if (!playerRef.current[url]) {
      playerRef.current = { ...playerRef.current, [url]: player };
    }
  }, []);

  window.focus(); // very bad practice but no other way figured out

  return (
    <div className="player-video">
      {links.map(l => (
        <Player
          key={l.url}
          {...l}
          playing={playing}
          setPlaying={setPlaying}
          addPlayer={handleAddPlayer}
          updateLinkStatus={updateLinkStatus}
          selected={selectedTab === l.url}
        />
      ))}
    </div>
  );
});

const Player = memo(
  ({
    url,
    updateLinkStatus,
    selected,
    addPlayer,
    playing,
    setPlaying
  }: {
    url: string;
    updateLinkStatus: Function;
    selected: boolean;
    addPlayer: Function;
    playing: boolean;
    setPlaying: Function;
  }) => {
    const { setTime } = useTime({ returnValue: false });

    return (
      <ReactPlayer
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        progressInterval={100}
        onProgress={e => setTime(e.playedSeconds.toFixed(2))}
        playing={playing && selected}
        className={selected ? 'player-selected' : ''}
        width="100%"
        height="100%"
        onEnded={() => console.log(url)}
        config={playerVars}
        url={url}
        ref={player => addPlayer(url, player)}
        onReady={() => updateLinkStatus(url, TAB_LOADING_STATUS.READY)}
        events="true"
      />
    );
  }
);
