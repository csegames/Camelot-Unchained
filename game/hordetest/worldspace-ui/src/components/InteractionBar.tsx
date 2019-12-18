/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { InteractionBarState } from '.';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 5px;
  width: calc(100% - 10px);
  height: calc(100% - 10px);

  &.Consumable {
    background: linear-gradient(to bottom, #8c8d8d, transparent);
  }

  &.Trap {
    background: linear-gradient(to bottom, #d8ae04, transparent);
  }

  &.Bomb {
    background: linear-gradient(to bottom, #93278f, transparent);
  }

  &.Barricade {
    background: linear-gradient(to bottom, #077ab9, transparent);
  }
`;

const BarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 100%;
  height: 15px;
  border: 2px solid black;
  background-color: #1e1e1e;
  margin-bottom: 10px;
  z-index: -1;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: ${(props: { width: number } & React.HTMLProps<HTMLDivElement>) => props.width}%;
  background-color: #777777;
  z-index: 0;
`;

const BarText = styled.div`
  color: white;
  font-family: Lato;
  font-weight: bold;
  font-size: 20px;
  color: white;
`;

const KeybindIcon = styled.span`
  margin-right: 5px;
  opacity: 1;
  transition: opacity 0.2s;

  &.pressed {
    opacity: 0.7;
  }
`;

const ItemInfoContainer = styled.div`
  padding: 0 10px;
`;

const GameTypeText = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 14px;

  &.Consumable {
    color: #c7c7c7;
  }

  &.Trap {
    color: #fff77f;
  }

  &.Bomb {
    color: #ff7ffa;
  }

  &.Barricade {
    color: #7fdcff;
  }
`;

const ItemName = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 24px;
  color: #FFF;
  margin-bottom: 10px;
`;

const ItemDescription = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 16px;
  color: #FFF;
`;

export interface Props {
  state: InteractionBarState;
}

export interface State {
  isPressed: boolean;
}

export class InteractionBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isPressed: false,
    };
  }

  public render() {
    const { state } = this.props;
    const pressedClassName = this.state.isPressed ? 'pressed' : '';
    return (
      <Container className={ItemGameplayType[state.gameplayType]}>
        {state.progress &&
          <BarContainer>
            <Bar width={state.progress * 100} />
            <BarText>
              {state.keybind.iconClass ?
                <KeybindIcon className={`${pressedClassName} ${state.keybind.iconClass}`}></KeybindIcon> :
                <KeybindIcon className={pressedClassName}>{state.keybind.name}</KeybindIcon>}
              Pick up
            </BarText>
          </BarContainer>
        }
        <ItemInfoContainer>
          <GameTypeText className={ItemGameplayType[state.gameplayType]}>
            {ItemGameplayType[state.gameplayType]}
          </GameTypeText>
          <ItemName>{state.name}</ItemName>
          <ItemDescription>{state.description}</ItemDescription>
        </ItemInfoContainer>
      </Container>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (!this.state.isPressed && this.props.state.progress > prevProps.state.progress) {
      // Going up
      this.setState({ isPressed: true });
    }

    if (this.state.isPressed && this.props.state.progress < prevProps.state.progress) {
      // Going down
      this.setState({ isPressed: false });
    }
  }
}
