/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  flex: 1;
`;

const SelectedItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Lato;
  font-size: 18px;
  color: #C8C9C9;
  background-color: #353535;
  padding: 0 5px;
  height: 40px;
`;

const Chevron = styled.div`
  color: #9a9c9c;
  font-size: 18px;
`;

const DropdownContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-family: Lato;
  font-size: 18px;
  color: #C8C9C9;
  background-color: #353535;
  padding: 0 5px;
  height: 40px;
`;

export interface Props {
  selectedItem: string;
  items: string[];
  onSelectItem: (item: string) => void;
  formatItem?: (item: string) => string;
}

export function Dropdown(props: Props) {
  const [isOpen, setIsOpen] = useState();
  function onClickSelected() {
    setIsOpen(!isOpen);
  }

  return (
    <Container>
      <SelectedItem onClick={onClickSelected}>
        {props.selectedItem}
        <Chevron className={isOpen ? 'fas fa-caret-down' : 'fas fa-caret-up'} />
      </SelectedItem>
      {isOpen &&
        <DropdownContainer>
          {props.items.map((item, i) => {
            return (
              <Item key={i} onClick={() => props.onSelectItem(item)}>
                {props.formatItem ? props.formatItem(item) : item}
              </Item>
            );
          })}
        </DropdownContainer>
      }
    </Container>
  );
}
