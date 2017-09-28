/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';

import CUCharacterFragment, { CUCharacter } from '../fragments/CUCharacter';
import FullOrderFragment, { FullOrder } from '../fragments/FullOrder';

export default gql`
query MySocial {
  myCharacter {
    ...CUCharacter
  }
  myOrder {
    ...FullOrder
  }
}
${CUCharacterFragment}
${FullOrderFragment}
`;

export interface MySocialQuery {
  myCharacter: CUCharacter;
  myOrder: FullOrder;
}
