import { CodeEditor, CodeEditorMonacoOptions, Modal, useStyles2 } from '@grafana/ui';
import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useCallback, useEffect, useState } from 'react';

import { TEST_IDS } from '../../constants';

import { getStyles } from './AutosizeCodeEditor.styles';
import { Toolbar } from './Toolbar';

/**
 * Line height in pixels
 */
const LINE_HEIGHT = 18;

/**
 * Default min/max heights
 */
const DEFAULT_MIN_HEIGHT = 200;
const DEFAULT_MAX_HEIGHT = 1000;

/**
 * Calculate editor height based on content
 */
const calculateHeight = (value: string, minHeight?: number, maxHeight?: number): number => {
  const contentHeight = value.split('\n').length * LINE_HEIGHT;
  const min = minHeight || DEFAULT_MIN_HEIGHT;
  const max = maxHeight || DEFAULT_MAX_HEIGHT;

  if (contentHeight < min) {
    return min;
  }
  if (contentHeight > max) {
    return max;
  }
  return contentHeight;
};

/**
 * Properties
 */
type Props = React.ComponentProps<typeof CodeEditor> & {
  /**
   * Min height
   *
   * @type {number}
   */
  minHeight?: number;

  /**
   * Max height
   *
   * @type {number}
   */
  maxHeight?: number;

  /**
   * Should escape value
   *
   * @type {boolean}
   */
  isEscaping?: boolean;
};

/**
 * Autosize Code Editor
 */
export const AutosizeCodeEditor: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  minHeight,
  maxHeight,
  height,
  onEditorDidMount,
  monacoOptions,
  showMiniMap,
  isEscaping = false,
  ...rest
}) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * State
   */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowMiniMap, setIsShowMiniMap] = useState<boolean>(showMiniMap ?? false);
  const [currentMonacoOptions, setCurrentMonacoOptions] = useState<CodeEditorMonacoOptions | undefined>(monacoOptions);
  const [inlineEditor, setInlineEditor] = useState<monacoType.editor.IStandaloneCodeEditor | null>(null);
  const [modalEditor, setModalEditor] = useState<monacoType.editor.IStandaloneCodeEditor | null>(null);
  const [editorHeight, setEditorHeight] = useState(calculateHeight(value, minHeight, maxHeight));

  /**
   * Set end-of-line to LF if escaping
   */
  const setEol = useCallback(
    (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => {
      if (isEscaping) {
        const model = editor.getModel();
        model?.setEOL(monaco.editor.EndOfLineSequence.LF);
      }
    },
    [isEscaping]
  );

  /**
   * Mount handler for inline editor
   */
  const onInlineEditorMount = useCallback(
    (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => {
      setEol(editor, monaco);
      setInlineEditor(editor);
      onEditorDidMount?.(editor, monaco);
    },
    [setEol, onEditorDidMount]
  );

  /**
   * Mount handler for modal editor
   */
  const onModalEditorMount = useCallback(
    (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => {
      setEol(editor, monaco);
      setModalEditor(editor);

      if (inlineEditor) {
        const position = inlineEditor.getPosition();
        if (position) {
          editor.setPosition({
            lineNumber: position.lineNumber,
            column: position.column,
          });
          editor.focus();
          setTimeout(() => {
            editor.revealLineInCenter(position.lineNumber);
          }, 0);
        }
      }

      onEditorDidMount?.(editor, monaco);
    },
    [setEol, inlineEditor, onEditorDidMount]
  );

  /**
   * Change handler
   */
  const onValueChange = useCallback(
    (newValue: string) => {
      const result = isEscaping ? newValue.replaceAll('\n', '\\n') : newValue;
      onChange?.(result);
      setEditorHeight(calculateHeight(newValue, minHeight, maxHeight));
    },
    [maxHeight, minHeight, onChange, isEscaping]
  );

  /**
   * Blur handler
   */
  const onValueBlur = useCallback(
    (newValue: string) => {
      const result = isEscaping ? newValue.replaceAll('\n', '\\n') : newValue;
      onBlur?.(result);
    },
    [onBlur, isEscaping]
  );

  /**
   * Sync mini map visibility with prop changes
   */
  useEffect(() => {
    if (showMiniMap !== undefined) {
      setIsShowMiniMap(showMiniMap);
    }
  }, [showMiniMap]);

  /**
   * Update height on value change
   */
  useEffect(() => {
    setEditorHeight(calculateHeight(value, minHeight, maxHeight));
  }, [value, minHeight, maxHeight]);

  /**
   * Display value
   */
  const displayValue = isEscaping ? value.replaceAll('\\n', '\n') : value;

  return (
    <>
      <Toolbar
        editorValue={value}
        setIsOpen={setIsModalOpen}
        monacoEditor={inlineEditor}
        isShowMiniMap={isShowMiniMap}
        setIsShowMiniMap={setIsShowMiniMap}
        currentMonacoOptions={currentMonacoOptions}
        setCurrentMonacoOptions={setCurrentMonacoOptions}
        readOnly={rest.readOnly}
      />
      <CodeEditor
        value={displayValue}
        showMiniMap={isShowMiniMap}
        height={height ?? editorHeight}
        monacoOptions={currentMonacoOptions}
        onEditorDidMount={onInlineEditorMount}
        onChange={onValueChange}
        onBlur={onValueBlur}
        {...rest}
      />
      <Modal
        title="Code editor"
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        className={styles.modal}
        contentClassName={styles.modalBody}
        closeOnEscape={true}
        trapFocus={true}
      >
        <div className={styles.content} data-testid={TEST_IDS.codeEditor.modal}>
          <Toolbar
            isModal={true}
            editorValue={value}
            setIsOpen={setIsModalOpen}
            isShowMiniMap={isShowMiniMap}
            monacoEditor={modalEditor}
            setIsShowMiniMap={setIsShowMiniMap}
            currentMonacoOptions={currentMonacoOptions}
            setCurrentMonacoOptions={setCurrentMonacoOptions}
            readOnly={rest.readOnly}
          />
          <CodeEditor
            value={displayValue}
            showMiniMap={isShowMiniMap}
            containerStyles={styles.modalEditor}
            monacoOptions={currentMonacoOptions}
            onEditorDidMount={onModalEditorMount}
            onChange={onValueChange}
            onBlur={onValueBlur}
            {...rest}
          />
        </div>
      </Modal>
    </>
  );
};
