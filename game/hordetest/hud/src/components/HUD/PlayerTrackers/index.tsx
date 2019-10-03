/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
// import { throttle } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { PlayerTracker } from './PlayerTracker';

const PlayerTrackersContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
`;

export interface Props {
}

export interface State {
  playerDirections: PlayerDirection[];
}

const colors = [
  '#bd55fd',
  '#63263b',
  '#50b2e0',
  '#d3af4d',
  '#ab0d49',
  '#d9d82d',
  '#c1b2bf',
  '#14820e',
];

export class PlayerTrackers extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      playerDirections: [],
    };

    // this.handlePlayerDirectionUpdate = throttle(this.handlePlayerDirectionUpdate, 50);
  }

  public render() {
    return (
      <PlayerTrackersContainer>
        {Object.values(this.state.playerDirections).map((pt, i) => (
          <PlayerTracker
            key={i}
            index={i}
            color={colors[pt.id] || 'blue'}
            degrees={pt.angle}
            screenPos={pt.screenPos}
            scale={pt.scale}
          />
        ))}
      </PlayerTrackersContainer>
    );
  }

  public componentDidMount() {
    hordetest.game.onPlayerDirectionUpdate(this.handlePlayerDirectionUpdate);
  }

  private handlePlayerDirectionUpdate = (playerDirections: PlayerDirection[]) => {
    this.setState({ playerDirections });
  }
}
