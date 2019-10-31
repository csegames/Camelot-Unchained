/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: relative;
  flex: 1;
  min-width: calc(33% - 20px);
  margin: 10px;
  background-color: rgba(27, 27, 27, 0.7);
`;

const IconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconClass = styled.div`
  font-size: 200px;
  color: #252525;
`;

export interface Props {
  iconClass: string;
  name: string;
  best: number;
  total: number;
  average: number;
}

export function StatBlock(props: Props) {
  return (
    <Container>
      <IconContainer>
        <IconClass className={props.iconClass} />
      </IconContainer>
    </Container>
  );
}
