/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';

/**
 * GameModel interface defines the structure and functionality of the global game object as presented by the game
 * client.
 *
 * If game is not defined, then the page has not yet been initialized by the game engine or we are not running in the
 * context of the game client.
 *
 * In the case that game is not defined, replacement methods are in place to mock Coherent engine support for functions
 * provided through this global api object.
 */

export interface GameModel {
}

/**
 * GameInterface is an extension of the GameModel adding additional features to the provided global game object in order
 * to maintain a single primary interface for all interactions with the game client itself.
 */
export interface GameInterface extends GameModel {
  /* -------------------------------------------------- */
  /* GAME CLIENT MODELS                                 */
  /* -------------------------------------------------- */

  /**
   * Player's current state. Includes health, name, and basic character data
   */
  selfPlayerState: SelfPlayerState;

  /**
   * Map of entities that the UI knows about by EntityID
   */
  entities: { [entityID: string]: AnyEntityState };

    /**
   * Map of ability states that the UI knows about by ability id
   */
  abilityStates: { [id: string]: AbilityState };

  /**
   * Current state of the abilitybar, temp - this defines the exact ability bar layout for now
   */
  abilityBarState: AbilityBarState;
}

export type DevGameInterface = InternalGameInterfaceExt;
