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
                  this.collection.splice(i, 0, element);
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

  toArray() {
      return this.collection.slice();
  }

  has(node) {
      return this.collection.some(item => item.id === node.id);
  }

  updatePriority(node) {
      const index = this.collection.findIndex(item => item.id === node.id);
      if (index !== -1) {
          this.collection.splice(index, 1);
          this.enqueue(node);
      }
  }
}