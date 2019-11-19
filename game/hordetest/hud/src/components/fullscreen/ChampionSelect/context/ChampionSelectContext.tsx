/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult } from '@csegames/library/lib/_baseGame/graphql/subscription';
import { IChampionUpdate, ChampionUpdateType } from '@csegames/library/lib/hordetest/graphql/schema';

const subscription = gql`
  subscription ChampionSelectSubscription($matchID: String!) {
    championSelectionUpdates(matchID: $matchID) {
      type
      updaterCharacterID

      ... on ChampionSelectionUpdate {
        championID,
        championMetaData
      }
    }
  }
`;

export interface ChampionSelectContextState {

}

const getDefaultChampionSelectContextState = (): ChampionSelectContextState => ({

});

export const ChampionSelectContext = React.createContext(getDefaultChampionSelectContextState());

export class ChampionSelectContextProvider extends React.Component<{}, ChampionSelectContextState> {
  constructor(props: {}) {
    super(props);

    this.state = getDefaultChampionSelectContextState();
  }

  public render() {
    return (
      <ChampionSelectContext.Provider value={this.state}>
        <GraphQL subscription={subscription} subscriptionHandler={this.handleSubscription} />
        {this.props.children}
      </ChampionSelectContext.Provider>
    );
  }

  private handleSubscription = (result: SubscriptionResult<{ championSelectUpdates: IChampionUpdate }>, data: any) => {
    if (!result.data && !result.data.championSelectUpdates) return data;

    const championSelectUpdate = result.data.championSelectUpdates;

    // Hello self
    // NEED TO GET PLAYERS AND THE INFO ABOUT THEM. Then need to update those players through these events
  }
}
