/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, css, merge, progressBar, ProgressBarStyles } from '../styles';

interface ProgressBarProps {
  total: number;
  current: number;
  color: string;
  style?: Partial<ProgressBarStyles>;
}


const ProgressBar = (props: ProgressBarProps) => {
  const ss = StyleSheet.create(merge({}, progressBar, props.style));
  return <div className={css(ss.progressBar)} style={{
    width: (100 - (props.current / props.total * 100)).toFixed(2) + '%',
    backgroundColor: props.color,
  }}/>;
};

export default ProgressBar;
