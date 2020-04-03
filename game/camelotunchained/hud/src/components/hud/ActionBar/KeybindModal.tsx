/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  width: 200px;
  height: 200px;
  background-color: gray;
  padding: 5px;
`;

export interface Props {
  keybindId: number;
  onConfirmBind: (newBind: Binding) => void;
  onClose: (result: any) => void;
}

export interface State {
  conflictingBind: Binding;
  conflicts: Keybind[];
}

export class KeybindModal extends React.Component<Props, State> {
  private listenPromise: CancellablePromise<Binding>;
  constructor(props: Props) {
    super(props);
    this.state = {
      conflictingBind: null,
      conflicts: [],
    };
  }

  public render() {
    return (
      this.state.conflictingBind === null ?
        <Container>
          Listening
          <button onClick={this.cancel}>close</button>
        </Container> :
        <Container>
          That bind clashes with {this.state.conflicts.map(k => k.description).toString()}. Continue?
          <button onClick={() => this.onSuccess(this.state.conflictingBind)}>Yes</button>
          <button onClick={this.cancel}>No</button>
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
    const conflicts = this.getKeybindConflicts(newBind);

    if (conflicts.length > 0) {
      this.setState({ conflictingBind: newBind, conflicts });
      return;
    }

    this.onSuccess(newBind);
  }

  private onSuccess = (newBind: Binding) => {
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

  private getKeybindConflicts(checkBind: Binding): Keybind[] {
    const sameAs: Keybind[] = [];
    Object.values(game.keybinds).forEach((keybind) => {
      if (this.props.keybindId === keybind.id) {
        return;
      }

      keybind.binds.forEach((bind) => {
        if (bind.value === checkBind.value) {
          sameAs.push(keybind as Keybind);
        }
      });
    });
    return sameAs;
  }
}
