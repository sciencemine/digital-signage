import Ember from 'ember';

export default Ember.Component.extend(
    {
        selectedVidPos: 0,
        keys: [],
        selectedStackIndex: 0,
        stackStyle: ' ',
        playerSize: '',
        isMuted: true,
        init() {
            this._super(...arguments);
            this.set('keys', Object.keys(this.get('videos')));
            switch(this.get('videoCount')){
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
        videoCount: Ember.computed('videos', function () {
            return Object.keys(this.get('videos')).length;
        }),
        curVideo: Ember.computed('videos', 'selectedVidPos', function () {
            return this.get('videos')[Object.keys(this.get('videos'))[this.get('selectedVidPos')]];
        }),
        actions: {
            stackClicked() {
                this.get('onClickCallback') (this.get('videos'), this.get('keys')[this.get('selectedVidPos')]);
            },
            getNextVid() {
                let arrayLength = this.get('keys').length;
                let curArrayPos = this.get('selectedVidPos');
                this.set('selectedVidPos', (curArrayPos + 1) % arrayLength);
           },
            hover() {
                this.get('onHoverCallback') (this.get('videos'),this.get('selectedStackIndex'));
            }
        }
    });
