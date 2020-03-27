/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { isEqual } from 'lodash';

export const MAX_GROUP_COUNT = 6;
export const MAX_CHILD_SLOT_COUNT = 4;

const ABILITY_BAR_VERSION = '0';
const ABILITY_BAR_VERSION_KEY = 'cu/game/abilities/barVersion';
const ABILITY_BAR_KEY = 'cu/game/abilities/bar';

export enum EditMode {
  Disabled,
  ActionEdit,
  SlotEdit,
}

interface ContextState {
  anchors: { [anchorId: number]: ActionViewAnchor };
  actions: { [actionId: number]: ActionPosition[] }; // action id => position map
  slots: { [slotId: number]: ActionSlot };

  editMode: EditMode;
  queuedAbilityId: number;
}

interface ContextFunctions {
  enableActionEditMode: () => void;
  enableSlotEditMode: () => void;
  disableEditMode: () => void;
  addGroup: (anchorId: number) => void;
  removeGroup: (anchorId: number, groupId: number) => void;
  activateGroup: (anchorId: number, groupIndex: number) => void;
  activateNextGroup: (anchorId: number) => void;
  activatePrevGroup: (anchorId: number) => void;
  addSlot: (parentId: number) => void;
  removeSlot: (slotId: number) => void;
  setSlotAngle: (slotId: number, angle: number) => void;
  addAction: (actionId: number, groupId: number, slotId: number) => void;
  addAndRemoveAction: (
    actionId: number,
    from: { groupId: number, slotId: number },
    target: { groupId: number, slotId: number }
  ) => void;
  removeAction: (actionId: number, groupId: number, slotId: number) => void;
  replaceOrSwapAction: (
    from: {
      actionId: number,
      groupId?: number,
      slotId?: number,
    },
    target: {
      actionId: number,
      groupId: number,
      slotId: number,
  }) => void;
  setAnchorPosition: (anchorId: number, position: Vec2f) => void;
  queueAddAction: (abilityId: number) => void;
  addAnchor: () => void;
  removeAnchor: (anchorId: number) => void;
}

export type ActionViewContextState = ContextState & ContextFunctions;

export interface ActionPosition {
  group: number; // group id
  slot: number; // slot id
}

export interface ActionViewAnchor {
  id: number;
  position: Vec2f;
  activeGroupIndex: number;
  groups: number[]; // ids of groups on this anchor in order.
  children: number[]; // direct child slots
}

export interface ActionSlot {
  id: number;
  angle: number;
  anchorId: number;
  actionId: number;
  parent: number;
  children: number[];
}

function noOp() {}
export function getDefaultActionViewContextState(): ContextState {
  return {
    anchors: {},
    actions: {},
    slots: {},
    editMode: EditMode.Disabled,
    queuedAbilityId: null,
  }
}

export const ActionViewContext = React.createContext<ActionViewContextState>({
  ...getDefaultActionViewContextState(),
  enableActionEditMode: noOp,
  enableSlotEditMode: noOp,
  disableEditMode: noOp,
  addGroup: noOp,
  removeGroup: noOp,
  activateGroup: noOp,
  activateNextGroup: noOp,
  activatePrevGroup: noOp,
  addSlot: noOp,
  removeSlot: noOp,
  setSlotAngle: noOp,
  addAction: noOp,
  addAndRemoveAction: noOp,
  removeAction: noOp,
  replaceOrSwapAction: noOp,
  setAnchorPosition: noOp,
  queueAddAction: noOp,
  addAnchor: noOp,
  removeAnchor: noOp,
});

export class ActionViewContextProvider extends React.Component<{}, ContextState> {
  private evh: EventHandle;
  private clientAbilitiesCache: ArrayMap<AbilityBarItem>;
  private isInitial: boolean = true;

  constructor(props: {}) {
    super(props);

    this.state = getDefaultActionViewContextState();
  }
  public render() {
    return (
      <ActionViewContext.Provider value={{
        ...this.state,
        enableActionEditMode: this.enableActionEditMode,
        enableSlotEditMode: this.enableSlotEditMode,
        disableEditMode: this.disableEditMode,
        addGroup: this.addGroup,
        removeGroup: this.removeGroup,
        activateGroup: this.activateGroup,
        activateNextGroup: this.activateNextGroup,
        activatePrevGroup: this.activatePrevGroup,
        addSlot: this.addSlot,
        removeSlot: this.removeSlot,
        setSlotAngle: this.setSlotAngle,
        addAction: this.addAction,
        addAndRemoveAction: this.addAndRemoveAction,
        removeAction: this.removeAction,
        replaceOrSwapAction: this.replaceOrSwapAction,
        setAnchorPosition: this.setAnchorPosition,
        queueAddAction: this.queueAddAction,
        addAnchor: this.addAnchor,
        removeAnchor: this.removeAnchor,
      }}>
        {this.props.children}
      </ActionViewContext.Provider>
    );
  }

