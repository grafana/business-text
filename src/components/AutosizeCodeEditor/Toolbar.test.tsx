import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { TEST_IDS } from '../../constants';

import { Toolbar } from './Toolbar';

/**
 * IntersectionObserver polyfill for PageToolbar
 */
beforeAll(() => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

/**
 * Mock clipboard API
 */
const mockWriteText = jest.fn().mockResolvedValue(undefined);
const mockReadText = jest.fn().mockResolvedValue('pasted text');

Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
    readText: mockReadText,
  },
});

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Mock Monaco editor
 */
const createMockEditor = () => ({
  getSelection: jest.fn().mockReturnValue({
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: 1,
    endColumn: 1,
  }),
  executeEdits: jest.fn(),
  focus: jest.fn(),
});

/**
 * Default props
 */
const defaultProps: React.ComponentProps<typeof Toolbar> = {
  monacoEditor: null,
  setIsOpen: jest.fn(),
  editorValue: 'test code',
  setCurrentMonacoOptions: jest.fn(),
  currentMonacoOptions: undefined,
  isShowMiniMap: false,
  setIsShowMiniMap: jest.fn(),
};

/**
 * Get Component
 */
const getComponent = (props: Partial<React.ComponentProps<typeof Toolbar>> = {}) => {
  return <Toolbar {...defaultProps} {...props} />;
};

/**
 * Toolbar
 */
