/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';


import * as base from '../../ItemShared/InventoryBase';
import InventoryFooter from './InventoryFooter';
import { InventorySlotItemDef } from '../../../lib/itemInterfaces';
import eventNames, { InventoryDataTransfer, DropItemPayload } from '../../../lib/itemEvents';
import { InventoryContext, MoveInventoryItemPayload } from '../../ItemShared/InventoryContext';
import { slotDimensions } from './InventorySlot';
import {
  FullScreenContext,
  calcRowAndSlots,
  hasActiveFilterButtons,
  hasFilterText,
} from '../../../lib/utils';
import { InventoryItem, CUQuery, SecureTradeState } from 'gql/interfaces';

export interface InventoryBodyStyles {
  inventoryBody: React.CSSProperties;
  inventoryBodyInnerContainer: React.CSSProperties;
  inventoryContent: React.CSSProperties;
  backgroundImg: React.CSSProperties;
  refreshContainer: React.CSSProperties;
  refreshTitle: React.CSSProperties;
  refreshButton: React.CSSProperties;
}

const Container = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
`;

const InnerContainer = styled.div`
  flex: 1;
  overflow: auto;
  -webkit-backface-visibility: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  -webkit-backface-visibility: hidden;
  align-items: center;
  position: relative;
`;

const RefreshContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  pointer-events: all;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const RefreshTitle = styled.div`
  font-size: 35px;
  color: white;
`;

const RefreshButton = styled.div`
  width: 50px;
  height: 50px;
  font-size: 35px;
  color: white;
  cursor: pointer;
  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export interface InjectedInventoryBodyProps {
  graphql: GraphQLResult<Pick<CUQuery, 'myInventory'>>;
  myTradeItems: InventoryItem.Fragment[];
  myTradeState: SecureTradeState;
  stackGroupIdToItemIDs: {[id: string]: string[]};
  inventoryItems: InventoryItem.Fragment[];
  containerIdToDrawerInfo: base.ContainerIdToDrawerInfo;
  slotNumberToItem: base.SlotNumberToItem;
  itemIdToInfo: base.ItemIDToInfo;
  itemIDToStackGroupID: {[id: string]: string};
  visibleComponentRight: string;
  visibleComponentLeft: string;
  invBodyDimensions: {
    width: number;
    height: number;
  };
  initializeInventory: () => void;
  onChangeInventoryItems: (inventoryItems: InventoryItem.Fragment[]) => void;
  onChangeContainerIdToDrawerInfo: (containerIdToDrawerInfo: base.ContainerIdToDrawerInfo) => void;
  onChangeStackGroupIdToItemIDs: (stackGroupIdToItemIDs: {[id: string]: string[]}) => void;
  onMoveInventoryItem: (payload: MoveInventoryItemPayload) => void;
}

export interface InventoryBodyProps {
  styles?: Partial<InventoryBodyStyles>;
  onChangeInvBodyDimensions: (invBodyDimensions: { width: number; height: number; }) => void;
}

export type InventoryBodyComponentProps = InjectedInventoryBodyProps & InventoryBodyProps & base.InventoryBaseWithQLProps;

export interface InventoryBodyState extends base.InventoryBaseState {
}

class InventoryBody extends React.Component<InventoryBodyComponentProps, InventoryBodyState> {
  private static minSlots = 200;
  private eventHandles: EventHandle[] = [];
  private bodyRef: HTMLDivElement;

  // a counter that is incremented each time a new
  // stack group id is generated that is used in
  // generateing the stack group id

