/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { AbilityBookQuery } from 'gql/interfaces';
import { AbilityBookContext } from '..';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: calc(50% - 10px);
  margin-right: 5px;
  margin-left: 5px;
  margin-bottom: 25px;
`;

const Icon = styled.img`
  width: 61.5px;
  height: 61.5px;
  border: 2.5px solid rgba(124, 92, 76, 0.5);
  margin-right: 12px;
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: 18px;
  font-family: CaudexBold;
`;

const ExperienceBarContainer = styled.div`
  position: relative;
  height: 5px;
  max-height: 5px;
  flex: 1;
  border: 1px solid black;
`;

const ExperienceBar = styled.div`
  position: absolute;
  height: 100%;
  background-color: #49302A;
`;

const LevelText = styled.div`
  text-transform: uppercase;
  font-family: CaudexBold;
  letter-spacing: 1px;
  font-size: 12px;
`;

export interface Props {
  abilityComponent: AbilityBookQuery._AbilityComponents;
}

// tslint:disable-next-line:function-name
export function ComponentItem(props: Props) {
  const { abilityComponentIDToProgression } = useContext(AbilityBookContext);
  const progressionData = abilityComponentIDToProgression[props.abilityComponent.id];
  let levelProgress = 0;

  if (progressionData) {
    const levelInfo = props.abilityComponent.progression.levels.levels.find(level =>
      level.levelNumber === progressionData.level);
    levelProgress = progressionData.progressionPoints / levelInfo.progressionForLevel;
  }
  return (
    <Container>
      <Icon src={props.abilityComponent.display.iconURL} />
      <InfoContainer>
        <Name>{props.abilityComponent.display.name}</Name>
        <ExperienceBarContainer>
          <ExperienceBar style={{ width: `${levelProgress}%` }} />
        </ExperienceBarContainer>
        <LevelText>
          Level: {progressionData ? progressionData.level : props.abilityComponent.progression.levels.levels[0].levelNumber}
        </LevelText>
      </InfoContainer>
    </Container>
  );
}
