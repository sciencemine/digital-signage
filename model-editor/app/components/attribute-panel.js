import Ember from 'ember';

export default Ember.Component.extend({
  expanded: true,

  didRender() {
    if (this.$('[data-toggle="attributeTooltip"]').length !== 0) {
      this.$('[data-toggle="attributeTooltip"]').tooltip({
        trigger: 'hover focus',
        placement: 'auto',
        delay: {
          show: '250',
          hide: '100'
        }
      });
    }

    if (this.$('.attribute-list').length !== 0) {
      this.$('.attribute-list').scrollspy({
        target: '#attributeNav'
      });
    }
  },
  actions: {
    addAttribute() {
      this.get('updateModalCallback') ("Add Attribute", ".attributes.data.attribute");
    },
    editAttribute(path, key) {
      this.get('updateModalCallback') ("Edit Attribute", ".attributes.data.attribute", path, key);
    },
    toggleExpanded() {
      this.set('expanded', !this.get('expanded'));
      this.get('attributesExpandedCallback') (this.get('expanded'));
    }
  }
});
