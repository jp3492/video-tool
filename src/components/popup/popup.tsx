import React from 'react';
import './popup.scss';

export const Popup = ({
  children,
  onClickOutside
}: {
  children: any;
  onClickOutside: Function;
}) => {
  return <div id="popup" className="popup"></div>;
};
