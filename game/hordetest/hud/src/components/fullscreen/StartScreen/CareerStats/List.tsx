/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { topPlayers, StatType } from './testData';

const Container = styled.div`
  display: flex;
`;

export interface Props {
}

export function List() {
  const [selectedStat, setSelectedStat] = useState<StatType>(StatType.Kills);
  const [selectedChampionID, setSelectedChampionID] = useState('');
  return (
    <Container>
      
    </Container>
  );
}
