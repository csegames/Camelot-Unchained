/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 20:52:19
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-17 12:49:16
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css, merge, voxMessage, VoxMessageStyles } from '../../styles';
import Select from '../Select';
import Label from '../Label';
import { GlobalState } from '../../services/session/reducer';
import { Message } from '../../services/types';
import ProgressBar from '../ProgressBar';

export interface VoxMessageReduxProps {
  dispatch?: (action: any) => void;
  message?: Message;
  total?: number;
  remaining?: number;
  status?: string;
  style?: Partial<VoxMessageStyles>;
}

export interface VoxMessageProps extends VoxMessageReduxProps {}
interface VoxMessageState {}

const select = (state: GlobalState, props: VoxMessageProps) : VoxMessageReduxProps => {
  return {
    message: state.job.message,
    status: state.job.status,
    total: state.job.totalCraftingTime,
    remaining: state.ui.remaining,
  };
};

const VoxMessage = (props: VoxMessageProps) => {
  const ss = StyleSheet.create(merge({}, voxMessage, props.style));
  const { message, total, remaining, status } = props;
  console.log('status: ' + status + ' total: ' + total + ' current: ' + remaining);
  return (
    <div className={
        'vox-message '
         + (message ? css(ss.container, ss[message.type]) : css(ss.container))
         }>
      <div>{message && message.message}</div>
      { status === 'Running' && remaining > 0
        && <ProgressBar
            total={total}
            current={remaining}
            color='lime'
            />
      }
    </div>
  );
};

export default connect(select)(VoxMessage);
