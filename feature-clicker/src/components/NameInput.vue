<template>
  <span>
    <label for="nameInput">My name: </label>
    <input id="nameInput" v-model.lazy="currentName"></input>
  </span>
</template>

What does this do? Is it all comments out here?

<script lang=ts>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  model: {
    event: "nameChange",
  },
})
export default class NameInput extends Vue {
  @Prop({ default: "Fred" }) private defaultName!: string;

  private _currentName: string = "so rude. You won't see this";

  get currentName() {
    return this._currentName || this.defaultName; // rude: It somehow calls this method bEFORE initializing the class.
  }

  set currentName(newName: string) {
    this._currentName = newName;
    this.$emit("nameChange", newName);
  }
}
</script>

<style scoped>
</style>
