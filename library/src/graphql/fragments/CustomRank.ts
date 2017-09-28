/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import PermissionInfoFragment from './PermissionInfo';
import { PermissionInfo } from '../schema';

export default gql`
fragment CustomRank on CustomRank {
  name
  level
  permissions {
    ...PermissionInfo
  }
}
${PermissionInfoFragment}
`;
