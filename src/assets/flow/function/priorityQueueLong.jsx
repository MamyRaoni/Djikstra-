export class PriorityQueueLong {
  constructor(comparator = (a, b) => b.distance - a.distance) {
    this.collection = [];
    this.comparator = comparator;
  }

  enqueue(element) {
    const index = this.collection.findIndex(item => this.comparator(item, element) > 0);
    if (index === -1) {
      this.collection.push(element);
    } else {
      this.collection.splice(index, 0, element);
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