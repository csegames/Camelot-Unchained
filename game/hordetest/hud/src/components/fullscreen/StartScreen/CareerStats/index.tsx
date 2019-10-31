/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { StatBlock } from './StatBlock';

const Container = styled.div`
  display: flex;
  width: 80%;
  height: 100%;
  padding: 0 10%;
`;

const StatBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 2;
  padding: 20px 0 60px 0;
`;

const ListContainer = styled.div`
  flex: 1;
`;

export interface Props {
}

export function CareerStats(props: Props) {
  return (
    <Container>
      <StatBlockContainer>
        <StatBlock
          name='Test Block'
          iconClass='icon-category-vial'
          best={54234}
          total={2345123}
          average={21344}
        />
        <StatBlock
          name='Kills'
          iconClass='icon-category-weapons'
          best={54234}
          total={2345123}
          average={21344}
        />
        <StatBlock
          name='Kill Streak'
          iconClass='icon-damage-spirit'
          best={234}
          total={2345123}
          average={21344}
        />
        <StatBlock
          name='Longest Life'
          iconClass='icon-slot-left-hand-weapon'
          best={321234}
          total={2345123}
          average={21344}
        />
        <StatBlock
          name='Damage Taken'
          iconClass='icon-category-light-chest'
          best={43567112}
          total={2345123}
          average={21344}
        />
        <StatBlock
          name='Total Damage'
          iconClass='icon-damage-physics-impact'
          best={214622432}
          total={2345123}
          average={21344}
        />
      </StatBlockContainer>
      <ListContainer></ListContainer>
    </Container>
  );
}
