import React from 'react';
import { Link } from 'react-router-dom';
import { Text } from 'office-ui-fabric-react';

const boldStyle = { fontWeight: 800 };

export default function MwdTextBlocks() {
  return (
    <Text>
      <p>
        The Model Warehouse is an on-line repository of currently available project numerical models, comprised of
        process/intermediate level <span style={boldStyle}>Analytical Tools</span>,{' '}
        <span style={boldStyle}>Inputs, </span>,<span style={boldStyle}>Constraints</span>, and{' '}
        <span style={boldStyle}>Numerical and Graphical </span> results of the various site and evaluation models. For
        access to the models, click on the Data Set Title in the third column of the table below. From there, you may
        click on the "Download Files" button or hyperlinks for access to the individual model files. For links to
        related data, click on the Data Tracking Number (DTN) in the first column of the table below to go to the
        Technical Data Information page.
      </p>
      <p>
        <span style={boldStyle}>Please Note:</span> When provided, source codes and executable files represent the
        actual software used to create the models, but are not necessarily the most up-to-date or complete versions
        available. These files are provided as a means of reproducing the models as presented herein. If you need the
        most current version of the software, or if you need to procure the software for official Project use, please
        contact Software Configuration Management.
      </p>
      <p>
        <Link to="/atdt">Search the Automated Technical Data Tracking System (ATDT)</Link>
      </p>
    </Text>
  );
}
