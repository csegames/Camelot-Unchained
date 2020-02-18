/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { CareerStats } from '../index';
import { ColossusProfileContext } from '../../../../context/ColossusProfileContext';
import { ChampionInfoContextProvider } from '../../../../context/ChampionInfoContext';

// Uses ColossusProfileContext & ChampionInfoContext

jest.mock('@csegames/linaria');

beforeEach(() => {
  jest.resetModules();
});

describe('Career Stats', () => {
  it ('Handles poor ColossusProfileContext data', () => {
    const wrapper = shallow(
      <ChampionInfoContextProvider>
        <ColossusProfileContext.Provider value={{ bad: true } as any}>
          <CareerStats />
        </ColossusProfileContext.Provider>
      </ChampionInfoContextProvider>
    );

  });

  // it ('Handles poor ChampionInfoContext data', () => {

  // });
});