  public componentDidMount() {
    if (camelotunchained.game.abilityBarState.isReady) {
      this.initializeActionView();
    }

    this.evh = camelotunchained.game.abilityBarState.onUpdated(() => {
      if (this.isInitial) {
        this.initializeActionView();
      }
      if (!this.clientAbilitiesCache ||
          !isEqual(this.clientAbilitiesCache, camelotunchained.game.abilityBarState.abilities)) {
        // TODO: New ability bar came in e.g. building - gnna handle this case later
      }
    });
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private updateLocalStorage = (state: ContextState) => {
    const persistedState = {
      anchors: state.anchors,
      actions: state.actions,
      slots: state.slots,
    }
    localStorage.setItem(ABILITY_BAR_KEY + game.characterID, JSON.stringify(persistedState));
  }

  private initializeActionView = () => {
    if (Object.keys(camelotunchained.game.abilityBarState.abilities).length === 0) {
      return;
    }

    let shouldOverrideLocalStorage = false;
    const cacheAbilityBarVersion = localStorage.getItem(ABILITY_BAR_VERSION_KEY + game.characterID);
    if (!cacheAbilityBarVersion || cacheAbilityBarVersion !== ABILITY_BAR_VERSION) {
      shouldOverrideLocalStorage = true;
      localStorage.setItem(ABILITY_BAR_VERSION_KEY + game.characterID, ABILITY_BAR_VERSION);
    }

    this.clientAbilitiesCache = camelotunchained.game.abilityBarState.abilities;
    let actionViewString = shouldOverrideLocalStorage === false ?
      localStorage.getItem(ABILITY_BAR_KEY + game.characterID) : null;

    let actionView: ContextState = null;
    if (actionViewString) {
      try {
        actionView = JSON.parse(actionViewString);
      } catch(e) {
        console.error('Failed to parse localStorage ability bar');
      }
    }

    if (!actionView) {
      actionView = this.getInitialCharacterActionView();
      this.updateLocalStorage(actionView);
    }

    Object.values(actionView.slots).forEach((slot) => {
      const groupId = actionView.actions[slot.actionId] ?
        actionView.actions[slot.actionId].find(a => a.slot === slot.id).group : null;
      if (!groupId) {
        console.error('There was an action without a group? ' + slot.actionId);
        return;
      }

      console.log('CONFIGURE SLOTTED: ' + slot.actionId);
      // game.configureSlottedAction(
      //   slot.anchorId,
      //   slot.id,
      //   actionView.actions[slot.actionId].find(a => a.slot === slot.id).group,
      //   slot.actionId,
      //   this.getBoundKeyValueForAbility(Number(slot.actionId)),
      // );
    });

    // game._cse_dev_exitActionBarEditMode();

    this.isInitial = false;
    this.setState({ ...actionView, editMode: EditMode.Disabled });
  }

  private getInitialCharacterActionView = () => {
    const anchorId = this.generateAnchorId(this.state.anchors);
    const groupId = this.generateGroupId(anchorId, this.state.anchors);

    const slots: { [slotId: number]: ActionSlot } = {};
    const actions: { [actionId: number]: ActionPosition[] } = {};

    let firstSlotId: number = null;
    let prevSlotId: number = null;
    let nextSlotId: number = null;
    const abilityBarArray = Object.values(camelotunchained.game.abilityBarState.abilities);
    abilityBarArray.forEach((ability, i) => {
      const currentSlotId = nextSlotId ? nextSlotId : 0;

      if (i === abilityBarArray.length - 1) {
        nextSlotId = null;
      } else {
        nextSlotId = currentSlotId + 1;
      }

      const actionId = ability.id;
      slots[currentSlotId] = {
        id: currentSlotId,
        angle: 0,
        anchorId,
        actionId,
        parent: prevSlotId === null ? anchorId : prevSlotId,
        children: nextSlotId ? [nextSlotId] : [],
      };

      actions[ability.id] = [{
        group: groupId,
        slot: currentSlotId,
      }]

      prevSlotId = currentSlotId;

      if (firstSlotId == null) {
        firstSlotId = currentSlotId;
      }
    });

    return {
      anchors: {
        [anchorId]: {
          id: anchorId,
          position: { x: 300, y: 300 },
          activeGroupIndex: 0,
          groups: [groupId],
          children: [firstSlotId],
        },
      },
      actions,
      slots,
      editMode: EditMode.Disabled,
      queuedAbilityId: null,
    } as ContextState;
  }

  // private getBoundKeyValueForAbility = (actionId: number) => {
  //   const keybindsClone = cloneDeep(game.keybinds);
  //   const keybind = Object.values(keybindsClone).find(keybind => keybind.description === "Ability " + (actionId + 1));
  //   return keybind.binds[0].value;
  // }

  private enableActionEditMode = () => {
    this.setState({ editMode: EditMode.ActionEdit });
    game._cse_dev_enterActionBarEditMode();
  }

  private enableSlotEditMode = () => {
    this.setState({ editMode: EditMode.SlotEdit });
    game._cse_dev_enterActionBarEditMode();
  }

  private disableEditMode = () => {
    this.setState({ editMode: EditMode.Disabled });
    game._cse_dev_exitActionBarEditMode();
  }

  private addGroup = (anchorId: number) => {
    const anchor = this.state.anchors[anchorId];

    if (anchor.groups.length >= MAX_GROUP_COUNT) {
      return;
    }

    const newGroupId = this.generateGroupId(anchorId, this.state.anchors);
    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchor.id]: {
          ...anchor,
          groups: [
            ...anchor.groups,
            newGroupId,
          ],
        },
      },
    };

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private removeGroup = (anchorId: number, groupId: number) => {
    const anchor = cloneDeep(this.state.anchors[anchorId]);

    if (anchor.groups.length === 1) return;

    anchor.groups = anchor.groups.remove(groupId);
    if (anchor.activeGroupIndex >= anchor.groups.length) {
      anchor.activeGroupIndex = anchor.groups.length - 1;
      this.clientSetActiveAnchorGroup(anchorId, anchor.groups[anchor.activeGroupIndex]);
    }

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchor.id]: anchor,
      },
    };

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private activateGroup = (anchorId: number, groupIndex: number) => {
    const anchor = this.state.anchors[anchorId];
    if (!anchor) {
      console.warn(`Anchor with id '${anchorId}' was not found.`);
      return;
    }

    if (groupIndex < 0 || groupIndex >= anchor.groups.length) {
      console.warn(`Invalid index provided to action. (index: ${groupIndex})`);
      return;
    }

    this.clientSetActiveAnchorGroup(anchorId, anchor.groups[groupIndex]);

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          ...anchor,
          activeGroupIndex: groupIndex,
        },
      },
    };

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private activateNextGroup = (anchorId: number) => {
    const anchor = this.state.anchors[anchorId];
    if (!anchor) {
      console.warn(`Could not activateNextGroup. An anchor with id '${anchorId}' was not found.`);
      return;
    }

    let index = anchor.activeGroupIndex + 1;
    if (index >= anchor.groups.length) {
      index = 0;
    }

    this.clientSetActiveAnchorGroup(anchorId, anchor.groups[index]);

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          ...anchor,
          activeGroupIndex: index,
        },
      },
    };

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private activatePrevGroup = (anchorId: number) => {
    const anchor = this.state.anchors[anchorId];
    if (!anchor) {
      console.warn(`Could not activatePrevGroup. An anchor with id '${anchorId}' was not found.`);
      return;
    }

    let index = anchor.activeGroupIndex - 1;
    if (index < 0) {
      index = anchor.groups.length - 1;
    }

    this.clientSetActiveAnchorGroup(anchorId, anchor.groups[index]);

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          ...anchor,
          activeGroupIndex: index,
        },
      },
    };

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private addSlot = (parentId: number) => {
    const newSlot: ActionSlot = {
      id: this.generateSlotId(this.state.slots),
      angle: 0,
      actionId: -1,
      anchorId: this.state.slots[parentId] ? this.state.slots[parentId].anchorId : parentId,
      parent: parentId,
      children: [],
    };

    if (this.state.anchors[parentId]) {
      // parent is an anchor
      const anchor = this.state.anchors[parentId];

      if (anchor.children.length + 1 > MAX_CHILD_SLOT_COUNT) {
        // don't add
        return;
      }

      const updatedState: ContextState = {
        ...this.state,
        anchors: {
          ...this.state.anchors,
          [anchor.id]: {
            ...anchor,
            children: [
              ...anchor.children,
              newSlot.id,
            ],
          },
        },
        slots: {
          ...this.state.slots,
          [newSlot.id]: newSlot,
        },
      }

      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
    } else {
      const parent = this.state.slots[parentId];

      if (parent.children.length + 1 > MAX_CHILD_SLOT_COUNT) {
        // don't add
        return;
      }

      const updatedState: ContextState = {
        ...this.state,
        slots: {
          ...this.state.slots,
          [parent.id]: {
            ...parent,
            children: [
              ...parent.children,
              newSlot.id,
            ],
          },
          [newSlot.id]: newSlot,
        },
      }
      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
    }
  }

  private removeSlot = (slotId: number) => {
    const slot = this.state.slots[slotId];
    if (!slot) {
      return;
    }

    if (this.state.anchors[slot.parent]) {

      // if this is the last slot, don't remove it
      if (slot.children.length === 0) {
        return;
      }

      // parent is an anchor
      const anchor = cloneDeep(this.state.anchors[slot.parent]);
      anchor.children.remove(slot.id);
      anchor.children.push(...slot.children);

      const slots = cloneDeep(this.state.slots);
      delete slots[slot.id];

      anchor.children.forEach((child) => {
        if (slots[child]) {
          slots[child].parent = anchor.id;
        }
      });

      const updatedState: ContextState = {
        ...this.state,
        anchors: {
          ...this.state.anchors,
          [anchor.id]: anchor,
        },
        slots,
      };

      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
    }

    const parent = cloneDeep(this.state.slots[slot.parent]);
    if (!parent) {
      console.warn(`Failed to remove slot as parent not found.`);
      return;
    }

    parent.children.remove(slot.id);
    parent.children.push(...slot.children);

    const slots = cloneDeep(this.state.slots);
    delete slots[slot.id];
    parent.children.forEach((child) => {
      if (slots[child]) slots[child].parent = parent.id;
    });
    slots[parent.id] = parent;

    const updatedState: ContextState = {
      ...this.state,
      slots,
    };
    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private setSlotAngle = (slotId: number, angle: number) => {
    const slot = this.state.slots[slotId];
    if (!slot) {
      console.warn(`Attempted to set angle on unknown slot. (id:${slotId})`);
      return;
    }

    const updatedState: ContextState = {
      ...this.state,
      slots: {
        ...this.state.slots,
        [slot.id]: {
          ...slot,
          angle,
        },
      },
    };
    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private addAction = (actionId: number, groupId: number, slotId: number) => {
    const positions = (this.state.actions[actionId] || []).slice();
    positions.push({
      group: groupId,
      slot: slotId,
    });

    const updatedState: ContextState = {
      ...this.state,
      actions: {
        ...this.state.actions,
        [actionId]: positions,
      },
      slots: {
        ...this.state.slots,
        [slotId]: {
          ...this.state.slots[slotId],
          actionId,
        },
      },
      queuedAbilityId: null,
    };

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private addAndRemoveAction = (
    actionId: number,
    from: {
      groupId: number,
      slotId: number,
    },
    target: {
      groupId: number,
      slotId: number,
    },
  ) => {
    const positions = (this.state.actions[actionId] || []).slice()
      .filter(a => !(a.group === from.groupId && a.slot === from.slotId));
    positions.push({
      group: target.groupId,
      slot: target.slotId,
    });

    const updatedState: ContextState = {
      ...this.state,
      actions: {
        ...this.state.actions,
        [actionId]: positions,
      },
    };
    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private removeAction = (actionId: number, groupId: number, slotId: number) => {
    const positions = (this.state.actions[actionId] || []).slice()
      .filter(a => !(a.group === groupId && a.slot === slotId));

    const updatedState: ContextState = {
      ...this.state,
      actions: {
        ...this.state.actions,
        [actionId]: positions,
      },
    };
    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private replaceOrSwapAction = (
    from: {
      actionId: number,
      groupId?: number,
      slotId?: number,
    },
    target: {
      actionId: number,
      groupId: number,
      slotId: number,
    }
  ) => {
    if (!target || !from) {
      return;
    }

    if (target.actionId === from.actionId) {
      // do nothing when the same actions
      return;
    }

    if (!from.groupId) {
      // replacing
      const targetPositions = (this.state.actions[target.actionId] || []).slice()
      .filter(a => !(a.group === target.groupId && a.slot === target.slotId));

      const fromPositions = (this.state.actions[from.actionId] || []).slice()
      .filter(a => !(a.group === from.groupId && a.slot === from.slotId));
      fromPositions.push({
        group: target.groupId,
        slot: target.slotId,
      });

      const updatedState: ContextState = {
        ...this.state,
        actions: {
          ...this.state.actions,
          [target.actionId]: targetPositions,
          [from.actionId]: fromPositions,
        },
        slots: {
          ...this.state.slots,
          [target.slotId]: {
            ...this.state.slots[target.slotId],
            actionId: from.actionId,
          }
        },
        queuedAbilityId: null,
      };

      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
    } else {
      // swapping
      const targetPositions = (this.state.actions[target.actionId] || []).slice()
        .filter(a => !(a.group === target.groupId && a.slot === target.slotId));
      targetPositions.push({
        group: from.groupId,
        slot: from.slotId,
      });

      const fromPositions = (this.state.actions[from.actionId] || []).slice()
        .filter(a => !(a.group === from.groupId && a.slot === from.slotId));
      fromPositions.push({
        group: target.groupId,
        slot: target.slotId,
      });

      const updatedState: ContextState = {
        ...this.state,
        actions: {
          ...this.state.actions,
          [target.actionId]: targetPositions,
          [from.actionId]: fromPositions,
        },
        slots: {
          ...this.state.slots,
          [from.slotId]: {
            ...this.state.slots[from.slotId],
            actionId: target.actionId,
          },
          [target.slotId]: {
            ...this.state.slots[target.slotId],
            actionId: from.actionId,
          }
        },
        queuedAbilityId: null,
      };

      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
    }
  }

  private setAnchorPosition = (anchorId: number, position: Vec2f) => {
    if (!this.state.anchors[anchorId]) {
      return;
    }

    const updatedState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          ...this.state.anchors[anchorId],
          position,
        },
      },
    }

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private queueAddAction = (abilityId: number) => {
    this.setState({ queuedAbilityId: abilityId });
    this.enableActionEditMode();
  }

  private addAnchor = () => {
    const anchorId = this.generateAnchorId(this.state.anchors);
    const groupId = this.generateGroupId(anchorId, this.state.anchors);

    const newSlot: ActionSlot = {
      id: this.generateSlotId(this.state.slots),
      angle: 0,
      actionId: -1,
      anchorId,
      parent: anchorId,
      children: [],
    };

    const updatedState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          id: anchorId,
          position: { x: 300, y: 400 },
          activeGroupIndex: 0,
          groups: [groupId],
          children: [newSlot.id],
        },
      },

      slots: {
        ...this.state.slots,
        [newSlot.id]: newSlot,
      }
    }

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private removeAnchor = (anchorId: number) => {
    if (Object.keys(this.state.anchors).length <= 1) {
      return;
    } 
    const anchorsClone = cloneDeep(this.state.anchors);
    const slotsClone = cloneDeep(this.state.slots);
    const actionsClone = cloneDeep(this.state.actions);

    const childrenToRemove = Object.values(slotsClone).filter((slot) => {
      return slot.anchorId === anchorId;
    });

    let actionSlotIndex = -1;
    childrenToRemove.forEach((childSlot) => {
      if (childSlot.actionId) {
        // Remove slot from actions map
        const action = actionsClone[childSlot.actionId];
        const slotIndex = action.findIndex(a => a.slot === childSlot.id);
        if (slotIndex !== -1) {
          actionSlotIndex = slotIndex;
        }

        if (actionSlotIndex !== 1) {
          actionsClone[childSlot.actionId].splice(actionSlotIndex, 1);
        }
      }

      // Remove slot from slots map
      delete slotsClone[childSlot.id];
    });

    // Remove anchor from anchors map
    delete anchorsClone[anchorId];

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...anchorsClone,
      },
      slots: {
        ...slotsClone,
      },
      actions: {
        ...actionsClone,
      },
    };

    this.setState(updatedState);
  }

  private clientSetActiveAnchorGroup = (anchorId: number, groupId: number) => {
    game.setActiveAnchorGroup(anchorId, groupId);
  }

  private generateAnchorId = (anchors: { [anchorId: number]: ActionViewAnchor }): number => {
    const sortedAnchors = Object.values(anchors).sort((a, b) => {
      return b.id - a.id;
    });

    const lastAnchor = sortedAnchors[sortedAnchors.length - 1];

    if (!lastAnchor) {
      return 0;
    }

    return lastAnchor.id + 1;
  }

  private generateGroupId = (anchorId: number, anchors: { [anchorId: number]: ActionViewAnchor }): number => {
    if (!anchors[anchorId]) {
      return 0;
    }

    const sortedGroups = anchors[anchorId].groups.sort((a, b) => {
      return b - a;
    });

    return sortedGroups[sortedGroups.length - 1] + 1;
  }

  private generateSlotId = (slots: { [slotId: number]: ActionSlot }, isNext?: boolean): number => {
    const sortedSlots = Object.values(slots).sort((a, b) => b.id - a.id);
    const lastSlot = sortedSlots[sortedSlots.length - 1];

    if (!lastSlot) {
      return 0;
    }

    return isNext ? lastSlot.id + 2 : lastSlot.id + 1;
  }
}
