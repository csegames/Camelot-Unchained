/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
`;

export interface Props {
}

export interface State {
  isVisible: boolean;
  message: string;
}

export class UrgentMessage extends React.Component<Props, State> {
  private weakEVH: EventHandle;
  private strongEVH: EventHandle;
  private ultimateEVH: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: false,
      message: '',
    };
  }

  public render() {
    return (
      <Container>

      </Container>
    );
  }

  public componentDidMount() {
    const weakAbility = hordetest.game.abilityStates[hordetest.game.abilityBarState.weak.id];
    const strongAbility = hordetest.game.abilityStates[hordetest.game.abilityBarState.strong.id];
    const ultimateAbility = hordetest.game.abilityStates[hordetest.game.abilityBarState.ultimate.id];

    this.weakEVH = weakAbility.onActivated(() => this.onHandleAbilityActivated(weakAbility));
    this.strongEVH = strongAbility.onActivated(() => this.onHandleAbilityActivated(strongAbility));
    this.ultimateEVH = ultimateAbility.onActivated(() => this.onHandleAbilityActivated(ultimateAbility));
  }

  public componentWillUnmount() {
    this.weakEVH.clear();
    this.strongEVH.clear();
    this.ultimateEVH.clear();
  }

  private onHandleAbilityActivated = (ability: AbilityState) => {
    if (!(ability.status & AbilityButtonState.Unusable)) {
      if (this.state.isVisible) {
        this.setState({ isVisible: false, message: '' });
      }
      return;
    }

    if (ability.error & AbilityButtonErrorFlag.NotEnoughResource) {
      
    }
  }
}
