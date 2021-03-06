/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { battlePassData } from './testData';
import { BattlePassDay } from './BattlePassDay';
import { SkinInfo } from '../ChampionProfile/SkinInfo';
import { Skin } from '../Store/testData';
import { Button } from 'components/fullscreen/Button';
import { InputContext } from 'components/context/InputContext';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  align-self: center;
  width: 90%;
  height: 70%;
  margin-top: 5%;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 45px;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 45px;
  margin-top: 15px;
`;

const SeasonNumber = styled.div`
  font-size: 16px;
  font-family: Colus;
  color: #6b6b6b;
`;

const SeasonName = styled.div`
  font-size: 32px;
  font-family: Colus;
  color: white;
`;

const BattlePassContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BattlePassDaysContainer = styled.div`
  display: flex;
  height: 100%;
`;

const LeftArrow = styled.div`
  align-self: center;
  width: 35px;
  height: 105px;
  background-image: url(../images/fullscreen/startscreen/battlepass/left-arrow.png);
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    filter: brightness(120%);
  }
`;

const RightArrow = styled.div`
  align-self: center;
  width: 35px;
  height: 105px;
  background-image: url(../images/fullscreen/startscreen/battlepass/right-arrow.png);
  background-size: contain;
  background-repeat: no-repeat;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    filter: brightness(130%);
  }
`;

const ChampionImageContainer = styled.div`
  position: relative;
  height: 100%;
  width: 40%;
  pointer-events: none;
`;

const ChampionImage = styled.img`
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: cover;
  transform: scale(1.4);
`;

const SeasonEndsText = styled.div`
  font-size: 24px;
  font-family: Colus;
  color: white;
`;

const EndsInText = styled.span`
  color: #767676;
`;

const SkinInfoPosition = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  margin: auto;
`;

const UpgradeButtonStyle = css`
  font-size: 24px;
  max-width: 150px;
  padding: 15px 10px;
  margin-left: 3px;
`;

const PageIndexContainer = styled.div`
  display: flex;
`;

const PageIndex = styled.div`
  width: 36px;
  height: 11px;
  background-color: #515151;
  margin: 0 3px;
  cursor: pointer;

  &.active {
    background-color: white;
  }

  &:hover {
    filter: brightness(130%);
  }
`;

const ConsoleTriggerIcon = styled.div`
  align-self: center;
  margin: 0 5px 20px 5px;
  font-size: 30px;
  color: white;
`;

const ButtonPosition = styled.div`
  display: flex;
  position: absolute;
  right: 40px;
  bottom: 40px;
`;

const ConsoleIcon = styled.span`
  margin-right: 5px;
`;


// const ButtonsContainer = styled.div`
//   display: flex;
// `;

// const Button = styled.div`
//   background-color: orange;
//   color: white;
//   cursor: pointer;
//   padding: 10px;
//   margin: 0 5px;

//   &:hover {
//     filter: brightness(120%);
//   }
// `;

export interface Props {
}

const battlePassDataClone = { ...battlePassData }

export function BattlePass(props: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPreviewSkinInfo, setSelectedPreviewSkinInfo] = useState<Skin>(null);

  function onPrevClick() {
    if (currentPage - 1 === 0) return;
    setCurrentPage(currentPage - 1);
  }

  function onNextClick() {
    if (currentPage + 1 > getNumPages()) return;
    setCurrentPage(currentPage + 1);
  }

  function onPageClick(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  function getNumPages() {
    return Math.ceil(battlePassDataClone.days.length / 7);
  }

  function onClickSkin(skin: Skin) {
    setSelectedPreviewSkinInfo(skin);
  }

  const firstIndex = (currentPage - 1) * 7;
  const lastIndex = (firstIndex) + 7;
  return (
    <InputContext.Consumer>
      {({ isConsole }) => (
        <Container>
          <ContentContainer>
            {isConsole && <ConsoleTriggerIcon className='icon-xb-lt'></ConsoleTriggerIcon>}
            <BattlePassContainer>
              <TitleContainer>
                <div>
                  <SeasonNumber>Season {battlePassData.seasonNumber}</SeasonNumber>
                  <SeasonName>{battlePassData.seasonName}</SeasonName>
                </div>

                <SeasonEndsText>
                  <EndsInText>Ends in</EndsInText> {battlePassData.days.length - battlePassData.currentDay}
                </SeasonEndsText>
              </TitleContainer>
              <BattlePassDaysContainer>
                <LeftArrow onClick={onPrevClick} />
                {battlePassDataClone.days.slice(firstIndex, lastIndex).map((day) => {
                  return (
                    <BattlePassDay day={day} selectedPreviewSkinInfo={selectedPreviewSkinInfo} onClickSkin={onClickSkin} />
                  );
                })}
                <RightArrow onClick={onNextClick} />
              </BattlePassDaysContainer>
              <BottomContainer>
                <Button
                  type='primary'
                  text={isConsole ? <div><span className='icon-xb-r-down'></span> Upgrade</div> : 'Upgrade'}
                  styles={UpgradeButtonStyle}
                />
                <PageIndexContainer>
                  {Array.from(Array(getNumPages()).keys()).map((_, i) => {
                    return (
                      <PageIndex onClick={() => onPageClick(i + 1)} className={i + 1 === currentPage ? 'active' : ''} />
                    );
                  })}
                </PageIndexContainer>
              </BottomContainer>
            </BattlePassContainer>
            {isConsole && <ConsoleTriggerIcon className='icon-xb-rt'></ConsoleTriggerIcon>}
            <ChampionImageContainer>
              <ChampionImage src={'images/hud/champions/berserker.png'} />
              <SkinInfoPosition>
                <SkinInfo hideSkinButtons selectedPreviewSkinInfo={selectedPreviewSkinInfo} />
              </SkinInfoPosition>
            </ChampionImageContainer>
          </ContentContainer>
          {isConsole &&
            <ButtonPosition>
              <ConsoleIcon className='icon-xb-a'></ConsoleIcon> Select
            </ButtonPosition>
          }
        </Container>
      )}
    </InputContext.Consumer>
  );
}
