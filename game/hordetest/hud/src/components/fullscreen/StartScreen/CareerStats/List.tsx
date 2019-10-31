/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { Dropdown } from '../../Dropdown';
import { StatType, topPlayers } from './testData';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DropdownContainer = styled.div`
  display: flex;
  max-height: 40px;
  flex: 1;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  height: 50px;
`;

const ItemLeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RankText = styled.div`
  font-family: Lato;
  font-weight: bold;
  color: white;
  font-size: 12px;
`;

const ChampionImage = styled.img`
  width: 25px;
  height: 25px;
  object-fit: contain;
`;

const UserName = styled.div`
  font-family: Lato;
  font-weight: bold;
  color: white;
  font-size: 18px;
`;

const ChampionName = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 12px;
  color: #6d6d6d;
`;

const StatValue = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 18px;
  color: white;
`;

export interface Props {
}

const championDropdownItems = [
  'Any',
  'Amazon',
  'Berserker',
];

const statDropdownItems = [
  StatType[StatType.Kills],
  StatType[StatType.KillStreak],
  StatType[StatType.LongestLife],
  StatType[StatType.DamageTaken],
  StatType[StatType.TotalDamage],
];

export function List() {
  const [selectedChampion, setSelectedChampion] = useState(championDropdownItems[0]);
  const [selectedStat, setSelectedStat] = useState<StatType>(StatType.Kills);

  function onSelectChampion(champion: string) {
    setSelectedChampion(champion);
  }

  function onSelectStat(statTypeKey: string) {
    setSelectedStat(StatType[statTypeKey]);
  }

  function getFilteredTopPlayers() {
    const topPlayersClone = cloneDeep(topPlayers);
    return topPlayersClone.filter(p =>
      (selectedChampion === 'Any' || p.championInfo.name === selectedChampion) && p.statType === selectedStat);
  }


  const sortedFilteredTopPlayers = getFilteredTopPlayers().sort((a, b) => b.statNumber - a.statNumber);
  return (
    <Container>
      <DropdownContainer>
        <Dropdown
          items={championDropdownItems}
          selectedItem={selectedChampion}
          onSelectItem={onSelectChampion}
        />
        <Dropdown
          items={statDropdownItems}
          selectedItem={StatType[selectedStat]}
          onSelectItem={onSelectStat}
          formatItem={item => item.toTitleCase()}
        />
      </DropdownContainer>
      <ListContainer>
        {sortedFilteredTopPlayers.map((topPlayer, i) => {
          return (
            <ListItem>
              <ItemLeftSection>
                <RankText>{i + 1}</RankText>
                <ChampionImage src={topPlayer.championInfo.iconUrl} />
                <div>
                  <UserName>{topPlayer.userName}</UserName>
                  <ChampionName>{topPlayer.championInfo.name}</ChampionName>
                </div>
              </ItemLeftSection>

              <StatValue>{topPlayer.statNumber}</StatValue>
            </ListItem>
          );
        })}
      </ListContainer>
    </Container>
  );
}
