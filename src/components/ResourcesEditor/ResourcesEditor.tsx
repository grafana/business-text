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
import { PanelOptions, Resource } from '../../types';
import { reorder } from '../../utils';
import { getStyles } from './ResourceEditor.styles';

/**
 * Properties
 */
type Props = StandardEditorProps<Resource[], PanelOptions>;

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
 * Resources Editor
 */
export const ResourcesEditor: React.FC<Props> = ({ value, onChange }) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [items, setItems] = useState<Resource[]>(value || []);
  const [newItem, setNewItem] = useState('');
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({});

  const urlInputId = useId();

  /**
   * Change Items
   */
  const onChangeItems = useCallback(
    (items: Resource[]) => {
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
    setNewItem('');
    onChangeItems(items.concat([{ id: uuidv4(), url: newItem }]));
    onToggleItem(newItem);
  }, [items, newItem, onChangeItems, onToggleItem]);

  /**
   * Change item
   */
  const onChangeItem = useCallback(
    (updatedItem: Resource) => {
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
              {items.map(({ url, id }, index) => (
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
                            <div className={styles.groupHeader}>{url}</div>
                            <Stack gap={0.5} alignItems="center">
                              <Button
                                aria-label="Remove resource"
                                icon="trash-alt"
                                variant="secondary"
                                fill="text"
                                size="sm"
                                className={styles.removeButton}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onRemoveItem(id);
                                }}
                                data-testid={TEST_IDS.resourcesEditor.buttonRemove}
                              />
                              <div className={styles.dragHandle} onClick={(event) => event.stopPropagation()} {...provided.dragHandleProps}>
                                <Icon name="draggabledots" className={styles.dragIcon} />
                              </div>
                            </Stack>
                          </Stack>
                        }
                        isOpen={collapseState[id]}
                        onToggle={() => onToggleItem(id)}
                      >
                        <InlineField grow label="URL">
                          <Input
                            id={urlInputId}
                            value={url}
                            onChange={(event) => {
                              onChangeItem({
                                id,
                                url: event.currentTarget.value,
                              });
                            }}
                            data-testid={TEST_IDS.resourcesEditor.fieldUrl}
                          />
                        </InlineField>
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

      <InlineFieldRow className={styles.newGroup} data-testid={TEST_IDS.resourcesEditor.newItem}>
        <InlineField label="New Resource" grow>
          <Input
            placeholder="URL"
            value={newItem}
            onChange={(event) => setNewItem(event.currentTarget.value)}
            data-testid={TEST_IDS.resourcesEditor.newItemName}
          />
        </InlineField>
        <Button
          icon="plus"
          title="Add Resource"
          disabled={!newItem}
          onClick={onAddNewItem}
          data-testid={TEST_IDS.resourcesEditor.buttonAddNew}
        >
          Add
        </Button>
      </InlineFieldRow>
    </>
  );
};
