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

  'images/fullscreen/startscreen/store/bundle-champ.jpg',
  'images/fullscreen/startscreen/store/bundle-weapon.jpg',
  'images/fullscreen/startscreen/store/skins-amazon.png',
  'images/fullscreen/startscreen/store/skins-berserker.png',
  'images/fullscreen/startscreen/store/skins-celt.png',
  'images/fullscreen/startscreen/store/skins-knight.png',
  'images/fullscreen/startscreen/store/weapons-axe.jpg',
  'images/fullscreen/startscreen/store/weapons-bg-blue.jpg',
  'images/fullscreen/startscreen/store/weapons-bg-green.jpg',
  'images/fullscreen/startscreen/store/weapons-bg-red.jpg',
  'images/fullscreen/startscreen/store/weapons-bg-yellow.jpg',
  'images/fullscreen/startscreen/store/weapons-bg.png',
  'images/fullscreen/startscreen/store/weapon-bow.png',
  'images/fullscreen/startscreen/store/weapon-spear.png',
  'images/fullscreen/startscreen/store/weapons-sword.png',
];

export interface Props {
}

export interface State {
}

export class ReadyHandler extends React.Component<Props, State> {
  public render() {
    return (
      <Container>
        {imagePreloader.map(() => {

        })}
      </Container>
    );
  }
}
