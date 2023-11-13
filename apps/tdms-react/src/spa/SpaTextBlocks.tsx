import React from 'react';
import { Text } from 'office-ui-fabric-react';
import useLinks from '../hooks/links/useLinks';
import { Link } from 'react-router-dom';

export default function SpaTextBlocks() {
  const links = useLinks();
  const { linkText, ...atdtRouteProps } = links.atdt.globalTextLinkProps({});

  return (
    <>
      <Text>
        <p>
          The following table lists the available System Performance Assessment dataset information. For access to the
          models, click on the Data Set Title in the third column of the table below. From there, you may click on the
          "Download Files" button or hyperlinks for access to the individual model files. For links to related data,
          click on the Data Tracking Number (DTN) in the first column of the table below to go to the Technical Data
          Information page.
        </p>
        <Link {...atdtRouteProps}>Search the Automated Technical Data Tracking System (ATDT)</Link>
      </Text>
    </>
  );
}
