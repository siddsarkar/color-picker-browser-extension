import './style.css'

interface Rule {
  origin: string
  properties: {
    title: string
    color: string
  }
}

let activeTabOrigin = ''
const retrieveStorageObj = {
  rules: {},
  autoGroupTabs: false,
  showTabCount: false
}

chrome.storage.local.get(retrieveStorageObj, result => {
  // get active tab
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0]
    const activeTabUrl = new URL(activeTab.url || activeTab.pendingUrl || '')
    activeTabOrigin = activeTabUrl.origin

    const originInput = document.getElementById(
      'tab-group-origin'
    ) as HTMLInputElement
    const titleInput = document.getElementById(
      'tab-group-title'
    ) as HTMLInputElement
    const colorInput = document.getElementById(
      'tab-group-color'
    ) as HTMLInputElement
    originInput.value = activeTabOrigin
    titleInput.value = result.rules[activeTabOrigin]?.title || ''
    colorInput.value = result.rules[activeTabOrigin]?.color || ''
  })

  const autoGroupTabs = document.getElementById(
    'autoGroupTabs'
  ) as HTMLInputElement
  autoGroupTabs.checked = result.autoGroupTabs
  const showTabCount = document.getElementById(
    'showTabCount'
  ) as HTMLInputElement
  showTabCount.checked = result.showTabCount

  document.getElementsByName('options').forEach(element => {
    element.addEventListener('change', event => {
      const target = event.target as HTMLInputElement
      const name = target.id
      const value = target.checked
      chrome.storage.local.set({ [name]: value })
    })
  })

  const rules = result.rules as {
    [key: string]: {
      title: string
      color: string
    }
  }
  const rulesList = document.getElementById('rulesList') as HTMLUListElement

  for (const [origin, properties] of Object.entries(rules)) {
    const ruleContainer = document.createElement('div') as HTMLDivElement
    ruleContainer.classList.add('rule')
    const rule: Rule = { origin, properties }

    const ruleElement = document.createElement('li') as HTMLLIElement
    ruleElement.innerText = `${rule.origin}`

    const span = document.createElement('span') as HTMLSpanElement
    span.innerText = rule.properties.title
    span.style.background = rule.properties.color
    ruleElement.prepend(span)

    const deleteBtn = document.createElement('button') as HTMLButtonElement
    deleteBtn.innerText = 'Delete'
    deleteBtn.addEventListener('click', () => {
      chrome.storage.local.set({
        rules: {
          ...rules,
          [rule.origin]: undefined
        }
      })
      ruleContainer.remove()
    })

    ruleContainer.appendChild(ruleElement)
    ruleContainer.appendChild(deleteBtn)
    rulesList.appendChild(ruleContainer)
  }
})

const form = document.getElementById('addRuleForm') as HTMLFormElement
form.addEventListener('submit', _event => {
  const formData = new FormData(form)
  const title = formData.get('title') as string
  const color = formData.get('color') as string

  chrome.storage.local.get({ rules: {} }, result => {
    chrome.storage.local.set({
      rules: {
        ...result.rules,
        [activeTabOrigin]: { title, color }
      }
    })
  })
})

export {}
