import Ember from 'ember';

export default Ember.Component.extend({
  displayVideos: {},
  menuListStyle: "",
  menuBarStyle: "",
  filterType: "All",
  useDropUp: false,
  renderMenu: false,

  init() {
    this._super(...arguments);
    this.set('displayVideos', this.get('videos'));

    var listStyle = "video-list__menu video-list--flex__menu";
    var barStyle = "menu-bar";

    switch (this.get('config.ui.menuLocale')) {
      case "top": 
        this.set('menuListStyle', listStyle + " video-list__top__menu video-list--flex--horizontal__menu");
        this.set('menuBarStyle', barStyle + " menu-bar__top");
        break;
      case "right": 
        this.set('menuListStyle', listStyle + " video-list__right__menu video-list--flex--verticle__menu");
        this.set('menuBarStyle', barStyle + " menu-bar__right");
        break;
      case "bottom": 
        this.set('menuListStyle', listStyle + " video-list__bottom__menu video-list--flex--horizontal__menu");
        this.set('menuBarStyle', barStyle + " menu-bar__bottom");
        this.set('useDropUp', true);
        break;
      case "left": 
        this.set('menuListStyle', listStyle + " video-list__left__menu video-list--flex--verticle__menu");
        this.set('menuBarStyle', barStyle + " menu-bar__left");
        break;
      default: 
        this.set('menuListStyle', listStyle + " video-list__top__menu video-list--flex--horizontal__menu");
        this.set('menuBarStyle', barStyle + " menu-bar__top");
        break;
    }
  },

  mouseEnter() {
    this.set('renderMenu', true);
  },

  mouseLeave() {
    var component = this;

    setTimeout( function() {
      component.set('renderMenu', false);
    }, this.get('config.ui.menuDwell') * 1000);
  },

  actions: {
    setMenuVideos(newAttributeID) {
      if (newAttributeID === -1) {
        this.set('displayVideos', this.get('videos'));
        this.set('filterType', "All");
      }
      else {
        let tempVideos = {};

        let attributes = this.get('attributes.' + newAttributeID + '.videos');

        for (var videoID = 0; videoID < attributes.length; videoID++) {
          tempVideos[videoID] = this.get('videos')[attributes[videoID]];
        }

        this.set('displayVideos', tempVideos);
        this.set('filterType', this.get('attributes.' + newAttributeID + '.name'));
      }
    },
    videoClicked(videoData) {
      this.set('renderMenu', false);
      this.get('onClickCallback') (videoData);
    }
  }
});
