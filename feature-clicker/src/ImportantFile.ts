
import { Subject } from "rxjs";

console.log("Does this happen?");

export const thing = "yes";

export type ImportantThings = {
  featureWorkDone: Subject<"yes">;
}

export const importantThings: ImportantThings = {
  featureWorkDone: new Subject(),
};

importantThings.featureWorkDone.subscribe(stuff => { console.log("Got stuff: " + stuff) });