  constructor(props: InventoryBodyComponentProps) {
    super(props);
    this.state = {
      ...base.defaultInventoryBaseState(),
    };
  }
  public render() {
    let slotNumberToItem = this.props.slotNumberToItem;
    let itemIdToInfo = this.props.itemIdToInfo;

    if (hasActiveFilterButtons(this.props.activeFilters) || hasFilterText(this.props.searchValue)) {
      // Is being filtered
      const filteredData = base.distributeFilteredItems({
        itemData: { items: this.props.inventoryItems },
        stackGroupIdToItemIDs: this.props.stackGroupIdToItemIDs,
        itemIdToInfo: this.props.itemIdToInfo,
        slotNumberToItem: this.props.slotNumberToItem,
        itemIDToStackGroupID: this.props.itemIDToStackGroupID,
        activeFilters: this.props.activeFilters,
        searchValue: this.props.searchValue,
        slotCount: this.state.slotCount,
      });
      slotNumberToItem = filteredData.slotNumberToItem;
      itemIdToInfo = filteredData.itemIdToInfo;
    }

    const { rows, rowData } = base.createRowElements({
      state: this.state,
      props: this.props,
      itemData: { items: this.props.inventoryItems },
      onDropOnZone: this.onDropOnZone,
      syncWithServer: this.props.graphql.refetch,
      bodyWidth: this.props.invBodyDimensions.width,
      myTradeItems: this.props.myTradeItems,
      myTradeState: this.props.myTradeState,
      stackGroupIdToItemIDs: this.props.stackGroupIdToItemIDs,
      slotNumberToItem,
      itemIdToInfo,
    });

    const buttonDisabled = base.allInventoryFooterButtonsDisabled(this.props);
    const removeAndPruneDisabled = buttonDisabled || (base.allInventoryFooterButtonsDisabled(this.props) ||
      base.inventoryFooterRemoveAndPruneButtonDisabled(rowData, this.props.invBodyDimensions.height));

    const { graphql } = this.props;
    const showLoading = graphql.loading;
    const showError = graphql.lastError && graphql.lastError !== 'OK';
    return (
      <Container>
        {showLoading &&
          <RefreshContainer>
            <RefreshTitle>Loading...</RefreshTitle>
          </RefreshContainer>
        }
        {showError &&
          <RefreshContainer>
            <RefreshTitle>Could not retrieve items. Click to try again.</RefreshTitle>
            <RefreshButton onClick={this.props.graphql.refetch}><i className='fa fa-refresh' /></RefreshButton>
          </RefreshContainer>
        }
        <InnerContainer ref={(r: HTMLDivElement) => this.bodyRef = r} className='cse-ui-scroller-thumbonly-brown'>
          <Content>{rows}</Content>
        </InnerContainer>
        <InventoryFooter
          onAddRowClick={this.addRowOfSlots}
          onRemoveRowClick={() => this.removeRowOfSlots(rowData)}
          onPruneRowsClick={() => this.pruneRowsOfSlots(rowData)}
          addRowButtonDisabled={buttonDisabled}
          removeRowButtonDisabled={removeAndPruneDisabled}
          pruneRowsButtonDisabled={removeAndPruneDisabled}
          itemCount={graphql.data && graphql.data.myInventory ? graphql.data.myInventory.itemCount : 0}
          totalMass={graphql.data && graphql.data.myInventory ? graphql.data.myInventory.totalMass : 0}
        />
      </Container>
    );
  }

  public componentDidMount() {
    this.initializeSlotsData();
    setTimeout(() => this.initializeBodyDimensions(), 1);
    window.addEventListener('resize', this.onWindowResize);
    this.eventHandles.push(game.on(eventNames.updateInventoryItems, this.onUpdateInventoryOnEquip));
    this.eventHandles.push(game.on(eventNames.onDropItem, (payload: DropItemPayload) =>
      base.dropItemRequest(payload.inventoryItem.item)));
    game.itemPlacementMode.requestCancel();
  }

  public componentDidUpdate(prevProps: InventoryBodyComponentProps) {
    if (!_.isEqual(this.props.invBodyDimensions, prevProps.invBodyDimensions)) {
      this.initializeSlotsData();
    }
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
    window.removeEventListener('resize', () => this.initializeBodyDimensions(true));
  }

  private handleQueryResult = (result: GraphQLResult<InventoryBodyGQL.Query>) => {
    if (!result || result.loading || result.lastError !== 'OK') return result;
    if (!_.isEqual(result.data.myInventory.items, this.props.inventoryItems)) {
      this.props.onChangeInventoryItems(result.data.myInventory.items);
    } else {
      this.setState(() => this.internalInit(this.state, this.props));
    }
    return result;
  }

  private refetch = async () => {
    if (!this.graphql) return;
    this.graphql.refetch();
    game.trigger('refetch-character-info');
  }

  private onWindowResize = () => {
    this.initializeBodyDimensions(true);
    this.initializeInventory();
  }

