/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import gql from 'graphql-tag';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SideNav } from './SideNav';
import { AbilityBookQuery } from 'gql/interfaces';
import { AbilityPage } from './AbilityPage';
import { AbilityComponents } from './AbilityComponents';
import { Header } from './Header';

const query = gql`
  query AbilityBookQuery {
    myCharacter {
      progression {
        abilityComponents {
          abilityComponentID
          level
          progressionPoints
        }
      }

      abilities {
        id
        name
        icon
        abilityComponents {
          id
          display {
            name
            description
            iconURL
          }
          abilityComponentCategory {
            id
            displayInfo {
              name
            }
          }
          progression {
            levels {
              id
              levels {
                levelNumber
                progressionForLevel
              }
            }
          }
        }

        abilityNetwork {
          id
          display {
            name
          }
        }
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
`;

const PageContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  padding-top: 30px;
  margin-left: 85px;
  background-image: url(../images/abilitybook/hd/ability-book-paper-bg.jpg);
  -webkit-mask-image: url(../images/abilitybook/hd/paper-mask-x-repeat.png);
  -webkit-mask-size: cover;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 30px;
    background-image: url(../images/abilitybook/hd/paper-left-rip.png);
  }
`;

export enum Routes {
  Main,
  Magic,
  Melee,
  Archery,
  Throwing,
  Shout,
  Misc,
  Components,
}

export interface AbilityNetworks {
  [name: string]: AbilityBookQuery.AbilityNetwork;
}

export interface AbilityNetworkToAbilities {
  [name: string]: AbilityBookQuery.Abilities[];
}

export interface AbilityComponents {
  [id: string]: AbilityBookQuery._AbilityComponents;
}

export interface AbilityComponentIDToProgression {
  [id: string]: AbilityBookQuery.AbilityComponents;
}

export interface ComponentCategoryToComponenentIDs {
  [categoryName: string]: string[];
}

export interface State {
  activeRoute: Routes;
  abilityNetworks: AbilityNetworks;
  abilityNetworkToAbilities: AbilityNetworkToAbilities;
  abilityComponents: AbilityComponents;
  abilityComponentIDToProgression: AbilityComponentIDToProgression;
  componentCategoryToComponentIDs: ComponentCategoryToComponenentIDs;
}

export interface Props {
}

const defaultContextState: State = {
  activeRoute: Routes.Components,
  abilityNetworks: {},
  abilityNetworkToAbilities: {},
  abilityComponents: {},
  abilityComponentIDToProgression: {},
  componentCategoryToComponentIDs: {},
};

export const AbilityBookContext = React.createContext(defaultContextState);

// tslint:disable-next-line:function-name
export function AbilityBook(props: Props) {
  const [activeRoute, setActiveRoute] = useState(defaultContextState.activeRoute);
  const [abilityNetworks, setAbilityNetworks] = useState(defaultContextState.abilityNetworks);
  const [abilityNetworkToAbilities, setAbilityNetworkToAbilities] = useState(defaultContextState.abilityNetworkToAbilities);
  const [abilityComponents, setAbilityComponents] = useState(defaultContextState.abilityComponents);
  const [abilityComponentIDToProgression, setAbilityComponentIDToProgression] =
    useState(defaultContextState.abilityComponentIDToProgression);
  const [componentCategoryToComponentIDs, setComponentCategoryToComponentIDs] =
    useState(defaultContextState.componentCategoryToComponentIDs);

  function onRouteClick(route: Routes) {
    setActiveRoute(route);
  }

  function handleQueryResult(graphql: GraphQLResult<AbilityBookQuery.Query>) {
    if (graphql.loading || !graphql.data) return graphql;

    const myCharacter = graphql.data.myCharacter;
    const initialState = getInitialState(
      myCharacter.abilities,
      myCharacter.progression ? myCharacter.progression.abilityComponents : [],
    );
    setAbilityNetworks(initialState.abilityNetworks);
    setAbilityNetworkToAbilities(initialState.abilityNetworkToAbilities);
    setAbilityComponents(initialState.abilityComponents);
    setAbilityComponentIDToProgression(initialState.abilityComponentIDToProgression);
    setComponentCategoryToComponentIDs(initialState.componentCategoryToComponentIDs);
  }

  function getInitialState(abilities: AbilityBookQuery.Abilities[],
                            abilityComponentProgression: AbilityBookQuery.AbilityComponents[]) {
    const abilityNetworks: AbilityNetworks = {};
    const abilityNetworkToAbilities: AbilityNetworkToAbilities = {};
    const abilityComponents: AbilityComponents = {};
    const abilityComponentIDToProgression: AbilityComponentIDToProgression = {};
    const componentCategoryToComponentIDs: ComponentCategoryToComponenentIDs = {};
    abilities.forEach((ability) => {
      const name = ability.abilityNetwork.display.name;

      // Miscellaneous abilities
      if (name !== 'Magic' && name !== 'Melee' && name !== 'Archery' && name !== 'Throwing' && name !== 'Shout') {
        if (!abilityNetworkToAbilities['Misc']) {
          abilityNetworkToAbilities['Misc'] = [ability];
          abilityNetworks['Misc'] = ability.abilityNetwork;
        } else {
          abilityNetworkToAbilities['Misc'].push(ability);
        }
        return;
      }


      if (!abilityNetworkToAbilities[name]) {
        abilityNetworkToAbilities[name] = [ability];
        abilityNetworks[name] = ability.abilityNetwork;
      } else {
        abilityNetworkToAbilities[name].push(ability);
      }

      ability.abilityComponents.forEach((abilityComponent) => {
        abilityComponents[abilityComponent.id] = abilityComponent;

        const categoryName = abilityComponent.abilityComponentCategory.displayInfo.name;
        if (componentCategoryToComponentIDs[categoryName]) {
          if (componentCategoryToComponentIDs[categoryName].includes(abilityComponent.id)) {
            // Already contains component id, no need to add duplicate
            return;
          }

          componentCategoryToComponentIDs[categoryName].push(abilityComponent.id);
        } else {
          componentCategoryToComponentIDs[categoryName] = [abilityComponent.id];
        }
      });
    });

    abilityComponentProgression.forEach((progression) => {
      abilityComponentIDToProgression[progression.abilityComponentID] = progression;
    });

    return {
      abilityNetworks,
      abilityNetworkToAbilities,
      abilityComponents,
      abilityComponentIDToProgression,
      componentCategoryToComponentIDs,
    };
  }

  function getHeaderTitle() {
    switch (activeRoute) {
      case Routes.Components: {
        return 'Ability Book | Components';
      }
      case Routes.Magic: {
        return 'Ability Book | Magic';
      }
      case Routes.Melee: {
        return 'Ability Book | Melee';
      }
      case Routes.Shout: {
        return 'Ability Book | Shout';
      }
      case Routes.Throwing: {
        return 'Ability Book | Throwing';
      }
      case Routes.Misc: {
        return 'Ability Book | Miscellaneous';
      }
      case Routes.Archery: {
        return 'Ability Book | Archery';
      }
      default: {
        return 'Ability Book';
      }
    }
  }

  function renderSelectedPage() {
    switch (activeRoute) {
      case Routes.Main: {
        return null;
      }
      case Routes.Components: {
        return <AbilityComponents />;
      }
      default: {
        return <AbilityPage />;
      }
    }
  }

  return (
    <GraphQL
      query={query}
      onQueryResult={handleQueryResult}>
      {(graphql: GraphQLResult<AbilityBookQuery.Query>) => {
        if (graphql.loading || !graphql.data) return null;

        return (
          <AbilityBookContext.Provider
            value={{
              activeRoute,
              abilityNetworks,
              abilityNetworkToAbilities,
              abilityComponents,
              abilityComponentIDToProgression,
              componentCategoryToComponentIDs,
            }}>
            <Container>
              <Header title={getHeaderTitle()} />
              <Content>
                <SideNav
                  activeRoute={activeRoute}
                  onRouteClick={onRouteClick}
                  abilityNetworkNames={Object.keys(abilityNetworks)}
                />
                <PageContainer>
                  {renderSelectedPage()}
                </PageContainer>
              </Content>
            </Container>
          </AbilityBookContext.Provider>
        );
      }}
    </GraphQL>
  );
}
