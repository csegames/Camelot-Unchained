/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 15:04:43
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 15:08:59
 */

import gql from 'graphql-tag';

export default gql`
fragment DurabilityStats on DurabilityStats {
  maxRepairPoints
  maxDurability
  fractureThreshold
  fractureChance
  currentRepairPoints
  currentDurability
}
`;

export interface DurabilityStats {
  maxRepairPoints: number;
  maxDurability: number;
  fractureThreshold: number;
  fractureChance: number;
  currentRepairPoints: number;
  currentDurability: number;
}
