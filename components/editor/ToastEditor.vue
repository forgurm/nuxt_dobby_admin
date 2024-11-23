<template>
  <div>
    <ClientOnly>
      <div ref="editorElement" class="border rounded-lg"></div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'

const props = defineProps<{
  initialValue?: string;
  height?: string;
}>()

const emit = defineEmits(['update:content', 'update:htmlContent'])

const editorElement = ref<HTMLElement | null>(null)
let editor: any = null

onMounted(() => {
  nextTick(() => {
    if (editorElement.value) {
      editor = new Editor({
        el: editorElement.value,
        height: props.height || '500px',
        initialValue: props.initialValue || '',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        hideModeSwitch: true,
        plugins: [colorSyntax],
        toolbarItems: [
          [{
            name: 'heading',
            tooltip: '제목 크기'
          }],
          [{
            name: 'bold',
            tooltip: '굵게'
          },
          {
            name: 'italic',
            tooltip: '기울임'
          }],
          [{
            name: 'ul',
            tooltip: '글머리 기호'
          },
          {
            name: 'ol',
            tooltip: '번호 매기기'
          }],
          [{
            name: 'table',
            tooltip: '표'
          },
          {
            name: 'image',
            tooltip: '이미지'
          }],
          [{
            name: 'color',
            tooltip: '글자 색상'
          }]
        ]
      })

      editor.on('change', () => {
        emit('update:content', editor.getMarkdown())
        emit('update:htmlContent', editor.getHTML())
      })
    }
  })
})

onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
  }
})

// 외부에서 에디터 내용을 설정할 수 있는 메서드
defineExpose({
  setMarkdown: (content: string) => {
    if (editor) {
      editor.setMarkdown(content)
    }
  },
  setHTML: (content: string) => {
    if (editor) {
      editor.setHTML(content)
    }
  }
})
</script>

<style scoped>
.toastui-editor-defaultUI {
  border: none !important;
}

.toastui-editor-defaultUI-toolbar {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 0.5rem;
}

.toastui-editor-main {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.toastui-editor-main .ProseMirror {
  padding: 1rem;
}
</style> 