import Ember from 'ember';

export default Ember.Component.extend({
  displayVideos: {},
  menuListStyle: "",
  filterType: "All",
  useDropUp: false,

  init() {
    this._super(...arguments);
    this.set('displayVideos', this.get('videos'));

    var style = "menu-list menu-list--flex";

    switch (this.get('config.ui.menuLocale')) {
      case "top": 
        this.set('menuListStyle', style + " menu-list__top menu-list--flex--horizontal");
        break;
      case "right": 
        this.set('menuListStyle', style + " menu-list__right menu-list--flex--verticle");
        break;
      case "bottom": 
        this.set('menuListStyle', style + " menu-list__bottom menu-list--flex--horizontal");
        this.set('useDropUp', true);
        break;
      case "left": 
        this.set('menuListStyle', style + " menu-list__left menu-list--flex--verticle");
        break;
      default: 
        this.set('menuListStyle', style + " menu-list__top menu-list--flex--horizontal");
        break;
    }
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
    baba() {
      
    }
  }
});
