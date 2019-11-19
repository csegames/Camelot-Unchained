/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult } from '@csegames/library/lib/_baseGame/graphql/subscription';
import { IInteractiveAlert, AlertCategory } from '@csegames/library/lib/hordetest/graphql/schema';

const query = gql`
  query InteractiveAlertsQuery {
    myInteractiveAlerts {
      category
      targetID

      ... on GroupAlert {
        kind
        fromName
        fromID
        forGroup
        forGroupName
        code
      }
    }
  }
`;

const interactiveAlertSubscription = gql`
  subscription InteractiveAlertsSubscription {
    interactiveAlerts {
      category
      targetID

      ... on GroupAlert {
        kind
        fromName
        fromID
        forGroup
        forGroupName
        code
      }
    }
  }
`;

export interface InteractiveAlertsContextState {
  myInteractiveAlerts: IInteractiveAlert[];
}

const getDefaultInteractiveAlertsContextState = (): InteractiveAlertsContextState => ({
  myInteractiveAlerts: [],
});

export const InteractiveAlertsContext = React.createContext(getDefaultInteractiveAlertsContextState());

export class InteractiveAlertsContextProvider extends React.Component<{}, InteractiveAlertsContextState> {
  constructor(props: {}) {
    super(props);

    this.state = getDefaultInteractiveAlertsContextState();
  }

  public render() {
    return (
      <InteractiveAlertsContext.Provider value={this.state}>
        <GraphQL
          query={query}
          onQueryResult={this.handleQuery}
          subscription={interactiveAlertSubscription}
          subscriptionHandler={this.handleSubscription}
        />
        {this.props.children}
      </InteractiveAlertsContext.Provider>
    );
  }

  public componentDidMount() {
    
  }

  public componentWillUnmount() {
    
  }

  private handleQuery = (gql: GraphQLResult<{ myInteractiveAlerts: IInteractiveAlert[] }>) => {
    if (!gql || !gql.data || !gql.data.myInteractiveAlerts) return gql;

    this.setState({ myInteractiveAlerts: gql.data.myInteractiveAlerts });
  }

  private handleSubscription = (result: SubscriptionResult<{ interactiveAlerts: IInteractiveAlert }>, data: any) => {
    if (!result.data && !result.data.interactiveAlerts) return data;
    if (result.data.interactiveAlerts.category !== AlertCategory.Group) return data;

    const newInteractiveAlert = result.data.interactiveAlerts;
    const myInteractiveAlerts = { ...this.state.myInteractiveAlerts };
    myInteractiveAlerts.push(newInteractiveAlert);
    this.setState({ myInteractiveAlerts });
  }
}