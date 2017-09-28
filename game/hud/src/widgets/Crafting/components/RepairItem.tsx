/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Ingredient } from '../services/types';
import { StyleSheet, css, merge, repairItem, RepairItemStyles } from '../styles';
import Icon from './Icon';

export interface RepairItemProps {
  ingredient: Ingredient;
  style?: Partial<RepairItemStyles>;
}

export const RepairItem = (props: RepairItemProps) => {
  const ss = StyleSheet.create(merge({}, repairItem, props.style));
  const { name, stats } = props.ingredient;
  return (
    <div className={css(ss.repairItem)}>
      <Icon className={css(ss.icon)} src={props.ingredient.static.icon}/>
      <span className={css(ss.name)}>{name}</span>
      <span className={css(ss.durability)}>Durability: {stats.durability.current}</span>
      <span className={css(ss.points)}>Cost: {stats.durability.currentPoints}</span>
    </div>
  );
};

export default RepairItem;
