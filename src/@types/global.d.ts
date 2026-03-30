import { SceneObject } from '@grafana/scenes';

/**
 * __grafanaSceneContext type to prevent TS error
 */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __grafanaSceneContext?: SceneObject;
  }
}
