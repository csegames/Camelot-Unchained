/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
// import gql from 'graphql-tag';

export interface MatchmakingContextState {
}

const getDefaultMatchmakingContextState = (): MatchmakingContextState => ({

});

export const MatchmakingContext = React.createContext(getDefaultMatchmakingContextState());

export class MatchmakingContextProvider extends React.Component<{}, MatchmakingContextState> {
  constructor(props: {}) {
    super(props);

    this.state = getDefaultMatchmakingContextState();
  }

  public render() {
    return (
      <MatchmakingContext.Provider value={this.state}>
        {this.props.children}
      </MatchmakingContext.Provider>
    );
  }

  public componentDidMount() {
    
  }

  public componentWillUnmount() {
    
  }
}
