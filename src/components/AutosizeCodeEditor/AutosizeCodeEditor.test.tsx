import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { TEST_IDS } from '../../constants';

import { AutosizeCodeEditor } from './AutosizeCodeEditor';

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
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  CodeEditor: jest.fn().mockImplementation((props) => (
    <textarea
      data-testid="mock-code-editor"
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
      onBlur={(e) => props.onBlur?.(e.target.value)}
    />
  )),
  Modal: jest.fn().mockImplementation(({ children, isOpen }) =>
    isOpen ? <div data-testid="mock-modal">{children}</div> : null
  ),
}));

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
 * Get Component
 */
const getComponent = (props: Partial<React.ComponentProps<typeof AutosizeCodeEditor>> = {}) => {
  return <AutosizeCodeEditor value="" language="javascript" showLineNumbers={true} {...props} />;
};

/**
 * Autosize Code Editor
 */
describe('AutosizeCodeEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Rendering
   */
  describe('Rendering', () => {
    it('Should render toolbar with expand button', () => {
      render(getComponent());

      expect(screen.getByTestId(TEST_IDS.codeEditor.modalButton('modal-open'))).toBeInTheDocument();
    });

    it('Should render copy and paste buttons', () => {
      render(getComponent());

      expect(screen.getByTestId(TEST_IDS.codeEditor.copyButton)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.codeEditor.pasteButton)).toBeInTheDocument();
    });

    it('Should render wrap button', () => {
      render(getComponent());

      expect(screen.getByTestId(TEST_IDS.codeEditor.wrapButton)).toBeInTheDocument();
    });

    it('Should render code editor', () => {
      render(getComponent());

      expect(screen.getByTestId('mock-code-editor')).toBeInTheDocument();
    });

    it('Should show mini map button when value exceeds 100 characters', () => {
      render(getComponent({ value: 'a'.repeat(101) }));

      expect(screen.getByTestId(TEST_IDS.codeEditor.miniMapButton)).toBeInTheDocument();
    });

    it('Should not show mini map button when value is short', () => {
      render(getComponent({ value: 'short' }));

      expect(screen.queryByTestId(TEST_IDS.codeEditor.miniMapButton)).not.toBeInTheDocument();
    });
  });

  /**
   * Modal
   */
  describe('Modal', () => {
    it('Should open modal when expand button is clicked', async () => {
      render(getComponent());

      expect(screen.queryByTestId(TEST_IDS.codeEditor.modal)).not.toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.modalButton('modal-open')));
      });

      expect(screen.getByTestId(TEST_IDS.codeEditor.modal)).toBeInTheDocument();
    });

    it('Should show collapse button inside modal', async () => {
      render(getComponent());

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.modalButton('modal-open')));
      });

      expect(screen.getByTestId(TEST_IDS.codeEditor.modalButton('modal-close'))).toBeInTheDocument();
    });
  });

  /**
   * Clipboard
   */
  describe('Clipboard', () => {
    it('Should copy editor value to clipboard', async () => {
      render(getComponent({ value: 'test code' }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.copyButton));
      });

      expect(mockWriteText).toHaveBeenCalledWith('test code');
    });

    it('Should show copied feedback message', async () => {
      render(getComponent({ value: 'test code' }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.copyButton));
      });

      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    it('Should clear feedback message after 1 second', async () => {
      render(getComponent({ value: 'test code' }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.copyButton));
      });

      expect(screen.getByText('Copied!')).toBeInTheDocument();

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });

    it('Should show failure message when copy fails', async () => {
      mockWriteText.mockRejectedValueOnce(new Error('Permission denied'));

      render(getComponent({ value: 'test code' }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.copyButton));
      });

      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });
  });

  /**
   * Word Wrap
   */
  describe('Word Wrap', () => {
    it('Should toggle word wrap on click', async () => {
      const { rerender } = render(getComponent({ monacoOptions: { wordWrap: 'off' } }));

      await act(async () => {
        fireEvent.click(screen.getByTestId(TEST_IDS.codeEditor.wrapButton));
      });

      /**
       * Re-render to verify state change propagated
       */
      rerender(getComponent({ monacoOptions: { wordWrap: 'off' } }));

      expect(screen.getByTestId(TEST_IDS.codeEditor.wrapButton)).toBeInTheDocument();
    });
  });

  /**
   * Escaping
   */
  describe('Escaping', () => {
    it('Should unescape value for display when isEscaping is true', () => {
      render(getComponent({ value: 'line1\\nline2', isEscaping: true }));

      const editor = screen.getByTestId('mock-code-editor') as HTMLTextAreaElement;
      expect(editor.value).toBe('line1\nline2');
    });

    it('Should pass value as-is when isEscaping is false', () => {
      render(getComponent({ value: 'line1\nline2', isEscaping: false }));

      const editor = screen.getByTestId('mock-code-editor') as HTMLTextAreaElement;
      expect(editor.value).toBe('line1\nline2');
    });
  });

  /**
   * Callbacks
   */
  describe('Callbacks', () => {
    it('Should call onChange when editor value changes', async () => {
      const onChange = jest.fn();
      render(getComponent({ onChange }));

      await act(async () => {
        fireEvent.change(screen.getByTestId('mock-code-editor'), { target: { value: 'new value' } });
      });

      expect(onChange).toHaveBeenCalledWith('new value');
    });

    it('Should escape newlines in onChange when isEscaping is true', async () => {
      const onChange = jest.fn();
      render(getComponent({ onChange, isEscaping: true }));

      await act(async () => {
        fireEvent.change(screen.getByTestId('mock-code-editor'), { target: { value: 'line1\nline2' } });
      });

      expect(onChange).toHaveBeenCalledWith('line1\\nline2');
    });

    it('Should call onBlur when editor loses focus', async () => {
      const onBlur = jest.fn();
      render(getComponent({ onBlur }));

      await act(async () => {
        fireEvent.blur(screen.getByTestId('mock-code-editor'));
      });

      expect(onBlur).toHaveBeenCalled();
    });

    it('Should escape newlines in onBlur when isEscaping is true', async () => {
      const onBlur = jest.fn();
      render(getComponent({ onBlur, isEscaping: true, value: 'line1\\nline2' }));

      await act(async () => {
        fireEvent.blur(screen.getByTestId('mock-code-editor'));
      });

      expect(onBlur).toHaveBeenCalled();
    });
  });

  /**
   * Height Calculation
   */
  describe('Height Calculation', () => {
    it('Should render with default min height for empty content', () => {
      render(getComponent({ value: '' }));

      expect(screen.getByTestId('mock-code-editor')).toBeInTheDocument();
    });

    it('Should render with content-based height for multi-line content', () => {
      const multiLine = Array.from({ length: 20 }, (_, i) => `line ${i}`).join('\n');
      render(getComponent({ value: multiLine }));

      expect(screen.getByTestId('mock-code-editor')).toBeInTheDocument();
    });
  });
});
