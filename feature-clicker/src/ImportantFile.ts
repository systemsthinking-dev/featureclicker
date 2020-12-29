
import { Subject, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

console.log("Does this happen?");

export const thing = "yes";

export class ImportantThings {
  constructor() {
    this.featureWorkDone = new Subject<number>();
    this.capabilityStock = new BehaviorSubject<number>(0);

    const thing = this.featureWorkDone.pipe(
      map(_a => { return 1 })
    );

    thing.subscribe(this.capabilityStock);
  }

  public featureWorkDone: Subject<number>;

  public capabilityStock: BehaviorSubject<number>;
}

export const importantThings = new ImportantThings();

// @ts-ignore
window.things = importantThings;

importantThings.featureWorkDone.subscribe(stuff => { console.log("Got stuff: " + stuff) });
