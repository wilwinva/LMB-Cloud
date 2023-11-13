import React from 'react';
import { Text } from 'office-ui-fabric-react';

import { InfoTableFragment } from './__generated__/InfoTableFragment';

export interface PiInfoProps
  extends Pick<InfoTableFragment, 'pi_first_nm' | 'pi_middle_nm' | 'pi_last_nm' | 'pi_org'> {}
export default function PiInfo(props: PiInfoProps) {
  const { pi_first_nm, pi_middle_nm, pi_last_nm, pi_org } = props;
  const last_name = notEmptyOrNull(pi_last_nm) ? `${pi_last_nm}, ` : '';
  const first_name = notEmptyOrNull(pi_first_nm) ? `${pi_first_nm}.` : '';
  const middle_name = notEmptyOrNull(pi_middle_nm) ? `${pi_middle_nm}.` : '';

  return (
    <>
      <Text>{`${last_name}${first_name}${middle_name}`}</Text>
      <br />
      <Text>{pi_org}</Text>
    </>
  );
}

function notEmptyOrNull(s?: string | null) {
  return s !== undefined && s !== null && s !== '' && s !== 'null';
}
