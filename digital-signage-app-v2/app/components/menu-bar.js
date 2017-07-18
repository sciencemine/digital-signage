import Ember from 'ember';

export default Ember.Component.extend({
  displayVideos: [],
  menuListStyle: "",
  menuBarStyle: "",
  filterType: "All",
  useDropUp: false,
  renderMenu: false,
  menuTimeout: null,
  popoverTimeout: null,
  popoverShowDelay: 0.25,
  
  hidePopovers: function() {
    this.$('[data-toggle="popover"]').popover('hide');
  },
  init() {
    this._super(...arguments);
    this.set('displayVideos', this.get('videos'));

    let listStyle = "video-list__menu video-list--flex__menu";
    let barStyle = "menu-bar";

    switch (this.get('config.ui.menuLocale')) {
      case "right":
        this.setProperties({
          menuListStyle: listStyle + " video-list__right__menu video-list--flex--verticle__menu",
          menuBarStyle: barStyle + " menu-bar__right"
        });
        break;
      case "bottom":
        this.setProperties({
          menuListStyle: listStyle + " video-list__bottom__menu video-list--flex--horizontal__menu",
          menuBarStyle: barStyle + " menu-bar__bottom",
          useDropUp: true
        });
        break;
      case "left":
        this.setProperties({
          menuListStyle: listStyle + " video-list__left__menu video-list--flex--verticle__menu",
          menuBarStyle: barStyle + " menu-bar__left"
        });
        break;
      default:
        this.setProperties({
          menuListStyle: listStyle + " video-list__top__menu video-list--flex--horizontal__menu",
          menuBarStyle: barStyle + " menu-bar__top"
        });
        break;
    }
  },
  didRender() {
    if (this.$('[data-toggle="popover"]').length !== 0) {
      (function(component) {
        component.$('[data-toggle="popover"]').popover({
          trigger: 'hover focus',
          delay: {
            show: (component.get('popoverShowDelay') * 1000),
            hide: '100'
          }
        }).on('shown.bs.popover', function () {  
          let timeout = setTimeout(() => {
            component.hidePopovers();
          }, component.get('config.ui.popoverDwell') * 1000);
          
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

    let timeout = (function(component) {
      return setTimeout(() => {
        component.hidePopovers();
        component.set('renderMenu', false);
      }, component.get('config.ui.menuDwell') * 1000);
    }) (this);

    this.set('menuTimeout', timeout);
  },
  actions: {
    setMenuVideos(newAttributeID) {
      if (newAttributeID === -1) {
        this.setProperties({
          displayVideos: this.get('videos'),
          filterType: "All"
        });
      }
      else {
        let attr = this.get('attributes.' + newAttributeID);
        let attrVideos = attr.videos;

        this.set('displayVideos', []);

        for (var videoID = 0; videoID < attrVideos.length; videoID++) {
          this.get('displayVideos').pushObject(this.get('videos')[attrVideos[videoID]]);
        }

        this.set('filterType', attr.prettyName);
        this.hidePopovers();
      }
    },
    videoClicked(sender, videoData) {
      this.get('onClickCallback') (this, videoData);
    },
    doNothing() {}
  }
});
