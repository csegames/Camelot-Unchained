/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ANIMATION_DURATION = 2;

const RuneContainer = styled.div`
  padding: 1px 5px;
  margin-left: 3px;
  font-family: Exo;
  font-size: 13px;
  color: white;

  &.barrier {
    background-color: rgba(42, 82, 185, 1);
  }

  &.health {
    background-color: rgba(68, 174, 104, 1);
  }

  &.damage {
    position: relative;
    background-color: rgba(0, 0, 0, 1);
  }
`;

const ShineAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  animation: updateAnimation ${ANIMATION_DURATION}s linear;

  &.barrier {
    filter: brightness(150%);
    background-color: rgba(42, 82, 185, 1);
  }

  &.health {
    filter: brightness(150%);
    background-color: rgba(68, 174, 104, 1);
  }

  &.damage {
    filter: brightness(150%);
    background-color: rgba(254, 113, 0, 1);
  }

  @keyframes updateAnimation {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
`;

const RuneContent = styled.div`
  transform: skewX(10deg);
`;

const RuneIcon = styled.span`
  margin-left: 3px;
`;

export interface Props {
  runeType: RuneType;
  value: number;
}

export interface State {
  shouldPlayUpdateAnimation: boolean;
}

export class Rune extends React.Component<Props, State> {
  private updateAnimationHandle: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      shouldPlayUpdateAnimation: false,
    }
  }

  public render() {
    const runeClassName = this.getRuneClassName();
    return (
      <RuneContainer className={runeClassName}>
        {this.state.shouldPlayUpdateAnimation && <ShineAnimation className={runeClassName} />}
        <RuneContent>
          {this.props.value || 0}
          <RuneIcon className={this.getRuneIcon()}></RuneIcon>
        </RuneContent>
      </RuneContainer>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      this.playUpdateAnimation();
    }
  }

  public componentWillUnmount() {
    window.clearTimeout(this.updateAnimationHandle);
    this.updateAnimationHandle = null;
  }

  private playUpdateAnimation = () => {
    this.setState({ shouldPlayUpdateAnimation: true });

    this.updateAnimationHandle = window.setTimeout(() => {
      this.setState({ shouldPlayUpdateAnimation: false });
    }, ANIMATION_DURATION * 1000);
  }

  private getRuneClassName = () => {
    switch (this.props.runeType) {
      case RuneType.Weapon: {
        return 'damage';
      }
      case RuneType.Health: {
        return 'health';
      }
      case RuneType.Protection: {
        return 'barrier';
      }
      default: {
        return '';
      }
    }
  }

  private getRuneIcon = () => {
    switch (this.props.runeType) {
      case RuneType.Weapon: {
        return 'fs-icon-rune-damage';
      }
      case RuneType.Health: {
        return 'fs-icon-rune-health';
      }
      case RuneType.Protection: {
        return 'fs-icon-rune-barrier';
      }
      default: {
        return '';
      }
    }
  }
}