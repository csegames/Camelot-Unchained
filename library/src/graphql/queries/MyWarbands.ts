/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 17:43:14
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-20 17:07:20
 */

import gql from 'graphql-tag';

import FullWarbandFragment, {FullWarband} from '../fragments/fullWarband';

export default gql`
query MyWarbands {
  myWarbands {
    ...FullWarband
  }
}
${FullWarbandFragment}
`;

export interface MyWarbands {
  myWarbands : FullWarband[];
}