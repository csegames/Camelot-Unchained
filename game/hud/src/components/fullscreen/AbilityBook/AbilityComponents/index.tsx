/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { AbilityBookContext } from '../index';
import { ComponentItem } from './ComponentItem';

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

const ComponentRow = styled.div`
  display: flex;
  padding: 0 27px;
`;

const ComponentCategoryContainer = styled.div`

`;

const ComponentCategoryName = styled.div`
  font-size 21px;
  letter-spacing: 1px;
  font-family: TradeWinds;
  border-bottom: 1px solid black;
  margin-bottom: 18px;
`;

export interface Props {
}

// tslint:disable-next-line:function-name
export function AbilityComponents(props: Props) {
  const { abilityComponents, componentCategoryToComponentIDs } = useContext(AbilityBookContext);

  return (
    <Container>
      <ContentContainer className='cse-ui-scroller-thumbonly'>
        <ListContainer>
          {Object.keys(componentCategoryToComponentIDs).map((componentCategoryName) => {
            const abilityComponentRows: string[][] = [];
            const abilityComponentIDs = [...componentCategoryToComponentIDs[componentCategoryName]];
            const numOfRows = Math.ceil(abilityComponentIDs.length / 2);
            for (let i = 0; i < numOfRows; i++) {
              const abilityComponent1 = abilityComponentIDs.shift();
              const abilityComponent2 = abilityComponentIDs.shift();

              if (abilityComponent2) {
                abilityComponentRows.push([abilityComponent1,, abilityComponent2]);
              } else {
                abilityComponentRows.push([abilityComponent1]);
              }
            }

            return (
              <ComponentCategoryContainer>
                <ComponentCategoryName>{componentCategoryName}</ComponentCategoryName>
                {abilityComponentRows.map((abilityComponentRow) => {
                  return (
                    <ComponentRow>
                      {abilityComponentRow.map((abilityComponentID) => {
                        const abilityComponent = abilityComponents[abilityComponentID];
                        return (
                          <ComponentItem abilityComponent={abilityComponent} />
                        );
                      })}
                    </ComponentRow>
                  );
                })}
              </ComponentCategoryContainer>
            );
          })}
        </ListContainer>
      </ContentContainer>
    </Container>
  );
}