  private initializeBodyDimensions = (override?: boolean) => {
    if (!this.bodyRef) return;
    if (!this.props.invBodyDimensions.width || !this.props.invBodyDimensions.height || override) {
      const { clientHeight, clientWidth } = this.bodyRef;
      this.props.onChangeInvBodyDimensions({ height: clientHeight, width: clientWidth });
    }
  }

  // set up rows from scratch / works as a re-initialize as well
  private initializeSlotsData = () => {
    this.setState(this.internalInit);
  }

  // should not be called outside of initializeSlotsData
  private internalInit = (state: InventoryBodyState) => {
    if (!this.bodyRef || !this.props.invBodyDimensions.height || !this.props.invBodyDimensions.width) {
      return;
    }
    const itemCount = this.props.inventoryItems && this.props.inventoryItems.length;
    const rowsAndSlots = calcRowAndSlots(
      { height: this.props.invBodyDimensions.height, width: this.props.invBodyDimensions.width },
      slotDimensions,
      Math.max(InventoryBody.minSlots, itemCount),
    );

    return {
      ...state,
      ...rowsAndSlots,
    };
  }

  private onDropOnZone = (dragItemData: InventoryDataTransfer,
                          dropZoneData: InventoryDataTransfer) => {
    // this function only gets called for inventory items, containers take care of their own state.
    this.setState((state, props) => {
      return props.onMoveInventoryItem({
        dragItemData,
        dropZoneData,
        state,
        props,
        containerIdToDrawerInfo: props.containerIdToDrawerInfo,
        stackGroupIdToItemIDs: props.stackGroupIdToItemIDs,
        inventoryItems: props.inventoryItems,
      });
    });
  }

  private addRowOfSlots = () => {
    this.setState(base.addRowOfSlots);
  }

  private removeRowOfSlots = (rowData: InventorySlotItemDef[][]) => {
    this.setState(state => base.removeRowOfSlots(state, rowData, this.props.invBodyDimensions.height));
  }

  private pruneRowsOfSlots = (rowData: InventorySlotItemDef[][]) => {
    this.setState(state => base.pruneRowsOfSlots(state, rowData, this.props.invBodyDimensions.height));
  }
}

class InventoryBodyWithInjectedContext extends React.Component<InventoryBodyProps & base.InventoryBaseProps> {
  public render() {
    return (
      <FullScreenContext.Consumer>
        {({
            myTradeItems,
            myTradeState,
            visibleComponentLeft,
            visibleComponentRight,
            invBodyDimensions,
          }) => {
          return (
            <InventoryContext.Consumer>
              {({
                graphql,
                inventoryItems,
                containerIdToDrawerInfo,
                stackGroupIdToItemIDs,
                slotNumberToItem,
                itemIdToInfo,
                itemIDToStackGroupID,
                initializeInventory,
                onChangeContainerIdToDrawerInfo,
                onChangeStackGroupIdToItemIDs,
                onChangeInventoryItems,
                onMoveInventoryItem,
              }) => {
                return (
                  <InventoryBody
                    {...this.props}
                    graphql={graphql}
                    inventoryItems={inventoryItems}
                    myTradeItems={myTradeItems}
                    myTradeState={myTradeState}
                    stackGroupIdToItemIDs={stackGroupIdToItemIDs}
                    containerIdToDrawerInfo={containerIdToDrawerInfo}
                    slotNumberToItem={slotNumberToItem}
                    itemIdToInfo={itemIdToInfo}
                    itemIDToStackGroupID={itemIDToStackGroupID}
                    visibleComponentLeft={visibleComponentLeft}
                    visibleComponentRight={visibleComponentRight}
                    invBodyDimensions={invBodyDimensions}
                    initializeInventory={initializeInventory}
                    onChangeInventoryItems={onChangeInventoryItems}
                    onChangeContainerIdToDrawerInfo={onChangeContainerIdToDrawerInfo}
                    onChangeStackGroupIdToItemIDs={onChangeStackGroupIdToItemIDs}
                    onMoveInventoryItem={onMoveInventoryItem}
                  />
                );
              }}
            </InventoryContext.Consumer>
          );
        }}
      </FullScreenContext.Consumer>
    );
  }
}

export default InventoryBodyWithInjectedContext;
