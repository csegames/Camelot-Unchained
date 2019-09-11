/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

interface ContainerProps extends React.HTMLProps<HTMLDivElement> {
  screenPos: Vec2f;
  scale: number;
}
const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  top: ${(props: ContainerProps) => props.screenPos.y}px;
  left: ${(props: ContainerProps) => props.screenPos.x}px;
  transform: ${(props: ContainerProps) => props.scale}px;
`;

const Diamond = styled.div`
  width: 15px;
  height: 15px;
  opacity: 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) => props.color};
  color: white;
  transform: rotate(45deg);
`;

export interface Props {
  index: number;
  color: string;
  degrees: number;
  scale: number;
  screenPos: Vec2f;
}

export function PlayerTracker(props: Props) {
  // function getAlignment() {
  //   // the game coordinate system hurts everyones brains so flip this around so we can think about it
  //   const backwardsDegrees = props.degrees;
  //   const degrees = 360 - backwardsDegrees;

  //   const isLeftNorth = degrees > 315 && degrees <= 360;
  //   const isRightNorth = degrees >= 0 && degrees <= 45;
  //   const isEast = degrees > 45 && degrees <= 135;
  //   const isSouth = degrees > 135 && degrees <= 225;

  //   let styles = {};
  //   let alignment: Alignment = null;
  //   if (isLeftNorth || isRightNorth) {
  //     // North - Top of screen
  //     alignment = Alignment.North;
  //     if (isLeftNorth) {
  //       styles = {
  //         top: 0,
  //         left: `${((degrees - 315) / 90) * 100}%`,
  //         transform: 'translateX(-50%)',
  //         transition: 'left 0.1s',
  //       }
  //     }

  //     if (isRightNorth) {
  //       styles = {
  //         top: 0,
  //         right: `${((45 - degrees) / 90) * 100}%`,
  //         transform: 'translateX(-50%)',
  //         transition: 'right 0.1s',
  //       }
  //     }
  //   } else if (isEast) {
  //     // East - Right of screen
  //     alignment = Alignment.East;
  //     styles = {
  //       right: 0,
  //       top: `${((90 - (135 - degrees)) / 90) * 100}%`,
  //       transform: 'translateY(-50%)',
  //       transition: 'top 0.1s',
  //     }
  //   } else if (isSouth) {
  //     // South - Bottom of screen
  //     alignment = Alignment.South;
  //     styles = {
  //       bottom: 0,
  //       right: `${((90 - (225 - degrees)) / 90) * 100}%`,
  //       transform: 'translateX(-50%)',
  //       transition: 'right 0.1s',
  //     }
  //   } else {
  //     // West - Left of Screen
  //     alignment = Alignment.West,
  //     styles = {
  //       left: 0,
  //       bottom: `${((90 - (315 - degrees)) / 90) * 100}%`,
  //       transform: 'translateY(-50%)',
  //       transition: 'bottom 0.1s',
  //     }
  //   }

  //   return {
  //     styles,
  //     alignment,
  //   }
  // }

  // const { alignment, styles } = getAlignment();
  return (
    <Container scale={props.scale} screenPos={props.screenPos}>
      <Diamond color={props.color}></Diamond>
    </Container>
  );
}
