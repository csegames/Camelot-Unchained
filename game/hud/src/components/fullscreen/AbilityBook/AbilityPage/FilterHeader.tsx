/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { TextInput } from 'shared/TextInput';

const Container = styled.div`
  display: flex;
  padding: 0 5%;
`;

const inputStyle = css`
  width: 275px;
  height: 43px;
  background-image: url(../images/abilitybook/hd/search-border.png);
  background-repeat: no-repeat;
  font-size: 16px;
  font-family: TitilliumWeb;
  color: black;
  background-color: transparent;
  border: 0;

  &::placeholder {
    color: black;
  }
`;

export interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

// tslint:disable-next-line:function-name
export function FilterHeader(props: Props) {
  return (
    <Container>
      <TextInput
        overrideInputStyles
        placeholder='Filter by name'
        value={props.searchValue}
        inputClassName={inputStyle}
        onChange={e => props.onSearchChange(e.target.value)}
      />
    </Container>
  );
}
