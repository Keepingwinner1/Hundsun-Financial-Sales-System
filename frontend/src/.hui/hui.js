import '@tmp/router.js'
import { singleSpaVue, hCoreReference } from '@hsui/core'
require('@/index.js')
const { Model, options: appOptions } = hCoreReference
export const { bootstrap, mount, unmount } = singleSpaVue({
  Vue: Model,
  appOptions,
  destroyRootInstanceAtUnmount: true,
})
