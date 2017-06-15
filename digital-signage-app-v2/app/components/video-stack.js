import Ember from 'ember';

export default Ember.Component.extend({
    selectedVidAPos: 0,
    selectedVidBPos: 0,
    selectedStackIndex: 0,
    stackStyle: '',
    playerSize: '',
    isMuted: true,
    showVidA: true,
    
    init() {
        this._super(...arguments);

        switch(this.get('videos').length){
            case 1:
                break;
            case 2:
                this.set('stackStyle', 'vid-shadows--2');
                break;
            case 3:
                this.set('stackStyle', 'vid-shadows--3');
                break;
            case 4:
                this.set('stackStyle', 'vid-shadows--4');
                break;
            default:
                this.set('stackStyle', 'vid-shadows--4');
                break;
        }
    },
    videoA: Ember.computed('videos', 'selectedVidAPos', function () {
        return this.get('videos')[this.get('selectedVidAPos')];
    }),
    videoB: Ember.computed('videos', 'selectedVidBPos', function () {
        return this.get('videos')[this.get('selectedVidBPos')];
    }),
    actions: {
        stackClicked() {
            this.get('onSelectedCallback') (this.get('videos'), (this.get('showVidA') ? this.get('selectedVidAPos') : this.get('selectedVidBPos')));
            
        },
        getNextVideoA() {
            let arrayLength = this.get('videos').length;
            if (arrayLength === 1) {
                return;
            }
            let curArrayPos = parseInt(this.get('selectedVidAPos'));
            this.set('selectedVidAPos', (curArrayPos + 2) % arrayLength);
            this.set('showVidA', false);        
        },
        getNextVideoB(){
            let arrayLength = this.get('videos').length;
            if (arrayLength === 1) {
                return;
            }
            let curArrayPos = parseInt(this.get('selectedVidBPos'));
            this.set('selectedVidBPos', (curArrayPos + 2) % arrayLength);
            this.set('showVidA', true);
        },

        stackHovered() {
            this.get('onHoverCallback') (this.get('videos'), this.get('selectedStackIndex'));
        }
    }
});
