import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'

declare module '#app' {
  interface NuxtApp {
    $initEditor: (element: HTMLElement, options?: any) => Editor
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      initEditor: (element: HTMLElement, options: any = {}) => {
        return new Editor({
          el: element,
          height: '500px',
          initialEditType: 'wysiwyg',
          previewStyle: 'vertical',
          plugins: [colorSyntax],
          hideModeSwitch: true,
          toolbarItems: [
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task', 'indent', 'outdent'],
            ['table', 'image', 'link'],
            ['code', 'codeblock'],
            ['scrollSync']
          ],
          ...options
        })
      }
    }
  }
}) 