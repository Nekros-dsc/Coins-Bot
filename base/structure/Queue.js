class Queue {
    constructor() {
      this.queue = [];
      this.processing = false;
      this.delay = 5000; // 5000 millisecondes = 5 secondes
    }
  
    addJob(job) {
      this.queue.push(job);
      if (!this.processing) {
        this.processing = true;
        this.bumpQueue();
      }
    }
  
    async bumpQueue() {
      const job = this.queue.shift();
      if (!job) {
        this.processing = false;
        return;
      }
  
      let calledBack = false;
      const cb = () => {
        if (calledBack) return;
  
        calledBack = true;
        this.processing = false;
        this.bumpQueue();
      };
  
      try {
        await job(cb);
      } catch (e) {
        cb();
      }
  
      // Vider automatiquement la queue après le délai
      setTimeout(() => {
        this.queue = [];
        this.processing = false;
        console.log('La queue a été vidée automatiquement.');
      }, this.delay);
    }
  }
  
  module.exports = Queue;
  