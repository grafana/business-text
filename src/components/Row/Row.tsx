import {
  AlertErrorPayload,
  AlertPayload,
  AppEvents,
  EventBus,
  getLocale,
  InterpolateFunction,
  TimeRange,
} from '@grafana/data';
import { getAppEvents, locationService } from '@grafana/runtime';
import { TimeZone } from '@grafana/schema';
import { useTheme2 } from '@grafana/ui';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { RowItem } from 'types';

import { TEST_IDS } from '../../constants';
import { useDashboardRefresh } from '../../hooks';
import { afterRenderCodeParameters, createExecutionCode } from '../../utils';

/**
 * Properties
 */
export interface Props {
  /**
   * Event Bus
   *
   * @type {EventBus}
   */
  eventBus: EventBus;

  /**
   * Replace Variables
   *
   * @type {InterpolateFunction}
   */
  replaceVariables: InterpolateFunction;

  /**
   * Item
   *
   * @type {RowItem}
   */
  item: RowItem;

  /**
   * Class Name
   *
   * @type {string}
   */
  className: string;

  /**
   * After Render Function
   *
   * @type {string}
   */
  afterRender: string;

  /**
   * Time range of the current dashboard
   *
   * @type {TimeRange}
   */
  timeRange: TimeRange;

  /**
   * Time zone of the current dashboard
   *
   * @type {TimeZone}
   */
  timeZone: TimeZone;

  /**
   * Get User Preference
   */
  getUserPreference: (key: string) => Promise<unknown>;

  /**
   * Set User Preference
   */
  setUserPreference: <T>(key: string, data: T) => Promise<T>;

  /**
   * Render increment from Grafana's PanelProps
   * Used to trigger onContentReady JS after renders introduced by core (e.g. variable changes)
   */
  renderCounter: number;
}

/**
 * Row
 */
export const Row: React.FC<Props> = ({
  renderCounter,
  className,
  item,
  afterRender,
  replaceVariables,
  eventBus,
  timeRange,
  timeZone,
  getUserPreference,
  setUserPreference,
}) => {
  /**
   * Row Ref
   */
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Theme and Styles
   */
  const theme = useTheme2();

  /**
   * Events
   */
  const appEvents = getAppEvents();

  const notifySuccess = useCallback(
    (payload: AlertPayload) => appEvents.publish({ type: AppEvents.alertSuccess.name, payload }),
    [appEvents]
  );

  const notifyError = useCallback(
    (payload: AlertErrorPayload) => appEvents.publish({ type: AppEvents.alertError.name, payload }),
    [appEvents]
  );

  /**
   * Refresh dashboard
   */
  const refreshDashboard = useDashboardRefresh();

  /**
   * Function This
   */
  const functionThis = useRef({});

  /**
   * Memoize the dangerouslySetInnerHTML payload so its object reference is stable while the html
   * is unchanged. React 19's updateProperties re-applies dangerouslySetInnerHTML on any reference
   * change, which (with a fresh object literal each render) re-sets innerHTML on every re-render and
   * wipes imperative DOM changes made in afterRender (e.g. on a panel hover/select re-render).
   */
  const innerHtml = useMemo(() => ({ __html: item.html }), [item.html]);

  /**
   * Run After Render Function
   */
  useEffect(() => {
    let unsubscribe: unknown = null;
    if (ref.current && afterRender) {
      const func = createExecutionCode('context', afterRender);

      unsubscribe = func.call(
        functionThis.current,
        afterRenderCodeParameters.create({
          element: ref.current,
          data: item.data,
          panelData: item.panelData,
          dataFrame: item.dataFrame,
          grafana: {
            theme,
            notifySuccess,
            notifyError,
            timeRange,
            timeZone,
            getLocale,
            replaceVariables,
            eventBus,
            locationService,
            refresh: () => refreshDashboard(),
            getUserPreference,
            setUserPreference,
          },
        })
      );
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [
    afterRender,
    eventBus,
    getUserPreference,
    item.data,
    item.dataFrame,
    item.panelData,
    notifyError,
    notifySuccess,
    refreshDashboard,
    replaceVariables,
    setUserPreference,
    theme,
    timeRange,
    timeZone,
    // Need to include render counter or grafana can trigger re-rendering of the panel without firing the on content ready JS
    renderCounter,
  ]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={innerHtml}
      data-testid={TEST_IDS.text.content}
    />
  );
};
