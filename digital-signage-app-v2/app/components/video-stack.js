import Ember from 'ember';

export default Ember.Component.extend(
    {
        videoCount: Ember.computed('videos', function () {
            return Object.keys(this.get('videos')).length;
        }),
        rootVideo: Ember.computed('videos', function () {
            return this.get('videos')[Object.keys(this.get('videos'))[0]];
        }),
        actions: {
            stackClicked() {
                console.log('thing');
            },
            incrementSelected() {
                let arrayLength = this.get('keys').length;
                let curArrayPos = this.get('selectedVidPos');
                this.set('selectedVidPos', (curVidPos + 1) % arrayLength);
            },
            onHover() {

            }
        }
    });
