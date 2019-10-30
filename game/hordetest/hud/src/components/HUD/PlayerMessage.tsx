/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

export function sendPlayerMessage(message: string, duration: number = 3000) {
  game.trigger('player-message', message, duration);
}

const ANIMATION_DURATION = 0.5;

const Container = styled.div`
  font-size: 18px;
  font-family: Exo;
  color: white;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.8);
  opacity: 0;
  animation: fadeIn ${ANIMATION_DURATION}s forwards;

  &.fadeOut {
    animation: fadeOut ${ANIMATION_DURATION}s forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

export interface Props {
}

export interface State {
  playerMessage: string;
  shouldPlayFadeOutAnimation: boolean;
}

export class PlayerMessage extends React.Component<Props, State> {
  private evh: EventHandle;
  private durationTimeout: number;
  private fadeOutTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      playerMessage: '',
      shouldPlayFadeOutAnimation: false,
    };
  }

  public render() {
    const fadeOutClass = this.state.shouldPlayFadeOutAnimation ? 'fadeOut' : '';
    return this.state.playerMessage && (
      <Container className={fadeOutClass}>
        {this.state.playerMessage}
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = game.on('player-message', this.handlePlayerMessage);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handlePlayerMessage = (message: string, duration: number = 3000) => {
    // First clear out any existing timeouts, we're overriding them
    if (this.durationTimeout) {
      window.clearTimeout(this.durationTimeout);
      this.durationTimeout = null;
    }

    if (this.fadeOutTimeout) {
      window.clearTimeout(this.fadeOutTimeout);
      this.fadeOutTimeout = null;
    }

    // Update player message
    this.setState({ playerMessage: message, shouldPlayFadeOutAnimation: false });

    // Fade out player message on a timeout
    this.playFadeOutAnimation(duration);

    // Remove player message on a given duration timeout
    this.durationTimeout = window.setTimeout(() => {
      this.setState({ playerMessage: '' });

      this.durationTimeout = null;
    }, duration);
  }

  private playFadeOutAnimation = (messageDuration: number) => {
    this.fadeOutTimeout = window.setTimeout(() => {
      this.setState({ shouldPlayFadeOutAnimation: true });

      this.fadeOutTimeout = null;
    }, messageDuration - (ANIMATION_DURATION * 1000));
  }
}
