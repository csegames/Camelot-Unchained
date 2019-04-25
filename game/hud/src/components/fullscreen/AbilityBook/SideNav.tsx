/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { Routes } from './index';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85px;
  height: 100%;
  background: linear-gradient(to right, transparent, black), url(../images/abilitybook/hd/nav-grey-bg.jpg);
  z-index: 1;
`;

const Tab = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 85px;
  cursor: pointer;

  &.active:before {
    content: '';
    position: absolute;
    top: -7px;
    bottom: -5px;
    right: -10px;
    width: 72px;
    background-image: url(../images/abilitybook/hd/icon-highlight.png);
    background-size: 100% 100%;
  }
`;

const TabIcon = styled.div`
  font-size: 50px;
  color: gray;
  background: linear-gradient(to right, transparent, transparent), url(../images/abilitybook/hd/icon-gold-texture.png);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: grayscale(100%);

  &.active {
    filter: grayscale(0);
  }
`;

const Divider = styled.div`
  background-image: url(../images/abilitybook/hd/nav-divider.png);
  width: 55px;
  height: 10px;
`;

export interface Props {
  activeRoute: Routes;
  onRouteClick: (route: Routes) => void;
  abilityNetworkNames: string[];
}

export class SideNav extends React.Component<Props> {
  public render() {
    return (
      <Container>
        {this.renderTab(Routes.Components)}
        {this.props.abilityNetworkNames.map((networkName) => {
          const route = Routes[networkName];
          return this.renderTab(route);
        })}
      </Container>
    );
  }

  private renderTab = (route: Routes) => {
    const activeClass = route === this.props.activeRoute ? 'active' : '';
    return (
      <>
        <Tab className={activeClass} onClick={() => this.props.onRouteClick(route)}>
          <TabIcon className={`${this.getTabIcon(route)} ${activeClass}`} />
        </Tab>
        <Divider />
      </>
    );
  }

  private getTabIcon = (route: Routes) => {
    switch (route) {
      case Routes.Main: {
        return 'icon-icon-spellbook-tab';
      }
      case Routes.Archery: {
        return 'icon-icon-bow-arrow-tab';
      }
      case Routes.Melee: {
        return 'icon-icon-sword-tab';
      }
      case Routes.Magic: {
        return 'icon-icon-magic-tab';
      }
      case Routes.Throwing: {
        return 'icon-icon-guild';
      }
      case Routes.Shout: {
        return 'icon-icon-history';
      }
      case Routes.Misc: {
        return 'icon-icon-metrics';
      }
      case Routes.Components: {
        return 'icon-icon-components-tab';
      }
      default: return '';
    }
  }
}
