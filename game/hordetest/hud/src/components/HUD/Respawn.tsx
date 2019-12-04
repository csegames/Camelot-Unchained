/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { InputContext } from 'components/context/InputContext';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(transparent, black);
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 473px;
  height: 1080px;
  background-image: url(../images/hud/respawn/banner.png);
  background-size: contain;
  pointer-events: all;
`;

const DeadText = styled.div`
  width: 298px;
  height: 132px;
  background-image: url(../images/hud/respawn/dead-text.png);
  background-size: contain;
`;

const Button = styled.div`
  padding: 10px;
  text-transform: uppercase;
  font-family: Colus;
  font-size: 18px;
  background-color: transparent;
  transition: background-color 0.2s;
  border: 2px solid #f9e163;
  color: #f9e163;

  &.leave {
    color: white;
    border: 2px solid #f9e163;
    color: #f9e163;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Heart = styled.div`
  font-size: 16px;
  color: white;

  &.life {
    color: red;
  }
`;

export interface Props {
  isConsole: boolean;
}

export interface State {
  visible: boolean;
}

class RespawnWithInjectedContext extends React.Component<Props, State> {
  private visibilityEVH: EventHandle;
  private controllerSelectEVH: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    const playerState = hordetest.game.selfPlayerState;
    const hearts = Array.from(Array(playerState.maxDeaths));
    return this.state.visible ? (
        <Container data-input-group='block'>
          <Banner>
            <DeadText />
            {hearts.map((heart, i) => {
              const isLife = i + 1 <= playerState.maxDeaths - playerState.currentDeaths;
              return (
                <Heart className={isLife ? 'life' : ''} />
              );
            })}
            {playerState.currentDeaths < playerState.maxDeaths ?
              <Button onClick={this.onRespawn}>Respawn</Button> :
              <Button className='leave' onClick={this.onRespawn}>Leave Match</Button>
            }
          </Banner>
        </Container>
    ) : null;
  }

  public componentDidMount() {
    this.handleVisibility();
    this.visibilityEVH = hordetest.game.selfPlayerState.onUpdated(this.handleVisibility);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.state.visible) {
      if (!prevProps.isConsole && this.props.isConsole) {
        this.setWaitingForSelect(true);
        this.controllerSelectEVH = game.onControllerSelect(this.onRespawn);
      }

      if (prevProps.isConsole && !this.props.isConsole) {
        this.setWaitingForSelect(false);
        this.controllerSelectEVH.clear();
      }
    }
  }

  public componentWillUnmount() {
    this.visibilityEVH.clear();

    if (this.controllerSelectEVH) {
      this.controllerSelectEVH.clear();
    }
  }

  private handleVisibility = () => {
    if (!hordetest.game.selfPlayerState.isAlive && !this.state.visible) {
      this.show();
      return;
    }

    if (hordetest.game.selfPlayerState.isAlive && this.state.visible) {
      this.hide();
    }
  }

  private show = () => {
    if (this.props.isConsole) {
      this.setWaitingForSelect(true);
      this.controllerSelectEVH = game.onControllerSelect(this.onRespawn);
    }

    this.setState({ visible: true });
  }

  private hide = () => {
    if (this.props.isConsole) {
      this.setWaitingForSelect(false);
    }

    this.setState({ visible: false });
  }

  private onRespawn = () => {
    hordetest.game.selfPlayerState.respawn('-1');
  }

  private setWaitingForSelect = (isWaitingForSelect: boolean) => {
    game.setWaitingForSelect(isWaitingForSelect);
  }
}

export function Respawn() {
  return (
    <InputContext.Consumer>
      {({ isConsole }) => (
        <RespawnWithInjectedContext isConsole={isConsole} />
      )}
    </InputContext.Consumer>
  );
}
