import React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';

export interface TextTabNotificationsProps {
  showMessage: boolean;
  showError: boolean;
}
export default function TextTabNotifications(props: TextTabNotificationsProps) {
  const HighlightNotification = () => (
    <MessageBar messageBarType={MessageBarType.warning}>Next Hit Not Found.</MessageBar>
  );
  const ErrorNotification = () => (
    <MessageBar messageBarType={MessageBarType.error}>There was a problem retrieving highlight words.</MessageBar>
  );
  return (
    <>
      {props.showMessage && <HighlightNotification />}
      {props.showError && <ErrorNotification />}
    </>
  );
}
