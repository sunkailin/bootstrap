$(function () {
  'use strict'

  var Tab = typeof window.bootstrap === 'undefined' ? window.Tab : window.bootstrap.Tab

  QUnit.module('tabs plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).tab, 'tabs method is defined')
  })

  QUnit.module('tabs', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapTab = $.fn.tab.noConflict()
    },
    afterEach: function () {
      $.fn.tab = $.fn.bootstrapTab
      delete $.fn.bootstrapTab
      $('#qunit-fixture').html('')
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.tab, 'undefined', 'tab was set back to undefined (org value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapTab()
    try {
      $el.bootstrapTab('noMethod')
    } catch (error) {
      assert.strictEqual(error.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $tab = $el.bootstrapTab()
    assert.ok($tab instanceof $, 'returns jquery collection')
    assert.strictEqual($tab[0], $el[0], 'collection contains element')
  })

  QUnit.test('Nested tabs', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var tabsHTML =
        '<nav class="nav nav-tabs" role="tablist">' +
        '  <a id="tab1" href="#x-tab1" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-tab1">Tab 1</a>' +
        '  <a href="#x-tab2" class="nav-item nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab2" aria-selected="true">Tab 2</a>' +
        '  <a href="#x-tab3" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-tab3">Tab 3</a>' +
        '</nav>' +
        '<div class="tab-content">' +
        '  <div class="tab-pane" id="x-tab1" role="tabpanel">' +
        '    <nav class="nav nav-tabs" role="tablist">' +
        '      <a href="#nested-tab1" class="nav-item nav-link active" data-toggle="tab" role="tab" aria-controls="x-tab1" aria-selected="true">Nested Tab 1</a>' +
        '      <a id="tabNested2" href="#nested-tab2" class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="x-profile">Nested Tab2</a>' +
        '    </nav>' +
        '    <div class="tab-content">' +
        '      <div class="tab-pane active" id="nested-tab1" role="tabpanel">Nested Tab1 Content</div>' +
        '      <div class="tab-pane" id="nested-tab2" role="tabpanel">Nested Tab2 Content</div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="tab-pane active" id="x-tab2" role="tabpanel">Tab2 Content</div>' +
        '  <div class="tab-pane" id="x-tab3" role="tabpanel">Tab3 Content</div>' +
        '</div>'

    $(tabsHTML).appendTo('#qunit-fixture')

    $('#tabNested2').on('shown.bs.tab', function () {
      assert.ok($('#x-tab1').hasClass('active'))
      done()
    })

    $('#tab1').on('shown.bs.tab', function () {
      assert.ok($('#x-tab1').hasClass('active'))
      $('#tabNested2')[0].click()
    })

    $('#tab1')[0].click()
  })

  QUnit.test('should not remove fade class if no active pane is present', function (assert) {
    assert.expect(6)
    var done = assert.async()
    var tabsHTML = '<ul class="nav nav-tabs" role="tablist">' +
      '<li class="nav-item"><a id="tab-home" href="#home" class="nav-link" data-toggle="tab" role="tab">Home</a></li>' +
      '<li class="nav-item"><a id="tab-profile" href="#profile" class="nav-link" data-toggle="tab" role="tab">Profile</a></li>' +
      '</ul>' +
      '<div class="tab-content">' +
      '<div class="tab-pane fade" id="home" role="tabpanel"></div>' +
      '<div class="tab-pane fade" id="profile" role="tabpanel"></div>' +
      '</div>'

    $(tabsHTML).appendTo('#qunit-fixture')
    $('#tab-profile')
      .on('shown.bs.tab', function () {
        assert.ok($('#profile').hasClass('fade'))
        assert.ok($('#profile').hasClass('show'))

        $('#tab-home')
          .on('shown.bs.tab', function () {
            assert.ok($('#profile').hasClass('fade'))
            assert.notOk($('#profile').hasClass('show'))
            assert.ok($('#home').hasClass('fade'))
            assert.ok($('#home').hasClass('show'))

            done()
          })

        $('#tab-home')[0].click()
      })

    $('#tab-profile')[0].click()
  })

  QUnit.test('should handle removed tabs', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var html = [
      '<ul class="nav nav-tabs" role="tablist">',
      '  <li class="nav-item">',
      '    <a class="nav-link nav-tab" href="#profile" role="tab" data-toggle="tab">',
      '      <button class="close"><span aria-hidden="true">&times;</span></button>',
      '    </a>',
      '  </li>',
      '  <li class="nav-item">',
      '    <a id="secondNav" class="nav-link nav-tab" href="#buzz" role="tab" data-toggle="tab">',
      '      <button class="close"><span aria-hidden="true">&times;</span></button>',
      '    </a>',
      '  </li>',
      '  <li class="nav-item">',
      '    <a class="nav-link nav-tab" href="#references" role="tab" data-toggle="tab">',
      '      <button id="btnClose" class="close"><span aria-hidden="true">&times;</span></button>',
      '    </a>',
      '  </li>',
      '</ul>',
      '<div class="tab-content">',
      '  <div role="tabpanel" class="tab-pane fade show active" id="profile">test 1</div>',
      '  <div role="tabpanel" class="tab-pane fade" id="buzz">test 2</div>',
      '  <div role="tabpanel" class="tab-pane fade" id="references">test 3</div>',
      '</div>'
    ].join('')

    $(html).appendTo('#qunit-fixture')

    $('#secondNav').on('shown.bs.tab', function () {
      assert.strictEqual($('.nav-tab').length, 2)
      done()
    })

    $('#btnClose').one('click', function () {
      var tabId = $(this).parents('a').attr('href')
      $(this).parents('li').remove()
      $(tabId).remove()
      $('.nav-tabs a:last').bootstrapTab('show')
    })
      .trigger($.Event('click'))
  })

  QUnit.test('should not add show class to tab panes if there is no `.fade` class', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var html = [
      '<ul class="nav nav-tabs" role="tablist">',
      '  <li class="nav-item">',
      '    <a class="nav-link nav-tab" href="#home" role="tab" data-toggle="tab">Home</a>',
      '  </li>',
      '  <li class="nav-item">',
      '    <a id="secondNav" class="nav-link nav-tab" href="#profile" role="tab" data-toggle="tab">Profile</a>',
      '  </li>',
      '</ul>',
      '<div class="tab-content">',
      '  <div role="tabpanel" class="tab-pane" id="home">test 1</div>',
      '  <div role="tabpanel" class="tab-pane" id="profile">test 2</div>',
      '</div>'
    ].join('')

    $(html).appendTo('#qunit-fixture')

    $('#secondNav').on('shown.bs.tab', function () {
      assert.strictEqual($('.show').length, 0)
      done()
    })

    $('#secondNav')[0].click()
  })

  QUnit.test('should add show class to tab panes if there is a `.fade` class', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var html = [
      '<ul class="nav nav-tabs" role="tablist">',
      '  <li class="nav-item">',
      '    <a class="nav-link nav-tab" href="#home" role="tab" data-toggle="tab">Home</a>',
      '  </li>',
      '  <li class="nav-item">',
      '    <a id="secondNav" class="nav-link nav-tab" href="#profile" role="tab" data-toggle="tab">Profile</a>',
      '  </li>',
      '</ul>',
      '<div class="tab-content">',
      '  <div role="tabpanel" class="tab-pane fade" id="home">test 1</div>',
      '  <div role="tabpanel" class="tab-pane fade" id="profile">test 2</div>',
      '</div>'
    ].join('')

    $(html).appendTo('#qunit-fixture')

    $('#secondNav').on('shown.bs.tab', function () {
      assert.strictEqual($('.show').length, 1)
      done()
    })

    $('#secondNav')[0].click()
  })

  QUnit.test('should return the version', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof Tab.VERSION, 'string')
  })
})
