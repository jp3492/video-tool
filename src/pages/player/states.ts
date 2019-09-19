export const PLAYER_STATES = {
  PROJECT_ID: "PROJECT_ID",
  KEY_ACTION: "KEY_ACTION",

  PLAYING: "PLAYING",
  CURRENT_TIME: "CURRENT_TIME",

  INPUT_STATE: "INPUT_STATE",
  TAG_START_TIME: "TAG_START_TIME",
  TAG_END_TIME: "TAG_END_TIME",
  TAG_TIME_SELECTED: "TAG_TIME_SELECTED",
  TAG_CONTENT: "TAG_CONTENT",
  TAGS_SELECTED: "TAGS_SELECTED",
  EDITING_TAG: "EDITING_TAG",

  PLAYER_CONFIGURATION: "PLAYER_CONFIGURATION",
  PLAYER_CONFIGURATION_OPEN: "PLAYER_CONFIGURATION_OPEN",

  PLAYLIST_OPEN: "PLAYLIST_OPEN",

  TABS_ENABLED_STATUS: "TABS_ENABLED_STATUS",
  TABS_LOADING_STATUS: "TABS_LOADING_STATUS",
  TAB_SELECTED: "TAB_SELECTED",

  VIDEO_PLAYERS: "VIDEO_PLAYERS"
}

export const KEY_ACTIONS = {
  PLAY: "PLAY",
  VIDEO_NEXT: "VIDEO_NEXT",
  VIDEO_PREV: "VIDEO_PREV",
  FAST_FORWARD: "FAST_FORWARD",
  REWIND: "REWIND",
  PLAYLIST_PREV: "PLAYLIST_PREV",
  PLAYLIST_NEXT: "PLAYLIST_NEXT",
  TAG_STATE_NEXT: "TAG_STATE_NEXT",
  TAG_STATE_PREV: "TAG_STATE_PREV"
}

export enum INPUT_STATES {
  IDLE = "IDLE",
  START = "START",
  END = "END"
}

export enum TIME_SELECTED_STATES {
  NONE = "NONE",
  START = "START",
  END = "END"
}