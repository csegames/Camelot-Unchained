/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { AbilityBookQuery } from 'gql/interfaces';
import { Ring } from 'shared/Ring';
import { Tooltip } from 'shared/Tooltip';
import { ComponentTooltip } from './ComponentTooltip';
import { AbilityBookContext } from '../index';

const Component = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 5px;
`;

const ComponentImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

export interface Props {
  abilityComponent: AbilityBookQuery._AbilityComponents;
}

const RING_RADIUS = 18;
const STROKE_WIDTH = 2;

// tslint:disable-next-line:function-name
export function AbilityComponent(props: Props) {
  const { abilityComponentIDToProgression } = useContext(AbilityBookContext);
  const progressionData = abilityComponentIDToProgression[props.abilityComponent.id];
  let progress = 0;

  if (progressionData) {
    const progressInfo = props.abilityComponent.progression.levels.levels.find(level =>
      level.levelNumber === progressionData.level);
    progress = progressionData.progressionPoints / progressInfo.progressionForLevel;
  }

  return (
    <Tooltip content={<ComponentTooltip abilityComponent={props.abilityComponent} />}>
      <Component>
        <Ring
          radius={RING_RADIUS - STROKE_WIDTH}
          centerOffset={RING_RADIUS}
          strokeWidth={STROKE_WIDTH}
          foreground={{ percent: progress, color: '#423b36', animation: null }}
          background={{ percent: 0.99, color: '#af9c8f', animation: null }}
        />
        <ComponentImage src={props.abilityComponent.display.iconURL} />
      </Component>
    </Tooltip>
  );
}
