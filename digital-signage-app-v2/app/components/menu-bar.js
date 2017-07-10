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
    let component = this;
	
    if (this.$('[data-toggle="popover"]').length !== 0){
      component.$('[data-toggle="popover"]').popover({
        trigger: 'hover focus',
        delay: {
          show: (component.get('popoverShowDelay') * 1000),
          hide: '100'
        }
      }).on('shown.bs.popover', function () {  
        let timeout = setTimeout(function () {
          component.$('[data-toggle="popover"]').popover('hide');
          component.send('hidePopovers');
        }, component.get('config.ui.popoverDwell') * 1000);
          
        clearTimeout(component.get('popoverTimeout'));
        component.set('popoverTimeout', timeout);
      });	
    }
  },

  mouseEnter() {
    this.set('renderMenu', true);
    
    clearTimeout(this.get('menuTimeout'));
  },

  mouseLeave() {
    var component = this;
    let timeout = setTimeout(() => {
      component.set('renderMenu', false);
    }, this.get('config.ui.menuDwell') * 1000);

    clearTimeout(this.get('menuTimeout'));
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
        let attributes = this.get('attributes.' + newAttributeID + '.videos');
        this.set('displayVideos', []);

        for (var videoID = 0; videoID < attributes.length; videoID++) {
          this.get('displayVideos').pushObject(this.get('videos')[attributes[videoID]]);
        }

        this.set('filterType', this.get('attributes.' + newAttributeID + '.prettyName'));
      }
    },
    videoClicked(sender, videoData) {
      this.set('renderMenu', false);
      this.get('onClickCallback') (this, videoData);
      this.send('hidePopovers');
    },
    doNothing() {},
    hidePopovers() {
      this.$('[data-toggle="popover"]').popover('hide');
    }
  }
});
