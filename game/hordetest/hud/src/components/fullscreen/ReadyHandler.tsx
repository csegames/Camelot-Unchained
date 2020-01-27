/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const imagePreloader = [
  'images/fullscreen/fullscreen-career-bg.jpg',
  'images/fullscreen/fullscreen-image-bg.jpg',
  'images/fullscreen/fullscreen-scene-bg.jpg',
];

export interface Props {
}

export function ReadyHandler(props: Props) {
  return (
    <Container>

    </Container>
  );
}
