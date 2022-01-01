class Body {
    constructor(el){
        this.node = document.createElement('div');
        this.node.setAttribute('class', 'body');
        el.appendChild(this.node);
    }
}