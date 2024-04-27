export class EventEmitter {
  events;
  constructor() {
    this.events = new Map();
  }
  on(e: string, t: any) {
    let s = this.events.get(e);
    s || ((s = new Set()), this.events.set(e, s)), s.add(t);
  }
  off(e: string, t?: any) {
    const s = this.events.get(e);
    s && (t ? s.delete(t) : this.events.delete(e));
  }
  emit(e: string, ...t: any[]) {
    const s = this.events.get(e);
    s &&
      s.forEach((n: any) => {
        n(...t);
      });
  }
  once(e: string, t?: any) {
    const s = (...n: any[]) => {
      t(...n), this.off(e, s);
    };
    this.on(e, s);
  }
}
