import Tab from './tab'

/** Test helpers */
import { getFixture, clearFixture, jQueryMock } from '../../tests/helpers/fixture'

describe('ScrollSpy', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Tab.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('show', () => {
    it('should activate element by tab id', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li><a href="#home" role="tab">Home</a></li>',
        '  <li><a id="triggerProfile" role="tab" href="#profile">Profile</a></li>',
        '</ul>',
        '<ul><li id="home"/><li id="profile"/></ul>'
      ].join('')

      const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        expect(profileTriggerEl.getAttribute('aria-selected')).toEqual('true')
        done()
      })

      tab.show()
    })

    it('should activate element by tab id in ordered list', done => {
      fixtureEl.innerHTML = [
        '<ol class="nav nav-pills">',
        '  <li><a href="#home">Home</a></li>',
        '  <li><a id="triggerProfile" href="#profile">Profile</a></li>',
        '</ol>',
        '<ol><li id="home"/><li id="profile"/></ol>'
      ].join('')

      const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        done()
      })

      tab.show()
    })

    it('should activate element by tab id in nav list', done => {
      fixtureEl.innerHTML = [
        '<nav class="nav">',
        '  <a href="#home">Home</a>',
        '  <a id="triggerProfile" href="#profile">Profile</a>',
        '</nav>',
        '<nav><div id="home"></div><div id="profile"></div></nav>'
      ].join('')

      const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        done()
      })

      tab.show()
    })

    it('should activate element by tab id in list group', done => {
      fixtureEl.innerHTML = [
        '<div class="list-group">',
        '  <a href="#home">Home</a>',
        '  <a id="triggerProfile" href="#profile">Profile</a>',
        '</div>',
        '<nav><div id="home"></div><div id="profile"></div></nav>'
      ].join('')

      const profileTriggerEl = fixtureEl.querySelector('#triggerProfile')
      const tab = new Tab(profileTriggerEl)

      profileTriggerEl.addEventListener('shown.bs.tab', () => {
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        done()
      })

      tab.show()
    })

    it('should not fire shown when show is prevented', done => {
      fixtureEl.innerHTML = '<div class="nav"></div>'

      const navEl = fixtureEl.querySelector('div')
      const tab = new Tab(navEl)
      const expectDone = () => {
        setTimeout(() => {
          expect().nothing()
          done()
        }, 30)
      }

      navEl.addEventListener('show.bs.tab', ev => {
        ev.preventDefault()
        expectDone()
      })

      navEl.addEventListener('shown.bs.tab', () => {
        throw new Error('should not trigger shown event')
      })

      tab.show()
    })

    it('should not fire shown when tab is already active', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item"><a href="#home" class="nav-link active" role="tab">Home</a></li>',
        '  <li class="nav-item"><a href="#profile" class="nav-link" role="tab">Profile</a></li>',
        '</ul>',
        '<div class="tab-content">' +
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const triggerActive = fixtureEl.querySelector('a.active')
      const tab = new Tab(triggerActive)

      triggerActive.addEventListener('shown.bs.tab', () => {
        throw new Error('should not trigger shown event')
      })

      tab.show()
      setTimeout(() => {
        expect().nothing()
        done()
      }, 30)
    })

    it('should not fire shown when tab is disabled', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item"><a href="#home" class="nav-link active" role="tab">Home</a></li>',
        '  <li class="nav-item"><a href="#profile" class="nav-link disabled" role="tab">Profile</a></li>',
        '</ul>',
        '<div class="tab-content">' +
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const triggerDisabled = fixtureEl.querySelector('a.disabled')
      const tab = new Tab(triggerDisabled)

      triggerDisabled.addEventListener('shown.bs.tab', () => {
        throw new Error('should not trigger shown event')
      })

      tab.show()
      setTimeout(() => {
        expect().nothing()
        done()
      }, 30)
    })

    it('show and shown events should reference correct relatedTarget', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item"><a href="#home" class="nav-link active" role="tab">Home</a></li>',
        '  <li class="nav-item"><a id="triggerProfile" href="#profile" class="nav-link" role="tab">Profile</a></li>',
        '</ul>',
        '<div class="tab-content">' +
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const secondTabTrigger = fixtureEl.querySelector('#triggerProfile')
      const secondTab = new Tab(secondTabTrigger)

      secondTabTrigger.addEventListener('show.bs.tab', ev => {
        expect(ev.relatedTarget.hash).toEqual('#home')
      })

      secondTabTrigger.addEventListener('shown.bs.tab', ev => {
        expect(ev.relatedTarget.hash).toEqual('#home')
        expect(secondTabTrigger.getAttribute('aria-selected')).toEqual('true')
        expect(fixtureEl.querySelector('a:not(.active)').getAttribute('aria-selected')).toEqual('false')
        done()
      })

      secondTab.show()
    })

    it('should fire hide and hidden events', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li><a href="#home">Home</a></li>',
        '  <li><a href="#profile">Profile</a></li>',
        '</ul>'
      ].join('')

      const triggerList = fixtureEl.querySelectorAll('a')
      const firstTab = new Tab(triggerList[0])
      const secondTab = new Tab(triggerList[1])

      let hideCalled = false
      triggerList[0].addEventListener('shown.bs.tab', () => {
        secondTab.show()
      })

      triggerList[0].addEventListener('hide.bs.tab', ev => {
        hideCalled = true
        expect(ev.relatedTarget.hash).toEqual('#profile')
      })

      triggerList[0].addEventListener('hidden.bs.tab', ev => {
        expect(hideCalled).toEqual(true)
        expect(ev.relatedTarget.hash).toEqual('#profile')
        done()
      })

      firstTab.show()
    })

    it('should not fire hidden when hide is prevented', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav">',
        '  <li><a href="#home">Home</a></li>',
        '  <li><a href="#profile">Profile</a></li>',
        '</ul>'
      ].join('')

      const triggerList = fixtureEl.querySelectorAll('a')
      const firstTab = new Tab(triggerList[0])
      const secondTab = new Tab(triggerList[1])
      const expectDone = () => {
        setTimeout(() => {
          expect().nothing()
          done()
        }, 30)
      }

      triggerList[0].addEventListener('shown.bs.tab', () => {
        secondTab.show()
      })

      triggerList[0].addEventListener('hide.bs.tab', ev => {
        ev.preventDefault()
        expectDone()
      })

      triggerList[0].addEventListener('hidden.bs.tab', () => {
        throw new Error('should not trigger hidden')
      })

      firstTab.show()
    })
  })

  describe('dispose', () => {
    it('should dispose a tab', () => {
      fixtureEl.innerHTML = '<div></div>'

      const el = fixtureEl.querySelector('div')
      const tab = new Tab(fixtureEl.querySelector('div'))

      expect(Tab._getInstance(el)).not.toBeNull()

      tab.dispose()

      expect(Tab._getInstance(el)).toBeNull()
    })
  })

  describe('_jQueryInterface', () => {
    it('should create a tab', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      jQueryMock.fn.tab = Tab._jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock)

      expect(Tab._getInstance(div)).toBeDefined()
    })

    it('should not re create a tab', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tab = new Tab(div)

      jQueryMock.fn.tab = Tab._jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock)

      expect(Tab._getInstance(div)).toEqual(tab)
    })

    it('should call a tab method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const tab = new Tab(div)

      spyOn(tab, 'show')

      jQueryMock.fn.tab = Tab._jQueryInterface
      jQueryMock.elements = [div]

      jQueryMock.fn.tab.call(jQueryMock, 'show')

      expect(Tab._getInstance(div)).toEqual(tab)
      expect(tab.show).toHaveBeenCalled()
    })

    it('should throw error on undefined method', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const action = 'undefinedMethod'

      jQueryMock.fn.tab = Tab._jQueryInterface
      jQueryMock.elements = [div]

      try {
        jQueryMock.fn.tab.call(jQueryMock, action)
      } catch (error) {
        expect(error.message).toEqual(`No method named "${action}"`)
      }
    })
  })

  describe('_getInstance', () => {
    it('should return null if there is no instance', () => {
      expect(Tab._getInstance(fixtureEl)).toEqual(null)
    })

    it('should return this instance', () => {
      fixtureEl.innerHTML = '<div></div>'

      const divEl = fixtureEl.querySelector('div')
      const tab = new Tab(divEl)

      expect(Tab._getInstance(divEl)).toEqual(tab)
    })
  })

  describe('data-api', () => {
    it('should create dynamicaly a tab', done => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs" role="tablist">',
        '  <li class="nav-item"><a href="#home" class="nav-link active" role="tab">Home</a></li>',
        '  <li class="nav-item"><a id="triggerProfile" data-toggle="tab" href="#profile" class="nav-link" role="tab">Profile</a></li>',
        '</ul>',
        '<div class="tab-content">' +
        '  <div class="tab-pane active" id="home" role="tabpanel"></div>',
        '  <div class="tab-pane" id="profile" role="tabpanel"></div>',
        '</div>'
      ].join('')

      const secondTabTrigger = fixtureEl.querySelector('#triggerProfile')

      secondTabTrigger.addEventListener('shown.bs.tab', () => {
        expect(secondTabTrigger.classList.contains('active')).toEqual(true)
        expect(fixtureEl.querySelector('#profile').classList.contains('active')).toEqual(true)
        done()
      })

      secondTabTrigger.click()
    })

    it('selected tab should deactivate previous selected link in dropdown', () => {
      fixtureEl.innerHTML = [
        '<ul class="nav nav-tabs">',
        '  <li class="nav-item"><a class="nav-link" href="#home" data-toggle="tab">Home</a></li>',
        '  <li class="nav-item"><a class="nav-link" href="#profile" data-toggle="tab">Profile</a></li>',
        '  <li class="nav-item dropdown">',
        '    <a class="nav-link dropdown-toggle active" data-toggle="dropdown" href="#">Dropdown</>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item active" href="#dropdown1" id="dropdown1-tab" data-toggle="tab">@fat</a>',
        '      <a class="dropdown-item" href="#dropdown2" id="dropdown2-tab" data-toggle="tab">@mdo</a>',
        '    </div>',
        '  </li>',
        '</ul>'
      ].join('')

      const firstLiLinkEl = fixtureEl.querySelector('li:first-child a')

      firstLiLinkEl.click()
      expect(firstLiLinkEl.classList.contains('active')).toEqual(true)
      expect(fixtureEl.querySelector('li:last-child a').classList.contains('active')).toEqual(false)
      expect(fixtureEl.querySelector('li:last-child .dropdown-menu a:first-child').classList.contains('active')).toEqual(false)
    })
  })
})
