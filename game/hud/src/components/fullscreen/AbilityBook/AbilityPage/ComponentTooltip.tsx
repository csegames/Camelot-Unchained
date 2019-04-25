/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { AbilityBookQuery } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Name constants
const NAME_FONT_SIZE = 36;
// #endregion
const Name = styled.div`
  font-size: ${NAME_FONT_SIZE}px;
  font-family: Caudex;
  color: white;

  @media (max-width: 2560px) {
    font-size: ${NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region Description constants
const DESCRIPTION_FONT_SIZE = 24;
const DESCRIPTION_LINE_HEIGHT = 32;
const DESCRIPTION_MARGIN_BOTTOM = 20;
// #endregion
const Description = styled.div`
  font-size: ${DESCRIPTION_FONT_SIZE}px;
  line-height: ${DESCRIPTION_LINE_HEIGHT}px;
  margin-bottom: ${DESCRIPTION_MARGIN_BOTTOM}px;
  color: #BBBCBC;

  @media (max-width: 2560px) {
    font-size: ${DESCRIPTION_FONT_SIZE * MID_SCALE}px;
    line-height: ${DESCRIPTION_LINE_HEIGHT * MID_SCALE}px;
    margin-bottom: ${DESCRIPTION_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${DESCRIPTION_FONT_SIZE * HD_SCALE}px;
    line-height: ${DESCRIPTION_LINE_HEIGHT * HD_SCALE}px;
    margin-bottom: ${DESCRIPTION_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

export interface Props {
  abilityComponent: AbilityBookQuery._AbilityComponents;
}

// tslint:disable-next-line:function-name
export function ComponentTooltip(props: Props) {
  const { abilityComponent } = props;
  return (
    <div>
      <Name>{abilityComponent.display.name}</Name>
      <Description>{abilityComponent.display.description}</Description>
    </div>
  );
}
