/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';

import { Ability } from 'gql/interfaces';
import { InnerRing } from './InnerRing';
import { OuterRing } from './OuterRing';
import { ContextMenu } from 'shared/ContextMenu';

type ContainerProps = { radius: number; acceptInput: boolean; } & React.HTMLProps<HTMLDivElement>;
export const Container = styled.div`
  pointer-events: ${(props: ContainerProps) => props.acceptInput ? 'all' : 'none'};
  position: absolute;
  border-radius: 50%;
  background-color: #ccc;
  width: ${(props: ContainerProps) => props.radius * 2}px;
  height: ${(props: ContainerProps) => props.radius * 2}px;
  left: 0;
  top: 0;
  cursor: pointer;

  &.NoWeapon {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: url(../images/skills/no-weapon.png);
      background-size: contain;
      filter: hue-rotate(-40deg);
      z-index: 10;
    }
  }

  &.NoAmmo {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: url(../images/skills/no-arrow.png);
      background-size: contain;
      filter: hue-rotate(-40deg);
      z-index: 10;
    }
  }
`;

const Icon = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
`;

const OverlayShadow = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  box-shadow: inset 5px 5px 1px rgba(255, 255, 255, 0.2),
    inset 2px 15px 5px rgba(255, 255, 255, 0.2),
    inset -1px -1px 2px rgba(0, 0, 0, 0.5),
    inset -3px -15px 45px rgba(0, 0, 0, 0.2),
    1px 5px 30px -4px rgba(0, 0, 0, 1);
`;

const KeybindInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: #ececec;
  text-align: center;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 30px, rgba(0, 0, 0, 0) 30px);
  border-radius: 0 0 600% 600%;
  font-weight: 600;
  text-shadow: -2px -2px 2px #000, 2px -2px 2px #000, -2px 2px 2px #000, 2px 2px 2px #000;
  font-size: 0.5em;
  line-height: 1em;
  padding-bottom: 0.5em;
`;

const QueuedStateTick = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 120%;
  height: 120%;
  z-index: 3;
  border-radius: 0;
  box-shadow: initial;
  background: url(../images/skills/queued-tick.png) no-repeat;
  background-size: 90%;
`;

export function AbilityIcon(props: { icon: string }) {
  const [icon, setIcon] = useState(props.icon);

  useEffect(() => {
    setIcon(props.icon);
  }, [props.icon]);

  function onError() {
    setIcon('images/unknown-item.jpg');
  }

  return (
    <Icon src={icon} onError={onError} />
  );
}

export interface ActionBtnProps extends Ability {
  keybind: string;
  slotId: number;
  keybindName: string;
  getContextMenuItems: () => any[];
  additionalStyles?: React.CSSProperties;
  disableInteractions?: boolean;
}

interface InjectedProps {
  uiContext: UIContext;
}

export interface State {
  abilityState: ImmutableAbilityState;
}

export type Props = ActionBtnProps & InjectedProps;

// tslint:disable-next-line:function-name
class ActionBtnWithInjectedProps extends React.Component<Props, State> {
  private evh: EventHandle;
  private interval: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      abilityState: cloneDeep(camelotunchained.game.abilityStates[props.id]),
    };
  }

  public render() {
    const theme = this.props.uiContext.currentTheme();
    const display = this.props.uiContext.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;
    const { abilityState } = this.state;
    const queued = (abilityState.status & AbilityButtonState.Queued) !== 0;

    return (
      <ContextMenu type="items" getItems={this.props.getContextMenuItems}>
        <Container
          {...display}
          acceptInput={!this.props.disableInteractions}
          onClick={this.onClick}
          style={this.props.additionalStyles}
          className={this.getErrorClassName()}
        >
          <AbilityIcon icon={this.props.icon} />
          <OverlayShadow />
          <KeybindInfo>{this.props.keybindName}</KeybindInfo>
          <InnerRing {...this.props} abilityState={abilityState} />
          <OuterRing {...this.props} abilityState={abilityState} />
          {queued && <QueuedStateTick />}
        </Container>
      </ContextMenu>
    );
  }

  public componentDidMount() {
    if (typeof this.props.id !== 'number') {
      return;
    }

    this.evh = camelotunchained.game.abilityStates[this.props.id].onUpdated(this.handleAbilityStateUpdate);
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.evh.clear();
      this.evh = camelotunchained.game.abilityStates[this.props.id].onUpdated(this.handleAbilityStateUpdate);

      this.setState({ abilityState: cloneDeep(camelotunchained.game.abilityStates[this.props.id]) });
    }
  }

  public componentWillUnmount() {
    if (this.evh) {
      this.evh.clear();
    }
  }

  private getErrorClassName = () => {
    if (BitFlag.hasBits(this.state.abilityState.error, AbilityButtonErrorFlag.NoWeapon)) {
      return 'NoWeapon';
    }

    if (BitFlag.hasBits(this.state.abilityState.error, AbilityButtonErrorFlag.NoAmmo)) {
      return 'NoAmmo';
    }

    return '';
  }

  private handleAbilityStateUpdate = () => {
    const abilityState = cloneDeep(camelotunchained.game.abilityStates[this.props.id]);
    if (BitFlag.hasBits(abilityState.status, AbilityButtonState.Preparation)) {
      window.clearInterval(this.interval);
      this.interval = window.setInterval(() => this.forceUpdate(), 66);
    } else {
      window.clearInterval(this.interval);
    }

    this.setState({ abilityState });
  }

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) {
      return;
    }

    if (this.props.disableInteractions) return;
    game.actions.activateSlottedAction(this.props.slotId);
  }
}

export function ActionBtn(props: ActionBtnProps) {
  const uiContext = React.useContext(UIContext);
  return (
    <ActionBtnWithInjectedProps uiContext={uiContext} {...props} />
  );
}
