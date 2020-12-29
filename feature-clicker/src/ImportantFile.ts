
import { Subject } from "rxjs";

console.log("Does this happen?");

export const thing = "yes";

export class ImportantThings {
  featureWorkDone = new Subject<"yes">();
}

export const importantThings = new ImportantThings();

importantThings.featureWorkDone.subscribe(stuff => { console.log("Got stuff: " + stuff) });
