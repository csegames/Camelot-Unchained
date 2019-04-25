/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { AbilityBookQuery } from 'gql/interfaces';
import { AbilityComponent } from './AbilityComponent';

const ListItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: calc(100% - 20px);
  height: calc(100% - 35px);
  min-height: 112px;
  padding 10px 10px 25px 10px;
  background-image: url(../images/abilitybook/hd/ability-border.png);
  background-size: 100% 100%;
  box-shadow: inset 0 0 50px 19px rgba(126, 95, 72, 0.2);
`;

const Icon = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 1px solid black;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12.5px;
`;

const Name = styled.div`
  font-family: CaudexBold;
  font-size: 19px;
  margin-bottom: 5px;
  cursor: default;
  word-break: break-all;
`;

const ComponentContainer = styled.div`
  display: flex;
`;

const AddToBarButton = styled.div`
  position: absolute;
  cursor: pointer;
  font-family: CaudexBold;
  font-size: 12px;
  bottom: 10px;
  right: 10px;
  opacity: 1;
  transition: opacity 0.3s;
  letter-spacing: 2px;

  &:hover {
    opacity: 0.7;
  }
`;

const EditIcon = styled.div`
  position: absolute;
  cursor: pointer;
  font-size: 12px;
  top: 10px;
  right: 10px;
  opacity: 1;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

export interface Props {
  ability: AbilityBookQuery.Abilities;
}

// tslint:disable-next-line:function-name
export function AbilityItem(props: Props) {
  const { ability } = props;

  return (
    <ListItem>
      <Icon src={ability.icon} />
      <EditIcon className='icon-edit' />
      <InfoContainer>
        <Name>{ability.name}</Name>
        <ComponentContainer>
          {ability.abilityComponents.map(component => (
            <AbilityComponent abilityComponent={component} />
          ))}
        </ComponentContainer>
      </InfoContainer>
      <AddToBarButton>+ ADD TO ACTION BAR</AddToBarButton>
    </ListItem>
  );
}
