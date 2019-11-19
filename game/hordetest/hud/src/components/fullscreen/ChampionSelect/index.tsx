/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useState, useContext } from 'react';
import { styled } from '@csegames/linaria/react';

import { Header } from '../Header';
import { ChampionPick } from './ChampionPick';
import { ChampionInfo } from './ChampionInfo';
import { LockedList } from './LockedList';
import { LockIn } from './LockIn';
import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { MatchmakingContext } from 'context/MatchmakingContext';
import { ChampionSelectContextProvider } from './context/ChampionSelectContext';
import { webAPI } from '@csegames/library/lib/hordetest';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
`;

const HeaderItemContainer = styled.div`
  display: flex;
  flex: 1;

  &.align-center {
    justify-content: center;
  }
`;

const GameModeContainer = styled.div`
  margin-top: 30px;
  margin-left: 30px;
`;

const GameModeText = styled.div`
  font-size: 30px;
  line-height: 30px;
  font-family: Colus;
  text-transform: uppercase;
  color: white;
`;

const GameModeDifficulty = styled.div`
  font-size: 16px;
  line-height: 16px;
  font-family: Colus;
  text-transform: uppercase;
  color: #707070;
`;

const ChampionPickContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const SelectedChampionContainer = styled.div`
  position: relative;
  width: 60%;
  height: 100%;
  pointer-events: none;
  top: 0;
  bottom: 0;
  left: 0;
`;

const SelectedChampionImage = styled.img`
  position: absolute;
  width: 80%;
  height: 80%;
  object-fit: contain;
  right: 5%;
`;

const ChampionInfoContainer = styled.div`
  position: absolute;
  left: 60%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const LockedListContainer = styled.div`
  position: absolute;
  top: 75px;
  right: 28px;
`;

const LockInPosition = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 70px;
`;

const ConsoleNavIcon = styled.div`
  color: white;
  font-size: 30px;
  color: white;
  margin: 0 10px;
`;

export interface Props {
  gameMode: string;
  difficulty: string;
}

export interface Champion {
  id: string;
  name: string;
  image: string;
  previewImage?: string;
  abilities: { type: 'light' | 'heavy' | 'ultimate', name: string, iconClass: string }[];
}

export function ChampionSelect(props: Props) {
  const { champions, championCostumes } = useContext(ChampionInfoContext);
  const { matchID } = useContext(MatchmakingContext);
  const [selectedChampion, setSelectedChampion] = useState(champions[0]);
  const [isLocked, setIsLocked] = useState(false);

  function getChampionCostumeInfo(championID: string) {
    return championCostumes.find(c => c.requiredChampionID === championID);
  }

  function onChampionPick(championID: string) {
    const champion = champions.find(c => championID === c.id);
    setSelectedChampion(champion);
    updateSelectedChampion(championID);
  }

  async function updateSelectedChampion(championID: string) {
    const request = {
      championID,
    };
    await webAPI.ChampionAPI.SelectChampion(webAPI.defaultConfig, request as any);
  }

  async function onLockIn() {
    setIsLocked(true);
    const res = await webAPI.ChampionAPI.LockInChampionSelection(webAPI.defaultConfig);
    if (!res.ok) {
      // TODO: Handle why this is not OK
      setIsLocked(false);
    }
  }

  const selectedChampionCostumeInfo = getChampionCostumeInfo(selectedChampion.id);
  return (
    <ChampionSelectContextProvider matchID={matchID}>
      <Container>
        <HeaderContainer>
          <HeaderItemContainer>
            <GameModeContainer>
              <GameModeText>{props.gameMode}</GameModeText>
              <GameModeDifficulty>{props.difficulty}</GameModeDifficulty>
            </GameModeContainer>
          </HeaderItemContainer>
          <HeaderItemContainer className='align-center'>
            <Header isSelected>Select your champion</Header>
          </HeaderItemContainer>
          <HeaderItemContainer />
        </HeaderContainer>
        <ChampionPickContainer>
          <ConsoleNavIcon className='icon-xb-lb' />
          {champions.map((champion) => {
            const isSelected = champion.id === selectedChampion.id;
            const championCostumeInfo = getChampionCostumeInfo(champion.id);
            return (
              <ChampionPick
                isSelected={isSelected}
                id={champion.id}
                image={championCostumeInfo.thumbnailURL}
                onClick={onChampionPick}
              />
            );
          })}
          <ConsoleNavIcon className='icon-xb-rb' />
        </ChampionPickContainer>
        <SelectedChampionContainer>
          <SelectedChampionImage src={selectedChampionCostumeInfo.standingImageURL} />
        </SelectedChampionContainer>
        <ChampionInfoContainer>
          <ChampionInfo selectedChampion={selectedChampion} />
        </ChampionInfoContainer>
        <LockedListContainer>
          <LockedList />
        </LockedListContainer>
        <LockInPosition>
          <LockIn isLocked={isLocked} onLockIn={onLockIn} />
        </LockInPosition>
      </Container>
    </ChampionSelectContextProvider>
  );
}
