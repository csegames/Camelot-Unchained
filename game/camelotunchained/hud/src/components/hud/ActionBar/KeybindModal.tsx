/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  background-color: gray;
  padding: 5px;
`;

export interface Props {
  onConfirmBind: (newBind: Binding) => void;
  onClose: (result: any) => void;
}

export class KeybindModal extends React.Component<Props> {
  private listenPromise: CancellablePromise<Binding>;
  public render() {
    return (
      <Container>
        Listening
        <button onMouseDown={this.cancel}>close</button>
      </Container>
    );
  }

  public componentDidMount() {
    this.startBind();
  }

  private startBind = () => {
    this.listenPromise = game.listenForKeyBindingAsync();
    this.listenPromise
      .then(this.onConfirmBind)
      .catch((fail) => {
        // TODO: handle failures better
        this.cancel();
        console.error('Key bind failed ' + JSON.stringify(fail));
      });
  }

  private onConfirmBind = (newBind: Binding) => {
    this.props.onConfirmBind(newBind);
    this.props.onClose('success');
  }

  private cancel = () => {
    if (this.listenPromise) {
      this.listenPromise.cancel();
      this.listenPromise = null;
    }

    this.props.onClose('cancel');
  }
}
