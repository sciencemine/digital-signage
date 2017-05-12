import Ember from 'ember';

export default Ember.Component.extend(
    {
        selectedVidPos: 0,
        keys: [],
        selectedStackIndex: 0,
        init() {
            this._super(...arguments);
            this.set('keys', Object.keys(this.get('videos')));
        },
        videoCount: Ember.computed('videos', function () {
            return Object.keys(this.get('videos')).length;
        }),
        curVideo: Ember.computed('videos', 'selectedVidPos', function () {
            return this.get('videos')[Object.keys(this.get('videos'))[this.get('selectedVidPos')]];
        }),
        actions: {
            stackClicked() {
                console.log('thing');
            },
            getNextVid() {
                let arrayLength = this.get('keys').length;
                let curArrayPos = this.get('selectedVidPos');
                this.set('selectedVidPos', (curArrayPos + 1) % arrayLength);
                console.log(this.get('selectedVidPos'), curArrayPos, arrayLength); 
            },
            hover() {
                this.get('onHoverCallback') (this.get('selectedStackIndex'));
            }
        }
    });
