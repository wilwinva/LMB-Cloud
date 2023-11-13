import { useParams } from 'react-router';

/** Note -- there is an issue where chrome will "autodetect" url encoding and may incorrectly remove and break encoding...
 * Some examples:
 * - http://localhost:8080/tdms/tdif/MO8902RIB00002%2E003 - works in firefox, breaks in chrome
 * - http://localhost:8080/tdms/tdif/MO8902RIB00002%2E003/ - works in firefox, works in chrome
 * */
export function useParamsEncoded() {
  const paramHook = useParams();
  return Object.values<string>(paramHook).map((param) => decodeURI(param));
}
