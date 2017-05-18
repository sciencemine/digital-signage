import AbstractList from './abstract-list';

export default AbstractList.extend({
    attributeKeys: [],
    selectedStackIndex: 0,
    isMuted: true,
    isFlex: true,
    loop: true,
    
    init(){
        this._super(...arguments);
        this.set('attributeKeys', Object.keys(this.get('videos')));
    },
    actions:{
        select(event){
            this.get('onSelectedCallback') (this.get('videos')[this.get('selectedStackIndex')]);
            event.stopPropagation();    
        },
        cancel(event){
            this.get('cancelCallback');
            event.stopPropagation();
        },
        goPrevious(event){
            this.send('changeIndex', -1);
            event.stopPropagation();
        },
        goNext(event){
            this.send('changeIndex', 1);
            event.stopPropagation();
        },
        changeIndex(indexDelta){
            let arrLength = this.get('attributeKeys').length;
            let curIndex = parseInt(this.get('selectedStackIndex')) + arrLength;
            this.set('selectedStackIndex', (curIndex + indexDelta) % arrLength);
        },
        hover(index){
            this.set('selectedStackIndex', index);
        }
    }
});
