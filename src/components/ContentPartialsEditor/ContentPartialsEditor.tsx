import { StandardEditorProps } from '@grafana/data';
import { Button, Collapse, Icon, InlineField, InlineFieldRow, Input, Stack, useStyles2 } from '@grafana/ui';
import React, { useCallback, useId, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

import { TEST_IDS } from '../../constants';
import { PanelOptions, PartialItemConfig } from '../../types';
import { reorder } from '../../utils';
import { getStyles } from './ContentPartialsEditor.styles';

/**
 * Properties
 */
type Props = StandardEditorProps<PartialItemConfig[], PanelOptions>;

/**
 * Get Item Style
 */
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
  /**
   * styles we need to apply on draggables
   */
  ...draggableStyle,
});

/**
 * Content Partials Editor
 */
export const ContentPartialsEditor: React.FC<Props> = ({ value, onChange }) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [items, setItems] = useState<PartialItemConfig[]>(value || []);
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemName, setNewItemName] = useState('');

  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({});

  const urlInputId = useId();
  const nameInputId = useId();

  /**
   * Change Items
   */
  const onChangeItems = useCallback(
    (items: PartialItemConfig[]) => {
      setItems(items);
      onChange(items);
    },
    [onChange]
  );

  /**
   * Drag End
   */
  const onDragEnd = useCallback(
    (result: DropResult) => {
      /**
       * Dropped outside the list
       */
      if (!result.destination) {
        return;
      }

      onChangeItems(reorder(items, result.source.index, result.destination.index));
    },
    [items, onChangeItems]
  );

  /**
   * Toggle collapse state for item
   */
  const onToggleItem = useCallback((name: string) => {
    setCollapseState((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }, []);

  /**
   * Add new item
   */
  const onAddNewItem = useCallback(() => {
    setNewItemUrl('');
    setNewItemName('');
    onChangeItems(items.concat([{ id: uuidv4(), url: newItemUrl, name: newItemName }]));
    onToggleItem(newItemName);
  }, [items, newItemName, newItemUrl, onChangeItems, onToggleItem]);

  /**
   * Change item
   */
  const onChangeItem = useCallback(
    (updatedItem: PartialItemConfig) => {
      onChangeItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    },
    [items, onChangeItems]
  );

  /**
   * Remove item
   */
  const onRemoveItem = useCallback(
    (id: string) => {
      onChangeItems(items.filter((item) => item.id !== id));
    },
    [items, onChangeItems]
  );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="groups-editor">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map(({ url, id, name }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      className={styles.group}
                    >
                      <Collapse
                        label={
                          <Stack flex={1} alignItems="center" justifyContent="space-between">
                            <div className={styles.groupHeader}>{`[${name}] ${url}`}</div>
                            <Stack alignItems="center" gap={0.5}>
                              <Button
                                aria-label="Remove partial"
                                icon="trash-alt"
                                variant="secondary"
                                fill="text"
                                size="sm"
                                className={styles.removeButton}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onRemoveItem(id);
                                }}
                                data-testid={TEST_IDS.partialsEditor.buttonRemove}
                              />
                              <div className={styles.dragHandle} onClick={(event) => {
                                event.stopPropagation();
                              }} {...provided.dragHandleProps}>
                                <Icon name="draggabledots" className={styles.dragIcon} />
                              </div>
                            </Stack>
                          </Stack>
                        }
                        isOpen={collapseState[id]}
                        onToggle={() => onToggleItem(id)}
                      >
                        <InlineFieldRow>
                          <InlineField grow label="URL">
                            <Input
                              id={urlInputId}
                              value={url}
                              onChange={(event) => {
                                onChangeItem({
                                  id,
                                  url: event.currentTarget.value,
                                  name,
                                });
                              }}
                              data-testid={TEST_IDS.partialsEditor.fieldUrl}
                            />
                          </InlineField>
                          <InlineField grow label="Name">
                            <Input
                              id={nameInputId}
                              value={name}
                              onChange={(event) => {
                                onChangeItem({
                                  id,
                                  name: event.currentTarget.value,
                                  url,
                                });
                              }}
                              data-testid={TEST_IDS.partialsEditor.fieldName}
                            />
                          </InlineField>
                        </InlineFieldRow>
                      </Collapse>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <InlineFieldRow className={styles.newGroup} data-testid={TEST_IDS.partialsEditor.newItem}>
        <InlineField label="New Partial" grow>
          <Input
            placeholder="URL"
            value={newItemUrl}
            onChange={(event) => setNewItemUrl(event.currentTarget.value)}
            data-testid={TEST_IDS.partialsEditor.newItemURL}
          />
        </InlineField>
        <InlineField label="Name" grow>
          <Input
            placeholder="name"
            value={newItemName}
            onChange={(event) => setNewItemName(event.currentTarget.value)}
            data-testid={TEST_IDS.partialsEditor.newItemName}
          />
        </InlineField>

        <Button
          icon="plus"
          title="Add Partial"
          disabled={!newItemName || !newItemUrl}
          onClick={onAddNewItem}
          data-testid={TEST_IDS.partialsEditor.buttonAddNew}
        >
          Add
        </Button>
      </InlineFieldRow>
    </>
  );
};
