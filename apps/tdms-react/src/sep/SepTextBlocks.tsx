import React from 'react';
import { Text } from 'office-ui-fabric-react';
import useLinks from '../hooks/links/useLinks';
import { Link } from 'react-router-dom';

export default function SepTextBlocks() {
  const links = useLinks();
  const { linkText, ...atdtRouteProps } = links.atdt.globalTextLinkProps({});

  return (
    <Text>
      <p>
        The following table lists the available Site & Engineering Properties dataset information. Click on the Data
        Tracking Number (DTN) in the first column of the table to link to the technical Data Information page or click
        on the Dataset Title in the third column to access the dataset page. From there, you may click on the "Download
        Files" button or hyperlinks to access the individual dataset files.
      </p>
      <Link {...atdtRouteProps}>Search the Automated Technical Data Tracking System (ATDT)</Link>
    </Text>
  );
}
