import { css, cx } from '@emotion/css';
import { CodeEditorMonacoOptions, InlineField, InlineFieldRow, PageToolbar, ToolbarButton, useStyles2 } from '@grafana/ui';
import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useCallback, useEffect, useState } from 'react';

import { TEST_IDS } from '../../constants';
import { getStyles } from './AutosizeCodeEditor.styles';

/**
 * Properties
 */
interface Props {
  /**
   * Monaco editor instance
   */
  monacoEditor: monacoType.editor.IStandaloneCodeEditor | null;

  /**
   * Set modal open state
   */
  setIsOpen: (isOpen: boolean) => void;

  /**
   * Current editor value
   */
  editorValue: string;

  /**
   * Whether this toolbar is inside the modal
   */
  isModal?: boolean;

  /**
   * Set monaco options
   */
  setCurrentMonacoOptions: (options: CodeEditorMonacoOptions) => void;

  /**
   * Current monaco options
   */
  currentMonacoOptions: CodeEditorMonacoOptions | undefined;

  /**
   * Whether mini map is shown
   */
  isShowMiniMap: boolean | undefined;

  /**
   * Set mini map visibility
   */
  setIsShowMiniMap: (show: boolean | ((prev: boolean) => boolean)) => void;

  /**
   * Whether editor is read-only
   */
  readOnly?: boolean;
}

/**
 * Toolbar
 */
export const Toolbar: React.FC<Props> = ({
  monacoEditor,
  setIsOpen,
  editorValue,
  isModal = false,
  setCurrentMonacoOptions,
  currentMonacoOptions,
  isShowMiniMap,
  setIsShowMiniMap,
  readOnly,
}) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Copy/Paste feedback message
   */
  const [feedbackMessage, setFeedbackMessage] = useState('');

  /**
   * Clear feedback message after 1 second
   */
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage('');
      }, 1000);
      return () => clearTimeout(timer);
    }
    return;
  }, [feedbackMessage]);

  /**
   * Toggle modal
   */
  const onToggleModal = useCallback(() => {
    setIsOpen(!isModal);
  }, [isModal, setIsOpen]);

  /**
   * Copy code to clipboard
   */
  const onCopy = useCallback(() => {
    navigator.clipboard
      .writeText(editorValue)
      .then(() => {
        setFeedbackMessage('Copied!');
      })
      .catch(() => {
        setFeedbackMessage('Copy failed');
      });
  }, [editorValue]);

  /**
   * Paste code from clipboard
   */
  const onPaste = useCallback(async () => {
    if (monacoEditor) {
      try {
        const selection = monacoEditor.getSelection();
        const clipboardText = await navigator.clipboard.readText();
        const range = {
          startLineNumber: selection?.startLineNumber || 1,
          startColumn: selection?.startColumn || 1,
          endLineNumber: selection?.endLineNumber || 1,
          endColumn: selection?.endColumn || 1,
        };
        monacoEditor.executeEdits('clipboard', [
          {
            range,
            text: clipboardText,
            forceMoveMarkers: false,
          },
        ]);
        monacoEditor.focus();
        setFeedbackMessage('Pasted!');
      } catch {
        setFeedbackMessage('Paste failed');
      }
    }
  }, [monacoEditor]);

  /**
   * Toggle word wrap
   */
  const onToggleWrap = useCallback(() => {
    const wordWrap = currentMonacoOptions?.wordWrap === 'on' ? 'off' : 'on';
    setCurrentMonacoOptions({ ...currentMonacoOptions, wordWrap });
  }, [currentMonacoOptions, setCurrentMonacoOptions]);

  /**
   * Toggle mini map
   */
  const onToggleMiniMap = useCallback(() => {
    setIsShowMiniMap((prev: boolean) => !prev);
  }, [setIsShowMiniMap]);

  return (
    <PageToolbar
      buttonOverflowAlignment="right"
      className={styles.toolbar}
      forceShowLeftItems={true}
      leftItems={[
        <ToolbarButton
          key="code-editor-button-modal"
          tooltip={isModal ? 'Collapse code editor' : 'Expand code editor'}
          icon={isModal ? 'compress-arrows' : 'expand-arrows-alt'}
          iconSize="lg"
          onClick={onToggleModal}
          data-testid={TEST_IDS.codeEditor.modalButton(isModal ? 'modal-close' : 'modal-open')}
        />,
      ]}
    >
      <InlineFieldRow className={styles.copyPasteSection}>
        <ToolbarButton
          className={styles.copyPasteIcon}
          tooltip="Copy code"
          icon="file-blank"
          iconSize="lg"
          onClick={onCopy}
          data-testid={TEST_IDS.codeEditor.copyButton}
        />
        <ToolbarButton
          disabled={readOnly}
          className={styles.copyPasteIcon}
          tooltip={readOnly ? 'Cannot edit in read-only mode' : 'Paste code'}
          icon="file-alt"
          iconSize="lg"
          onClick={onPaste}
          data-testid={TEST_IDS.codeEditor.pasteButton}
        />
        <InlineField
          className={cx(
            styles.copyPasteText,
            feedbackMessage
              ? css`
                  width: 45px;
                `
              : css`
                  width: 10px;
                `
          )}
          data-testid={TEST_IDS.codeEditor.copyPasteText}
        >
          <div className={cx(styles.text, feedbackMessage ? styles.textVisible : '')}>{feedbackMessage}</div>
        </InlineField>
      </InlineFieldRow>
      <ToolbarButton
        tooltip="Wrap code on new lines"
        icon="wrap-text"
        iconSize="lg"
        variant={currentMonacoOptions?.wordWrap === 'on' ? 'active' : 'default'}
        onClick={onToggleWrap}
        data-testid={TEST_IDS.codeEditor.wrapButton}
      />
      {editorValue && editorValue.length > 100 && (
        <ToolbarButton
          tooltip={isShowMiniMap ? 'Hide mini map' : 'Show mini map'}
          icon="gf-movepane-right"
          iconSize="lg"
          variant={isShowMiniMap ? 'active' : 'default'}
          onClick={onToggleMiniMap}
          data-testid={TEST_IDS.codeEditor.miniMapButton}
        />
      )}
    </PageToolbar>
  );
};
