
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { scan } from "rxjs/operators";

console.log("Does this happen?");

export const thing = "yes";

export type ClickOnFeatureWork = { data: { timestamp: number } };

export class ImportantThings {
  constructor() {
    this.featureWorkDone = new Subject<ClickOnFeatureWork>();
    this.capabilityStock = new BehaviorSubject<number>(0);

    const thing: Observable<number> = this.featureWorkDone.pipe(
      scan(countSoFar => countSoFar + 1, 0)
    );

    thing.subscribe(this.capabilityStock);
  }

  public featureWorkDone: Subject<ClickOnFeatureWork>;

  public capabilityStock: BehaviorSubject<number>;
}

export const importantThings = new ImportantThings();

// @ts-ignore
window.things = importantThings;

importantThings.featureWorkDone.subscribe(stuff => { console.log("Got stuff: " + JSON.stringify(stuff, null, 2)) });
