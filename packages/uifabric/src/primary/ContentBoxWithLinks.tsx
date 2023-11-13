import React from 'react';
import { ContentBoxLink } from './ContentBoxLink';
import { Stack } from 'office-ui-fabric-react';
import { ContentBox } from './ContentBox';

export type ContentCardStackWithLinksProps = {
  title: string;
  to: string;
  linkTexts: string[];
};

export function ContentBoxWithLinks(props: ContentCardStackWithLinksProps) {
  const { title, to, linkTexts } = props;
  return (
    <ContentBox title={title}>
      {linkTexts.map((linkText, key) => (
        <Stack.Item
          grow
          key={key}
          styles={{
            root: {
              marginLeft: '0.1em',
              marginBottom: '0.1em',
            },
          }}
        >
          <ContentBoxLink to={to} children={linkText} />
        </Stack.Item>
      ))}
    </ContentBox>
  );
}
