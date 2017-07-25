import Ember from 'ember';

export default Ember.Component.extend({
    modelData: Ember.inject.service(),
    
    selectedVidAPos: 0,
    selectedVidBPos: 1,
    selectedStackIndex: 0,
    stackStyle: '',
    playerSize: '',
    isMuted: true,
    showVidA: true,
    isTeaser: true,
    
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
            default:
                this.set('stackStyle', 'vid-shadows--4');
                break;
        }
    },
    vidAid: Ember.computed('videos', 'selectedVidAPos', function() {
        return this.get(`videos.${this.get('selectedVidAPos')}`);
    }),
    videoA: Ember.computed('videos', 'selectedVidAPos', function() {
        return this.get(`modelData.videos.${this.get('vidAid')}`);
    }),
    vidBid: Ember.computed('videos', 'selectedVidBPos', function() {
        return this.get(`videos.${this.get('selectedVidBPos')}`);
    }),
    videoB: Ember.computed('videos', 'selectedVidBPos', function() {
        return this.get(`modelData.videos.${this.get('vidBid')}`);
    }),
    actions: {
        stackClicked() {
            this.get('onSelectedCallback') (this.get('selectedStackIndex'));
        },
        getNextVideoA() {
            let arrayLength = this.get('videos').length;
            
            if (arrayLength === 1) {
                return;
            }
            
            let curArrayPos = parseInt(this.get('selectedVidAPos'));

            this.setProperties({
                selectedVidAPos: (curArrayPos + 2) % arrayLength,
                showVidA: false
            });
        },
        getNextVideoB(){
            let arrayLength = this.get('videos').length;
            
            if (arrayLength === 1) {
                return;
            }
            
            let curArrayPos = parseInt(this.get('selectedVidBPos'));

            this.setProperties({
                selectedVidBPos: (curArrayPos + 2) % arrayLength,
                showVidA: true
            });
        },
        stackHovered() {
            this.get('onHoverCallback') (this.get('videos'), this.get('selectedStackIndex'));
        }
    }
});
