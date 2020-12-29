
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { reduce, map } from "rxjs/operators";

console.log("Does this happen?");

export const thing = "yes";

type ClickOnFeatureWork = object;

export class ImportantThings {
  constructor() {
    this.featureWorkDone = new Subject<ClickOnFeatureWork>();
    this.capabilityStock = new BehaviorSubject<number>(0);

    let poo = 0;
    const thing: Observable<number> = this.featureWorkDone.pipe(
      map((a) => {
        console.log("so far: " + poo + " incoming: " + a);
        return poo++;
      })
    );

    thing.subscribe(this.capabilityStock);
  }

  public featureWorkDone: Subject<ClickOnFeatureWork>;

  public capabilityStock: BehaviorSubject<number>;
}

export const importantThings = new ImportantThings();

// @ts-ignore
window.things = importantThings;

importantThings.featureWorkDone.subscribe(stuff => { console.log("Got stuff: " + stuff) });
