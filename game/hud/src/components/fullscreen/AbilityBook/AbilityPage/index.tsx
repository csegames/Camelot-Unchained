/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState } from 'react';
import { styled } from '@csegames/linaria/react';
import Fuse, { FuseOptions } from 'fuse.js';
import { Routes, AbilityBookContext } from '../index';
import { AbilityItem } from './AbilityItem';
import { FilterHeader } from './FilterHeader';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 5%;
  overflow: auto;
`;

const ListContainer = styled.div`
  width: 100%;
  align-self: center;
`;

const ListItemContainer = styled.div`
  display: inline-block;
  flex: 1;
  width: calc(50% - 20px);
  max-width: calc(50% - 20px);
  margin: 10px;
`;

const AbilityRow = styled.div`
  display: flex;
  width: 100%;
`;

export interface Props {
}

export const fuseSearchOptions: FuseOptions<any> = {
  shouldSort: true,
  threshold: 0.3,
  distance: 50,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  includeScore: true,
  keys: [
    'name',
  ],
};

// tslint:disable-next-line:function-name
export function AbilityPage(props: Props) {
  const { activeRoute, abilityNetworkToAbilities } = useContext(AbilityBookContext);
  const [searchValue, setSearchValue] = useState('');

  let abilities = [...abilityNetworkToAbilities[Routes[activeRoute]]];

  // Handle search filtering
  if (searchValue !== '') {
    const fuseSearch = new Fuse(abilities, fuseSearchOptions);
    abilities = fuseSearch.search(searchValue)
      .sort((a, b) => a.score - b.score)
      .map(searchItem => searchItem.item);
  }

  const abilityRows = [];
  const numOfRows = Math.ceil(abilities.length / 2);
  for (let i = 0; i < numOfRows; i++) {
    const ability1 = abilities.shift();
    const ability2 = abilities.shift();

    if (ability2) {
      abilityRows.push([ability1,, ability2]);
    } else {
      abilityRows.push([ability1]);
    }
  }

  return (
    <Container>
      <FilterHeader searchValue={searchValue} onSearchChange={val => setSearchValue(val)} />
      <ContentContainer className='cse-ui-scroller-thumbonly'>
        <ListContainer>
          {abilityRows.map((abilityRow) => {
            return (
              <AbilityRow>
                {abilityRow.map((ability) => {
                  return (
                    <ListItemContainer>
                      <AbilityItem ability={ability} />
                    </ListItemContainer>
                  );
                })}
              </AbilityRow>
            );
          })}
        </ListContainer>
      </ContentContainer>
    </Container>
  );
}
