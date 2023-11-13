import React from 'react';
import { useParamsEncoded } from '@nwm/react-hooks';
import { PageWithIntro } from '@nwm/uifabric';
import { Text } from 'office-ui-fabric-react';

export function TdifTic() {
  const [tdifTic] = useParamsEncoded();

  return (
    <PageWithIntro title="TIC Lookup">
      <Text>Look up TIC# {tdifTic} in the TIC application</Text>
    </PageWithIntro>
  );
}
