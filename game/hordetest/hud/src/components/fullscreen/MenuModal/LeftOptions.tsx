/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const MenuTitle = styled.div`
  font-family: Colus;
  font-size: 24px;
  color: #3d3d3d;
`;

const MenuItemsContainer = styled.div`
  margin-bottom: 40px;
`;

const Item = styled.div`
  font-family: Lato;
  color: white;
  font-size: 18px;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 30px;
  background: transparent;
  transition: background 0.2s, padding-left 0.2s;

  &:hover {
    background: linear-gradient(to right, #273a64, transparent);
    padding-left: 60px;
  }
`;

export interface Props {
}

export function LeftOptions(props: Props) {
  return (
    <Container>
      <MenuTitle>Menu</MenuTitle>
      <MenuItemsContainer>
        <Item>Battle Log</Item>
        <Item>Settings</Item>
        <Item>Select Game Mode</Item>
      </MenuItemsContainer>
      <Item>Support</Item>
      <Item>Legal</Item>
      <Item>News</Item>
      <Item>Credits</Item>
      <Item>Exit</Item>
    </Container>
  );
}