describe('Toolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Rendering
   */
  describe('Rendering', () => {
    it('Should render expand button', () => {
      render(getComponent());

      expect(screen.getByTestId(TEST_IDS.codeEditor.modalButton('modal-open'))).toBeInTheDocument();
    });

    it('Should render collapse button when in modal mode', () => {
      render(getComponent({ isModal: true }));

      expect(screen.getByTestId(TEST_IDS.codeEditor.modalButton('modal-close'))).toBeInTheDocument();
    });

    it('Should render copy button', () => {
      render(getComponent());

      expect(screen.getByTestId(TEST_IDS.codeEditor.copyButton)).toBeInTheDocument();
    });

    it('Should render paste button', () => {
      render(getComponent());

      expect(screen.getByTestId(TEST_IDS.codeEditor.pasteButton)).toBeInTheDocument();
    });

    it('Should render wrap button', () => {
      render(getComponent());

      expect(screen.getByTestId(TEST_IDS.codeEditor.wrapButton)).toBeInTheDocument();
    });

    it('Should render mini map button when value exceeds 100 characters', () => {
      render(getComponent({ editorValue: 'a'.repeat(101) }));

      expect(screen.getByTestId(TEST_IDS.codeEditor.miniMapButton)).toBeInTheDocument();
    });

    it('Should not render mini map button when value is short', () => {
      render(getComponent({ editorValue: 'short' }));

      expect(screen.queryByTestId(TEST_IDS.codeEditor.miniMapButton)).not.toBeInTheDocument();
    });

    it('Should render copy paste text area', () => {
      render(getComponent());

      expect(screen.getByTestId(TEST_IDS.codeEditor.copyPasteText)).toBeInTheDocument();
    });
  });

  /**
   * Modal Toggle
   */
  describe('Modal Toggle', () => {
    it('Should call setIsOpen with true when expand is clicked', async () => {
      const setIsOpen = jest.fn();
      render(getComponent({ setIsOpen }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.modalButton('modal-open')));
      });

      expect(setIsOpen).toHaveBeenCalledWith(true);
    });

    it('Should call setIsOpen with false when collapse is clicked in modal', async () => {
      const setIsOpen = jest.fn();
      render(getComponent({ setIsOpen, isModal: true }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.modalButton('modal-close')));
      });

      expect(setIsOpen).toHaveBeenCalledWith(false);
    });
  });

  /**
   * Copy
   */
  describe('Copy', () => {
    it('Should copy editor value to clipboard', async () => {
      render(getComponent({ editorValue: 'hello world' }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.copyButton));
      });

      expect(mockWriteText).toHaveBeenCalledWith('hello world');
    });

    it('Should show Copied! feedback on success', async () => {
      render(getComponent());

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.copyButton));
      });

      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    it('Should show Copy failed feedback on error', async () => {
      mockWriteText.mockRejectedValueOnce(new Error('Permission denied'));

      render(getComponent());

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.copyButton));
      });

      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });

    it('Should clear feedback message after 1 second', async () => {
      render(getComponent());

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.copyButton));
      });

      expect(screen.getByText('Copied!')).toBeInTheDocument();

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });
  });

  /**
   * Paste
   */
  describe('Paste', () => {
    it('Should paste clipboard text into editor', async () => {
      const mockEditor = createMockEditor();
      render(getComponent({ monacoEditor: mockEditor as never }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.pasteButton));
      });

      expect(mockReadText).toHaveBeenCalled();
      expect(mockEditor.executeEdits).toHaveBeenCalledWith('clipboard', [
        {
          range: {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          },
          text: 'pasted text',
          forceMoveMarkers: false,
        },
      ]);
      expect(mockEditor.focus).toHaveBeenCalled();
    });

    it('Should show Pasted! feedback on success', async () => {
      const mockEditor = createMockEditor();
      render(getComponent({ monacoEditor: mockEditor as never }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.pasteButton));
      });

      expect(screen.getByText('Pasted!')).toBeInTheDocument();
    });

    it('Should show Paste failed feedback on error', async () => {
      mockReadText.mockRejectedValueOnce(new Error('Permission denied'));
      const mockEditor = createMockEditor();
      render(getComponent({ monacoEditor: mockEditor as never }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.pasteButton));
      });

      expect(screen.getByText('Paste failed')).toBeInTheDocument();
    });

    it('Should not paste when no editor instance', async () => {
      render(getComponent({ monacoEditor: null }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.pasteButton));
      });

      expect(mockReadText).not.toHaveBeenCalled();
    });

    it('Should use editor selection for paste range', async () => {
      const mockEditor = createMockEditor();
      mockEditor.getSelection.mockReturnValue({
        startLineNumber: 3,
        startColumn: 5,
        endLineNumber: 3,
        endColumn: 10,
      });
      render(getComponent({ monacoEditor: mockEditor as never }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.pasteButton));
      });

      expect(mockEditor.executeEdits).toHaveBeenCalledWith('clipboard', [
        {
          range: {
            startLineNumber: 3,
            startColumn: 5,
            endLineNumber: 3,
            endColumn: 10,
          },
          text: 'pasted text',
          forceMoveMarkers: false,
        },
      ]);
    });

    it('Should be disabled when readOnly is true', () => {
      render(getComponent({ readOnly: true }));

      const pasteButton = screen.getByTestId(TEST_IDS.codeEditor.pasteButton);
      expect(pasteButton).toBeDisabled();
    });
  });

  /**
   * Word Wrap
   */
  describe('Word Wrap', () => {
    it('Should toggle word wrap from off to on', async () => {
      const setCurrentMonacoOptions = jest.fn();
      render(getComponent({ setCurrentMonacoOptions, currentMonacoOptions: { wordWrap: 'off' } }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.wrapButton));
      });

      expect(setCurrentMonacoOptions).toHaveBeenCalledWith({ wordWrap: 'on' });
    });

    it('Should toggle word wrap from on to off', async () => {
      const setCurrentMonacoOptions = jest.fn();
      render(getComponent({ setCurrentMonacoOptions, currentMonacoOptions: { wordWrap: 'on' } }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.wrapButton));
      });

      expect(setCurrentMonacoOptions).toHaveBeenCalledWith({ wordWrap: 'off' });
    });

    it('Should enable word wrap when options are undefined', async () => {
      const setCurrentMonacoOptions = jest.fn();
      render(getComponent({ setCurrentMonacoOptions, currentMonacoOptions: undefined }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.wrapButton));
      });

      expect(setCurrentMonacoOptions).toHaveBeenCalledWith({ wordWrap: 'on' });
    });
  });

  /**
   * Mini Map
   */
  describe('Mini Map', () => {
    it('Should call setIsShowMiniMap with toggle function', async () => {
      const setIsShowMiniMap = jest.fn();
      render(getComponent({ editorValue: 'a'.repeat(101), setIsShowMiniMap }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.miniMapButton));
      });

      expect(setIsShowMiniMap).toHaveBeenCalledWith(expect.any(Function));
    });

    it('Should toggle mini map from false to true', async () => {
      const setIsShowMiniMap = jest.fn();
      render(getComponent({ editorValue: 'a'.repeat(101), setIsShowMiniMap, isShowMiniMap: false }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.miniMapButton));
      });

      /**
       * Verify the toggle function returns the opposite value
       */
      const toggleFn = setIsShowMiniMap.mock.calls[0][0];
      expect(toggleFn(false)).toBe(true);
      expect(toggleFn(true)).toBe(false);
    });
  });
});
