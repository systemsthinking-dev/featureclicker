<template>
 <input v-model.lazy="currentName"></input>
</template>

<script lang=ts>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  model: {
    event: "nameChange",
  },
})
export default class NameInput extends Vue {
  @Prop({ default: "Fred" }) private defaultName!: string;
  constructor() {
    super();
    this._currentName = "set in constructor";
  }
  private _currentName: string = "you won't see this";

  get currentName() {
    console.log("Retrieving current name of " + this._currentName);
    return this._currentName || this.defaultName; // incredibly rude: It somehow calls this method bEFORE initializing the class.
  }

  set currentName(newName: string) {
    this._currentName = newName;
    this.$emit("nameChange", newName);
    console.log("Name was set");
  }
}
</script>

<style scoped>
</style