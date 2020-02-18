/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { ActiveMatchServer } from '@csegames/library/lib/hordetest/graphql/schema';
import {
  MatchmakingContextProvider,
  getDefaultMatchmakingContextState,
} from '../MatchmakingContext';

const defaultContextState = getDefaultMatchmakingContextState();
const stringifiedDefaultContextState = JSON.stringify(defaultContextState);

beforeEach(() => {
  jest.resetModules();
});

describe('MatchmakingProvider Initialization', () => {
  it ('Initializes with good state', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  });
});

describe('MatchmakingProvider handleQueryResult', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: { data: {  } } = null;
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  })

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: { data: {  } } = {
      data: null,
    };
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  });

  it ('Malformed Context State - Good graphql data but null data value', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: { data: {  } } = {
      data: {
        activeMatch: null,
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  });

  it ('Malformed Context State - Completely invalid graphql data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql = {
      data: {
        this123: null,
        is123: null,
        bad123: null,
      } as any,
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(JSON.stringify(wrapper.state())).toBe(stringifiedDefaultContextState);
  });

  it ('Malformed Context State - Partially invalid graphql data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql = {
      data: {
        activeMatch: null,
        this123: null,
        is123: null,
        bad123: null,
      } as any,
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });
  });

  it ('Good data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: { data: { activeMatchServer: ActiveMatchServer } } = {
      data: {
        activeMatchServer: {
          serverPort: 1000,
          serverHost: 'testServerHost',
        }
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      if (stateKey === 'host') {
        expect(state).toHaveProperty(stateKey, 'testServerHost');
      } else if (stateKey === 'port') {
        expect(state).toHaveProperty(stateKey, 1000);
      } else {
        expect(state).toHaveProperty(stateKey, defaultContextState[stateKey]);
      }
    });
  });
});

