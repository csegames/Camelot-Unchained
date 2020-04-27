/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { css } from '@csegames/linaria';
import { Ability } from '@csegames/library/lib/camelotunchained/graphql/schema';
import { DragAndDrop } from 'utils/DragAndDropV2';
import { ActionViewContext } from '../../context/ActionViewContext';
import { Container } from './ActionBtn';
import { FallbackIcon } from '../FallbackIcon';

const IconStyle = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
`;

export function AddActionBtn() {
  const actionViewContext = useContext(ActionViewContext);
  const ui = useContext(UIContext);

  if (typeof actionViewContext.queuedAbilityId !== 'number') {
    return null;
  }

  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;
  const abilityInfo: Ability = camelotunchained.game.store.getAbilityInfo(actionViewContext.queuedAbilityId);

  return (
    <DragAndDrop
      type='drag'
      defaultIsDragging
      dataTransfer={{
        queuedAbilityId: actionViewContext.queuedAbilityId,
      }}
      dataKey='action-button'
      dragRenderOffset={{ x: -display.radius, y: -display.radius }}
      dragRender={() => {
        return (
          <Container {...display} acceptInput={false}>
            <FallbackIcon icon={abilityInfo.icon} extraStyles={IconStyle} />
          </Container>
        );
      }}
      onDragEnd={actionViewContext.clearQueueAddAction}>
      <div />
    </DragAndDrop>
  );
}
