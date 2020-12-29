
import { Subject, BehaviorSubject } from "rxjs";

console.log("Does this happen?");

export const thing = "yes";

export class ImportantThings {
  constructor() {
    this.featureWorkDone = new Subject<"yes">();
    this.capabilityStock = new BehaviorSubject<number>(0);
  }

  public featureWorkDone: Subject<"yes">;

  public capabilityStock: BehaviorSubject<number>;
}

export const importantThings = new ImportantThings();

// @ts-ignore
window.things = importantThings;

importantThings.featureWorkDone.subscribe(stuff => { console.log("Got stuff: " + stuff) });
