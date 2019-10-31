/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { AbilityButton } from './AbilityButton';

const ActionButtonsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ActionButtonSpacing = css`
  margin: 0 5px;
`;

export interface Props {
}

const index2Icon = [
  'fs-icon-berserker-frozen-wrath',
  'fs-icon-berserker-ground-slam',
  'fs-icon-berserker-enrage'
];

export function ActionButtons(props: Props) {
  const [weakAbility, setWeakAbility] = useState(cloneDeep(hordetest.game.abilityBarState.weak));
  const [strongAbility, setStrongAbility] = useState(cloneDeep(hordetest.game.abilityBarState.strong));
  const [ultimateAbility, setUltimateAbility] = useState(cloneDeep(hordetest.game.abilityBarState.ultimate));

  useEffect(() => {
    const handle = hordetest.game.abilityBarState.onUpdated(() => {
      const abilityBarState = JSON.parse(JSON.stringify(hordetest.game.abilityBarState));
      if (!abilityBarState) return;

      if (abilityBarState.weak && abilityBarState.weak.id >= 0) {
        setWeakAbility(abilityBarState.weak);
      }

      if (abilityBarState.strong && abilityBarState.strong.id >= 0) {
        setStrongAbility(abilityBarState.strong);
      }

      if (abilityBarState.ultimate && abilityBarState.ultimate.id >= 0) {
        setUltimateAbility(abilityBarState.ultimate);
      }
    });

    return () => {
      handle.clear();
    }
  }, [hordetest.game.abilityBarState]);

  function renderAbilityButton(ability: AbilityBarItem, i: number, type: 'weak' | 'strong' | 'ultimate') {
    return (
      <AbilityButton
        type={type}
        key={ability.id}
        abilityID={ability.id}
        className={ActionButtonSpacing}
        actionIconClass={index2Icon[i]}
        keybindText={ability.boundKeyName}
        keybindIconClass={ability.binding.iconClass}
      />
    );
  }

  return (
    <ActionButtonsContainer>
      {weakAbility && weakAbility.id >= 0 && renderAbilityButton(weakAbility, 0, 'weak')}
      {strongAbility && strongAbility.id >= 0 && renderAbilityButton(strongAbility, 1, 'strong')}
      {ultimateAbility && ultimateAbility.id >= 0 && renderAbilityButton(ultimateAbility, 2, 'ultimate')}
    </ActionButtonsContainer>
  );
}