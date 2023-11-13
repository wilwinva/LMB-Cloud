import React from 'react';
import { useParamsEncoded } from '@nwm/react-hooks';
import { PageWithIntro } from '@nwm/uifabric';
import { Text } from 'office-ui-fabric-react';

export function TdifRpc() {
  const [tdifRpc] = useParamsEncoded();

  return (
    <PageWithIntro title="RPC Lookup">
      <Text>Look up the RPC ID {tdifRpc} in the RDMS application</Text>
    </PageWithIntro>
  );
}
