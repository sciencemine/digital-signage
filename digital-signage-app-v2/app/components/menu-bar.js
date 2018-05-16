import Ember from 'ember';

export default Ember.Component.extend({
  modelData: Ember.inject.service(),

  displayVideos: [ ],
  menuBarStyle: "",
  menuBarDirection: "",
  filterType: "All",
  useDropUp: false,
  renderMenu: true,
  menuTimeout: null,
  popoverTimeout: null,
  popoverShowDelay: 0.25,
  classNames: [ 'menu-overlay' ],

  hidePopovers() {
    this.$('[data-toggle="popover"]').popover('hide');
  },
  init() {
    this._super(...arguments);

    let modelData = this.get('modelData');

    if (Ember.isNone(modelData.get('data'))) {
      return;
    }

    this.set('displayVideos', Object.keys(modelData.get('videos')));

    switch (modelData.get('ui.menuLocale')) {
      case "right":
        this.setProperties({
          menuBarStyle: 'menu-right',
          menuBarDirection: 'vertical'
        });
        break;
      case "bottom":
        this.setProperties({
          menuBarStyle: 'menu-bottom',
          menuBarDirection: 'horizontal',
          useDropUp: true
        });
        break;
      case "left":
        this.setProperties({
          menuBarStyle: 'menu-left',
          menuBarDirection: 'vertical'
        });
        break;
      default:
        this.setProperties({
          menuBarStyle: 'menu-top',
          menuBarDirection: 'horizontal'
        });
        break;
    }

    this.mouseLeave();
  },
  didRender() {
    if (this.$('[data-toggle="popover"]').length !== 0) {
      let modelData = this.get('modelData');

      (function(component) {
        component.$('[data-toggle="popover"]').popover({
          trigger: 'hover focus',
          delay: {
            show: (modelData.get('ui.popoverShowDelay') * 1000),
            hide: '100'
          }
        }).on('shown.bs.popover', function () {
          let timeout = setTimeout(() => {
            component.hidePopovers();
          }, modelData.get('ui.popoverDwell') * 1000);

          clearTimeout(component.get('popoverTimeout'));

          component.set('popoverTimeout', timeout);
        });
      }) (this);
    }
  },
  mouseEnter() {
    this.set('renderMenu', true);

    clearTimeout(this.get('menuTimeout'));
  },
  mouseLeave() {
    clearTimeout(this.get('menuTimeout'));

    let timeout = setTimeout((component) => {
      component.hidePopovers();

      component.set('renderMenu', false);
    }, this.get('modelData.ui.menuDwell') * 1000, this);

    this.set('menuTimeout', timeout);
  },
  actions: {
    setMenuVideos(newAttributeID) {
      let modelData = this.get('modelData');

      if (newAttributeID === -1) {
        this.setProperties({
          displayVideos: Object.keys(modelData.get('videos')),
          filterType: "All"
        });
      }
      else {
        let attr = modelData.get(`attributes.${newAttributeID}`);

        this.setProperties({
          displayVideos: attr.videos,
          filterType: attr.prettyName
        });

        this.hidePopovers();
      }
    },
    videoClicked(videoId) {
      this.get('onClickCallback') (videoId);
    },
    toggleMenu() {
      this.mouseEnter();
    },
    doNothing() {}
  }
});
