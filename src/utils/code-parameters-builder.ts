import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';

/**
 * Code Parameter Group
 */
export interface CodeParameterGroup {
  /**
   * Detail
   *
   * @type {string}
   */
  detail: string;

  /**
   * Items
   */
  items: Record<string, CodeParameterGroup | CodeParameterItem>;
}

/**
 * Code Parameter Item
 */
export class CodeParameterItem<TValue = unknown> {
  /**
   * Specify for type validation
   */
  value: TValue = {} as TValue;

  constructor(
    public detail: string,
    public kind: CodeEditorSuggestionItemKind = CodeEditorSuggestionItemKind.Property
  ) {}
}

/**
 * Convert group to payload object
 */
export type PayloadForGroup<TGroup extends CodeParameterGroup> = {
  [Key in keyof TGroup['items']]: TGroup['items'][Key] extends CodeParameterGroup
    ? PayloadForGroup<TGroup['items'][Key]>
    : TGroup['items'][Key] extends CodeParameterItem
      ? TGroup['items'][Key]['value']
      : unknown;
};

/**
 * Code Parameters Builder
 */
export class CodeParametersBuilder<TGroup extends CodeParameterGroup> {
  /**
   * Built suggestions based on config
   */
  suggestions: CodeEditorSuggestionItem[] = [];

  constructor(group: TGroup, basePath = 'context') {
    this.suggestions.push({
      label: basePath,
      kind: CodeEditorSuggestionItemKind.Constant,
      detail: group.detail,
    });
    this.addSuggestions(basePath, group);
  }

  /**
   * Add suggestions
   */
  private addSuggestions(path: string, group: CodeParameterGroup): void {
    Object.entries(group.items).forEach(([key, value]) => {
      const itemPath = `${path}.${key}`;

      if ('items' in value) {
        this.suggestions.push({
          label: itemPath,
          detail: value.detail,
          kind: CodeEditorSuggestionItemKind.Property,
        });
        this.addSuggestions(itemPath, value);
        return;
      }

      this.suggestions.push({
        label: itemPath,
        detail: value.detail,
        kind: value.kind,
      });
    });
  }

  /**
   * Create payload method for type validation
   */
  create(payload: PayloadForGroup<TGroup>): PayloadForGroup<TGroup> {
    return payload;
  }
}
