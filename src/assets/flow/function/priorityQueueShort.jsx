export class PriorityQueueShort {
    constructor() {
      this.collection = [];
    }
  
    enqueue(element) {
      if (this.isEmpty()) {
        this.collection.push(element);
      } else {
        let added = false;
        for (let i = 0; i < this.collection.length; i++) {
          if (element.distance < this.collection[i].distance) {
            this.collection.splice(i, 1, element);
            added = true;
            break;
          }
        }
        if (!added) {
          this.collection.push(element);
        }
      }
    }
  
    dequeue() {
      return this.collection.shift();
    }
  
    isEmpty() {
      return this.collection.length === 0;
    }
    toArray(){
      return this.collection.splice();
    }
    ishas(Node){
      return this.collection.some(item=>item.id===Node);
    }
  }