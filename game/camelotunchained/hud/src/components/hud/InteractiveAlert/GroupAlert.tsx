/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { webAPI } from '@csegames/library/lib/camelotunchained';
import { Container, InputContainer, Button, ButtonOverlay } from './lib/styles';
import { GroupAlert, IInteractiveAlert } from 'gql/interfaces';

// Utility Functions
export function groupInviteID(alert: GroupAlert) {
  return `${alert.kind}:${alert.forGroup}`;
}

export function handleNewGroupAlert(alertsList: IInteractiveAlert[], alert: GroupAlert) {
    const alerts = [...alertsList];

    if (alerts.findIndex(a => groupInviteID(a as GroupAlert) === groupInviteID(alert)) !== -1) {
      return {
        alerts,
      };
    }

    alerts.push(alert);
    return {
      alerts,
    };
}

export interface GroupAlertProps {
  alert: GroupAlert;
  remove: (alert: IInteractiveAlert) => void;
}

export class GroupAlertView extends React.Component<GroupAlertProps> {
  public render() {
    const { alert } = this.props;
    return (
      <Container>
        <h4>
          {alert.fromName || 'Unknown'} has invited you to the {alert.kind.replace('Invite', '')}{alert.forGroupName}.
        </h4>
        <InputContainer style={{zIndex: 9999}}>
          <Button onClick={this.joinGroup}><ButtonOverlay>Join {alert.kind.replace('Invite', '')}</ButtonOverlay></Button>
          <Button onClick={this.onDecline}><ButtonOverlay>Decline</ButtonOverlay></Button>
        </InputContainer>
      </Container>
    );
  }

  private joinGroup = () => {
    const { alert } = this.props;
    this.props.remove(alert);
    setTimeout(async () => {
      try {
        const res = await webAPI.GroupsAPI.JoinV1(
          webAPI.defaultConfig,
          alert.forGroup,
          alert.code);
        if (res.ok) {
          return
        }
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          console.error(data.FieldCodes[0].Message);
        } else {
          // This means api server failed AcceptInvite request but did not provide a message about what happened
          console.error('An error occured');
        }
      } catch (e) {
        console.error('There was an unhandled error');
      }
    });
  }

  private onDecline = async () => {
    // remove this alert from our ui
    const { alert } = this.props;
    this.props.remove(alert);
  }
}
