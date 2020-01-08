/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const CrosshairImage = styled.img`
  width: 45px;
  height: 45px;
`;

export function Crosshair() {
  const [isVisible, setIsVisible] = useState(cloneDeep(hordetest.game.selfPlayerState.isAlive));
  const [showOutOfResourceMessage, setShowOutOfResourceMessage] = useState(false);

  useEffect((() => {
    const evh = hordetest.game.selfPlayerState.onUpdated(() => {
      if (hordetest.game.selfPlayerState.isAlive) {
        if (!isVisible) {
          setIsVisible(true);
        }
      } else {
        if (isVisible) {
          setIsVisible(false);
        }
      }
    });

    return () => {
      evh.clear();
    };
  }));

  useEffect(() => {
    const weakAbility = hordetest.game.abilityStates[hordetest.game.abilityBarState.weak.id];
    const evh = hordetest.game.abilityStates[hordetest.game.abilityBarState.weak.id].onActivated(() => {
      handleAbilityActivated(weakAbility);
    });

    return () => {
      evh.clear();
    }
  });

  function handleAbilityActivated(ability: AbilityState) {
    if (!(ability.status & AbilityButtonState.Unusable)) return;

    if (ability.error & AbilityButtonErrorFlag.NotEnoughResource) {
      setShowOutOfResourceMessage(true);
    }
  }
  return isVisible ? (
    <Container>
      <CrosshairImage src={'images/hud/crosshair.png'} />
    </Container>
  ) : null;
}
