
import { Subject, BehaviorSubject } from "rxjs";

console.log("Does this happen?");

export const thing = "yes";

export class ImportantThings {
  constructor() {
    this.featureWorkDone = new Subject<number>();
    this.capabilityStock = new BehaviorSubject<number>(0);

    this.featureWorkDone.subscribe(this.capabilityStock);
  }

  public featureWorkDone: Subject<number>;

  public capabilityStock: BehaviorSubject<number>;
}

export const importantThings = new ImportantThings();

// @ts-ignore
window.things = importantThings;

importantThings.featureWorkDone.subscribe(stuff => { console.log("Got stuff: " + stuff) });
