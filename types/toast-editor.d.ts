declare module '@toast-ui/editor' {
  interface EditorOptions {
    el: HTMLElement;
    height?: string;
    initialEditType?: 'markdown' | 'wysiwyg';
    previewStyle?: 'vertical' | 'tab';
    initialValue?: string;
    events?: {
      [key: string]: Function;
    };
    plugins?: any[];
    toolbarItems?: string[][];
    hideModeSwitch?: boolean;
  }

  export default class Editor {
    constructor(options: EditorOptions);
    getMarkdown(): string;
    getHTML(): string;
    setMarkdown(markdown: string): void;
    setHTML(html: string): void;
    destroy(): void;
  }
} 